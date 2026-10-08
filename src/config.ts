// ─────────────────────────────────────────────────────────────────────────────
// Lector settings
// ─────────────────────────────────────────────────────────────────────────────
//
// BOOK_RELAY_URL — the address of your free Cloudflare Worker that downloads book
// text from Project Gutenberg (Gutenberg doesn't let browsers download its files
// from other websites, so a tiny relay is needed). Setup takes ~5 minutes and is
// explained in README.md, under "Set up the book relay".
//
// Paste the address between the quotes, for example:
//   export const BOOK_RELAY_URL = "https://lector-relay.your-name.workers.dev";
//
// Until this is set, everything works except opening Project Gutenberg books
// (your own uploaded EPUB/TXT files always work).
export const BOOK_RELAY_URL = "";
