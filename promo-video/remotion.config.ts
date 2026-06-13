import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// This environment's egress proxy intercepts TLS (Google Fonts), and the only
// available Chromium is Playwright's headless_shell. Allow both via env vars so
// `npm run render` works without extra flags. Set REMOTION_BROWSER_EXECUTABLE
// to the headless_shell path before rendering.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
Config.setChromiumIgnoreCertificateErrors(true);
