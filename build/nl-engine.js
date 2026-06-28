/* ===================================================================
   TIMELINE — NL engine. Produces a Dutch puzzles array from the
   English build/puzzles.json, preserving puzzle logic exactly.
   Strategy: parse each EN clue -> structured constraint, render in
   Dutch, then RE-PARSE the Dutch to confirm identical constraints.
   globalThis.NL_ENGINE = { TERMS, buildDutch(puzzles), ... }
   =================================================================== */
(function(){
  // ---- term glossary: en -> [nl, gender]  (gender '' = proper/self-articled) ----
  const ART = {
    "lodestone":["magneetsteen","de"],"brass automaton":["koperen automaat","de"],
    "bronze gear":["bronzen tandwiel","het"],"water clock":["waterklok","de"],
    "water escapement":["wateruurwerk","het"],"star dial":["nocturlabium","het"],
    "leyden jar":["leidse fles","de"],"glass lens":["glazen lens","de"],
    "glass plate":["glasplaat","de"],"glass diode":["glazen diode","de"],
    "glass vial":["glazen flacon","de"],"copper coil":["koperen spoel","de"],
    "tuning fork":["stemvork","de"],"tuning coil":["afstemspoel","de"],
    "carbon filament":["koolstofdraad","de"],"carbon mic":["koolstofmicrofoon","de"],
    "cathode tube":["kathodebuis","de"],"circuit board":["printplaat","de"],
    "camera module":["cameramodule","de"],"dynamo":["dynamo","de"],
    "marine chronometer":["scheepschronometer","de"],"gyrocompass":["gyrokompas","het"],
    "compass rotor":["kompasrotor","de"],"star map":["sterrenkaart","de"],
    "wax cylinder":["wasrol","de"],"film reel":["filmrol","de"],
    "ink press":["inktpers","de"],"type tray":["letterbak","de"],
    "relief block":["reliëfblok","het"],"spring motor":["veermotor","de"],
    "iron flywheel":["ijzeren vliegwiel","het"],"gear train":["tandwieloverbrenging","de"],
    "geared abacus":["telraam met tandwielen","het"],"ball bearing":["kogellager","het"],
    "ball mill":["kogelmolen","de"],"saltpeter cache":["salpetervoorraad","de"],
    "rock drill":["rotsboor","de"],"ore separator":["ertsscheider","de"],
    "diesel pump":["dieselpomp","de"],"pressure gauge":["manometer","de"],
    "depth sounder":["dieptemeter","de"],"tide chart":["getijdenkaart","de"],
    "tide computer":["getijdencomputer","de"],"vacuum flask":["vacuümfles","de"],
    "fuel cell":["brandstofcel","de"],"battery cell":["batterijcel","de"],
    "field battery":["veldbatterij","de"],"reed battery":["rietbatterij","de"],
    "solar panel":["zonnepaneel","het"],"solar array":["zonnepanelenveld","het"],
    "selenium cell":["seleniumcel","de"],"porcelain capacitor":["porseleinen condensator","de"],
    "phosphor screen":["fosforscherm","het"],"touchscreen":["aanraakscherm","het"],
    "guidance computer":["besturingscomputer","de"],"telemetry pod":["telemetriemodule","de"],
    "ion thruster":["ionenmotor","de"],"wind rotor":["windrotor","de"],
    "wind vane":["windvaan","de"],"weather drone":["weerdrone","de"],
    "seismic node":["seismische sensor","de"],"ice-core beacon":["ijskernbaken","het"],
    "wave detector":["golfdetector","de"],"signal lamp":["seinlamp","de"],
    "signal booster":["signaalversterker","de"],"radio mast":["radiomast","de"],
    "radio sextant":["radiosextant","de"],"antenna coil":["antennespoel","de"],
    "antenna dish":["schotelantenne","de"],"valve receiver":["buizenontvanger","de"],
    "wireless key":["draadloze sleutel","de"],"headset array":["hoofdtelefoonset","de"],
    "speaker membrane":["luidsprekermembraan","het"],"silk diaphragm":["zijden membraan","het"],
    "amplifier":["versterker","de"],"ribbon cable":["lintkabel","de"],
    "silver wire":["zilverdraad","de"],"encryption drum":["encryptietrommel","de"],
    "black cube":["zwarte kubus","de"],"jade resonator":["jade resonator","de"],
    "lacquer cell":["lakcel","de"],"paper circuit":["papieren circuit","het"],
    "bronze relay":["bronzen relais","het"],"bronze turbine":["bronzen turbine","de"],
    "brass turbine":["koperen turbine","de"],"brass key":["koperen sleutel","de"],
    "cracked watch":["gebarsten horloge","het"],"torn page":["gescheurde bladzijde","de"],
    "lead seal":["loden zegel","het"],"optical bench":["optische bank","de"],
    "lens array":["lenzenstelsel","het"],"grid overlay":["rasteroverlay","de"],
    "polar projection":["poolprojectie","de"],"contour engraving":["contourgravure","de"],
    "photo plate":["fotoplaat","de"],"battery sled":["batterijslede","de"]
  };
  const EVENT = {
    "the printing press":"de drukpers","the steam engine":"de stoommachine",
    "the camera":"de camera","the dynamo":"de dynamo","the telegraph":"de telegraaf",
    "the pendulum clock":"het slingeruurwerk","gunpowder":"buskruit",
    "the Eclipse":"de Verduistering","the First Broadcast":"de Eerste Uitzending",
    "the Founding":"de Stichting","the Memory Wipe":"de Geheugenwissing",
    "the Quiet War":"de Stille Oorlog","the Severance":"de afsplitsing"
  };

  function yearNL(lbl){ return lbl.replace(/\bBCE\b/,'v.Chr.').replace(/\bCE\b/,'n.Chr.'); }
  function cap(s){ return s ? s[0].toUpperCase()+s.slice(1) : s; }

  // endpoint -> {txt, art, proper}  (art='' when proper/self-articled)
  function nlEndpoint(cats, ep, unmapped){
    const cat=cats[ep.c], it=cat.items[ep.i], lab=it.label;
    if(cat.role==='year') return {txt:yearNL(lab), art:'', proper:true, role:'year'};
    if(cat.role==='artifact'){
      const m=ART[lab]; if(!m){ unmapped.add('ARTIFACT: '+lab); return {txt:lab,art:'de',proper:false,role:'artifact'}; }
      return {txt:m[0], art:m[1], proper:false, role:'artifact'};
    }
    if(cat.role==='event'){
      const m=EVENT[lab]; if(!m){ unmapped.add('EVENT: '+lab); return {txt:lab,art:'',proper:true,role:'event'}; }
      return {txt:m, art:'', proper:true, role:'event'};
    }
    // person / vessel / place -> keep original
    return {txt:lab, art:'', proper:true, role:cat.role};
  }
  // noun phrase with article
  function np(ep, capit){
    if(ep.proper || !ep.art) return capit?cap(ep.txt):ep.txt;
    return (capit?cap(ep.art):ep.art)+' '+ep.txt;
  }
  // time expression for LT/ADJ (neutral 'het dossier van' head avoids de/het issues)
  function timeExpr(ep, capit){
    if(ep.role==='year') return ep.txt;
    return (capit?'Het':'het')+' dossier van '+np(ep,false);
  }

  // ---- Dutch clue renderer ----
  function renderNL(type, A, B){ // A,B already nlEndpoint; for LT/ADJ A=earlier,B=later
    if(type==='SAME'){
      if(A.role==='year' || B.role==='year'){
        const yr=A.role==='year'?A:B, X=A.role==='year'?B:A;
        return cap(np(X,true))+' is vastgelegd op '+yr.txt+'.';
      }
      return cap(np(A,true))+' hoort bij '+np(B,false)+'.';
    }
    if(type==='DIFF'){
      if(A.role==='year' || B.role==='year'){
        const yr=A.role==='year'?A:B, X=A.role==='year'?B:A;
        return cap(np(X,true))+' is niet vastgelegd op '+yr.txt+'.';
      }
      return cap(np(A,true))+' hoort niet bij '+np(B,false)+'.';
    }
    if(type==='LT'){
      return cap(timeExpr(A,true))+' ligt eerder in de tijdlijn dan '+timeExpr(B,false)+'.';
    }
    if(type==='ADJ'){
      return cap(timeExpr(B,true))+' is de eerstvolgende registratie ná '+timeExpr(A,false)+'.';
    }
    return '??';
  }

  // ---- Dutch re-parser (verifies our own output) ----
  function nlEndpointsAll(cats){ // [{ci,ii,nl-lowercased}]
    const out=[];
    cats.forEach((cat,ci)=>cat.items.forEach((it,ii)=>{
      let t;
      if(cat.role==='year') t=yearNL(it.label);
      else if(cat.role==='artifact') t=(ART[it.label]?ART[it.label][0]:it.label);
      else if(cat.role==='event') t=(EVENT[it.label]||it.label);
      else t=it.label;
      out.push({ci,ii,lab:t.toLowerCase()});
    }));
    return out;
  }
  function findNL(fact, cats){
    const lf=fact.toLowerCase(); const all=nlEndpointsAll(cats); const hits=[];
    all.forEach(h=>{ if(lf.indexOf(h.lab)>=0) hits.push(Object.assign({pos:lf.indexOf(h.lab)},h)); });
    const filt=hits.filter(h=>!hits.some(o=>o!==h&&o.lab.length>h.lab.length&&o.lab.indexOf(h.lab)>=0));
    const u=[]; filt.forEach(h=>{ if(!u.some(x=>x.ci===h.ci&&x.ii===h.ii))u.push(h); });
    return u;
  }
  function parseNL(text, cats){
    const fact=text.replace(/<span[^>]*class="cl-src"[^>]*>.*?<\/span>/g,'').replace(/<[^>]+>/g,'').trim();
    const eps=findNL(fact,cats); if(eps.length!==2) return null;
    let type;
    if(/eerstvolgende registratie ná/.test(fact)) type='ADJ';
    else if(/ligt eerder in de tijdlijn dan/.test(fact)) type='LT';
    else if(/hoort niet bij|is niet vastgelegd op/.test(fact)) type='DIFF';
    else type='SAME';
    let a,b;
    if(type==='LT'||type==='ADJ'){
      const lf=fact.toLowerCase(); const i0=lf.indexOf(eps[0].lab), i1=lf.indexOf(eps[1].lab);
      const first=i0<i1?eps[0]:eps[1], second=i0<i1?eps[1]:eps[0];
      if(type==='LT'){ a=first; b=second; }           // "A ligt eerder ... dan B"
      else { b=first; a=second; }                      // "B is de eerstvolgende ná A"
    } else { a=eps[0]; b=eps[1]; }
    return {type, a:{c:a.ci,i:a.ii}, b:{c:b.ci,i:b.ii}};
  }

  globalThis.NL_ENGINE = { ART, EVENT, yearNL, nlEndpoint, renderNL, parseNL };
})();
