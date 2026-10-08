// Lector book relay — a tiny Cloudflare Worker (the free plan is plenty).
//
// Why it exists: Project Gutenberg doesn't let browsers download its files from other
// websites (it sends no CORS headers). The app asks this worker for a Gutenberg file;
// the worker downloads it and hands it back with the header browsers need.
//
// Safe: it only fetches Project Gutenberg addresses, so it can't be used as an open proxy.
// Cheap: it does no processing (the app does that in the browser), so it stays far below
// the free plan's limits. Each book is downloaded once per device and then saved there.
//
// Setup: see "Set up the book relay" in README.md.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

function isGutenberg(url) {
  const host = url.hostname.toLowerCase();
  const okProtocol = url.protocol === "https:" || url.protocol === "http:";
  return okProtocol && (host === "gutenberg.org" || host.endsWith(".gutenberg.org"));
}

function message(text, status) {
  return new Response(text, {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" },
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
    if (request.method !== "GET") return message("Only GET requests are supported.", 405);

    const target = new URL(request.url).searchParams.get("url");
    if (!target) return message("Lector book relay is running.", 200);

    let url;
    try {
      url = new URL(target);
    } catch {
      return message("That is not a valid address.", 400);
    }
    if (!isGutenberg(url)) return message("Only Project Gutenberg addresses are allowed.", 403);

    let upstream;
    try {
      upstream = await fetch(url.toString(), { redirect: "follow" });
    } catch {
      return message("Project Gutenberg could not be reached. Try again in a moment.", 502);
    }

    const headers = new Headers(CORS_HEADERS);
    const type = upstream.headers.get("Content-Type");
    if (type) headers.set("Content-Type", type);
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
