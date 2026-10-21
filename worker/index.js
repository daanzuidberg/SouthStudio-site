/* ============================================================
 SouthStudio — form handler (Cloudflare Worker)

 Serves POST /api/form for the newsletter ("Dispatch") and the
 Timeline pre-order reservation. Everything else is static assets.

 Nothing here needs a code change to switch on. Configure either
 or both sinks (Cloudflare dashboard → Workers → southstudio →
 Settings), then redeploy or just save:

   Email (Resend, https://resend.com)
     Secrets / variables:  RESEND_API_KEY   (secret)
                           NOTIFY_TO        (e.g. info@southstudio.online)
                           NOTIFY_FROM      (an address on a domain verified in Resend)

   Storage (Workers KV)
     Create a namespace and bind it as  FORMS
     (Settings → Bindings → KV namespace). Newsletter signups are
     stored per address, pre-orders per submission. With the same
     binding, abuse is rate limited per visitor.

 With neither configured the endpoint answers 503 and the site
 falls back to opening the visitor's mail app (the old behaviour),
 so the forms never break.
 ============================================================ */

const ALLOWED_HOSTS = ["southstudio.online", "www.southstudio.online", "southstudio.nl", "www.southstudio.nl"];
const MAX_BODY = 8 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KINDS = { newsletter: "Newsletter signup", preorder: "Timeline pre-order" };
const RATE_LIMIT = { max: 6, windowSeconds: 600 };

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });
}

function clean(value, max) {
  return String(value == null ? "" : value).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

async function sha(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function originAllowed(request, url) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = new URL(origin).host;
    return host === url.host || ALLOWED_HOSTS.includes(host);
  } catch (e) {
    return false;
  }
}

async function rateLimited(env, request) {
  if (!env.FORMS) return false;
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const key = "rl:" + (await sha(ip)).slice(0, 24);
  const current = parseInt((await env.FORMS.get(key)) || "0", 10);
  if (current >= RATE_LIMIT.max) return true;
  await env.FORMS.put(key, String(current + 1), { expirationTtl: RATE_LIMIT.windowSeconds });
  return false;
}

async function store(env, lead) {
  if (!env.FORMS) return null;
  const key = lead.kind === "newsletter"
    ? "newsletter:" + lead.email.toLowerCase()
    : "preorder:" + lead.ts + ":" + (await sha(lead.email + lead.ts)).slice(0, 8);
  await env.FORMS.put(key, JSON.stringify(lead));
  return true;
}

async function notify(env, lead) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO || !env.NOTIFY_FROM) return null;
  const lines = [
    KINDS[lead.kind],
    "",
    "Email:   " + lead.email,
    lead.name ? "Name:    " + lead.name : null,
    lead.edition ? "Edition: " + lead.edition : null,
    "Language: " + lead.lang,
    "Page:    " + lead.page,
    "Time:    " + lead.ts,
  ].filter((l) => l !== null);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.NOTIFY_FROM,
      to: [env.NOTIFY_TO],
      reply_to: lead.email,
      subject: "SouthStudio — " + KINDS[lead.kind],
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) throw new Error("resend " + res.status);
  return true;
}

async function handleForm(request, env, url) {
  if (request.method !== "POST") return json({ ok: false, error: "method" }, 405, { allow: "POST" });
  if (!originAllowed(request, url)) return json({ ok: false, error: "origin" }, 403);

  const length = parseInt(request.headers.get("content-length") || "0", 10);
  if (length > MAX_BODY) return json({ ok: false, error: "too_large" }, 413);

  let form;
  try {
    form = await request.formData();
  } catch (e) {
    return json({ ok: false, error: "body" }, 400);
  }

  // honeypot: real visitors never see or fill this field
  if (clean(form.get("website"), 200)) return json({ ok: true });

  const kind = clean(form.get("kind"), 20);
  if (!KINDS[kind]) return json({ ok: false, error: "kind" }, 400);

  const email = clean(form.get("email"), 254);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "email" }, 400);

  const lead = {
    kind,
    email,
    name: clean(form.get("name"), 100),
    edition: clean(form.get("edition"), 80),
    lang: clean(form.get("lang"), 2) === "nl" ? "nl" : "en",
    page: clean(form.get("page"), 120),
    ts: new Date().toISOString(),
  };
  if (kind === "preorder") {
    if (!lead.name) return json({ ok: false, error: "name" }, 400);
    if (clean(form.get("consent"), 5) !== "yes") return json({ ok: false, error: "consent" }, 400);
  }

  const configured = Boolean(env.FORMS) || Boolean(env.RESEND_API_KEY && env.NOTIFY_TO && env.NOTIFY_FROM);
  if (!configured) return json({ ok: false, error: "not_configured" }, 503);

  if (await rateLimited(env, request)) return json({ ok: false, error: "rate_limited" }, 429, { "retry-after": String(RATE_LIMIT.windowSeconds) });

  const results = await Promise.allSettled([store(env, lead), notify(env, lead)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value === true);
  if (!delivered) return json({ ok: false, error: "delivery" }, 502);
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/form") return handleForm(request, env, url);
    if (url.pathname.startsWith("/api/")) return json({ ok: false, error: "not_found" }, 404);
    return env.ASSETS.fetch(request);
  },
};
