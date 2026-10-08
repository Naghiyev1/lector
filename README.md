# Lector — Learn Spanish by reading full books

I want to create a web app to read books in Spanish literature. It needs to have proper full books, and help users to improve their Spanish gradually through reading full books. I don’t want to pay any hosting fees so we need to use only free resources and it needs to have a good amount of books not like just 2-3 books. User should be able to choose a book and start reading it and return back to where left the next day from where they left. It also needs to have proper translations, like when you tap on a word it gives to translation in English for the word. If possible it should pick up the context too. So it shouldn’t just give you the word if possible as sometimes it can be confusing for the reader. It would be useful to have an option to hear the word as well. It should be something like epub reader but for Spanish learners. It should maybe start from easy books then , once the reader finishes one book it gives another one and also it should help the reader to build the daily reading habit.  Maybe  also would be good to allow the user to upload their own epub books / files too.

**Live app:** https://naghiyev1.github.io/read-espanol-flow/

## How it works (everything is free)

| Part | Where it comes from |
| --- | --- |
| The app itself | A static website on **GitHub Pages**, rebuilt automatically on every change |
| Book catalog and search | **Gutendex** (free Project Gutenberg catalog), called straight from the browser |
| Book text | **Project Gutenberg**, through a tiny free **Cloudflare Worker** (the "book relay") |
| Word and sentence translation | **MyMemory** free translation API, called from the browser |
| Audio | The browser's built-in speech |
| Progress, streak, saved words, uploaded books | Saved **on the reader's device** — no accounts, no database |

Why the book relay? Project Gutenberg doesn't allow browsers to download its files from
other websites. The relay is a ~60-line program (`cloudflare-worker/worker.js`) that fetches
a Gutenberg file and hands it to the app. Each book is downloaded once per device, then
saved there.

## One-time setup

### 1. Turn on GitHub Pages

In this repository: **Settings → Pages → Build and deployment → Source → GitHub Actions**.

From now on, every change pushed to the `main` branch is built and published
automatically (about 1–2 minutes). Progress is shown in the **Actions** tab.
If a run failed before Pages was turned on, open it in the Actions tab and click
**Re-run all jobs**.

> Keep this repository **public** — GitHub Pages is free for public repositories.

### 2. Set up the book relay (free Cloudflare Worker, ~5 minutes)

1. Create a free account at <https://dash.cloudflare.com/sign-up> (no credit card needed).
2. In the dashboard open **Workers & Pages** (may be shown as **Compute → Workers**) and
   click **Create** → **Start with Hello World!**. Name it `lector-relay` and click **Deploy**.
   (The first time, Cloudflare asks you to pick a `workers.dev` subdomain — any name is fine.)
3. Click **Edit code**, delete everything in the editor, paste the full contents of
   [`cloudflare-worker/worker.js`](cloudflare-worker/worker.js), and click **Deploy**.
4. Copy the worker's address — it looks like `https://lector-relay.your-name.workers.dev`.
   Open it in your browser: it should say **Lector book relay is running.**

### 3. Connect the app to the relay

On GitHub, open [`src/config.ts`](src/config.ts), click the pencil icon (**Edit this file**),
and paste your worker address between the quotes:

```ts
export const BOOK_RELAY_URL = "https://lector-relay.your-name.workers.dev";
```

Click **Commit changes**. The site rebuilds automatically — after 1–2 minutes, open the
live app, go to **Biblioteca** and open any book.

## Good to know

- **Limits:** Cloudflare's free plan allows 100,000 relay requests per day; opening a book
  for the first time uses one or two. MyMemory's free translations have a daily limit per user.
- **Data stays on each device**, per website address. Progress made on the old
  `read-espanol-flow.lovable.app` address does not appear here.
- **Custom domain:** works without code changes (Settings → Pages → Custom domain).

## Changing the app

Edit files on GitHub (or locally and push). Each commit to `main` redeploys automatically.

To run it on your computer you need [Node.js](https://nodejs.org/) 22 or newer:

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # production build in dist/
npm test
```

## Project map

| Path | What it is |
| --- | --- |
| `src/routes/` | The pages: `index.tsx` (Hoy), `library.tsx` (Biblioteca), `words.tsx` (Palabras), `read.$bookId.tsx` (reader) |
| `src/lib/books.functions.ts` | Catalog search and book download |
| `src/lib/path.ts` | The reading path (easy → advanced) |
| `src/lib/storage.ts` | Everything saved on the device |
| `src/lib/translate.ts` | Translation and speech |
| `src/lib/epub.ts` | Reading uploaded EPUB/TXT files |
| `src/config.ts` | The book relay address |
| `cloudflare-worker/worker.js` | The book relay |
| `.github/workflows/deploy.yml` | Builds and publishes the site to GitHub Pages |
