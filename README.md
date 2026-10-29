# KreativeTab

KreativeTab’s agency website, built with Astro, Tailwind CSS, Markdoc and [Keystatic](https://keystatic.com) (CMS). Hosted on Vercel.

- Live: https://kreativetab.vercel.app
- CMS: https://kreativetab.vercel.app/keystatic (also `/admin`)

## Editing content (no code needed)

Keystatic is a free, Git-based CMS. Every change you save in the editor is committed to this GitHub repo, and Vercel redeploys the site automatically (about 1–2 minutes).

1. Open **/keystatic** on the live site and click **Log in with GitHub** (you need write access to this repo).
2. **Portfolio → Create.** Fill in title, client, category, short description, cover image (+ alt text) and optional gallery images (each with alt text), tick **Featured** to show it first on the home page.
3. Use the **SEO** box on any item to override the Google/social title and description, or hide it from search engines.
4. Click **Create** / **Save**. Keystatic commits to `main` and Vercel publishes it.

Sections:

| Group | What’s there |
| --- | --- |
| Content | Portfolio (`/work/<slug>`), Pages (home, about, services, works, news, contact), Blog posts (`/post/<slug>`) |
| Site settings | Header menu, footer, default SEO (title, description, X/Twitter handle), contact details & social links, chat widget |
| Italian (optional) | The same, for the `/it/` version of the site |

Items marked **Example** (and the “Example” badge on the site) are placeholder template content — replace or delete them before launch.

### One-time CMS setup on Vercel (owner only)

Keystatic needs a GitHub App to log editors in on the live site:

1. Locally: `bun install && PUBLIC_KEYSTATIC_STORAGE=github bun run dev`, open http://localhost:4321/keystatic and follow **“Create GitHub App”** (enter `https://kreativetab.vercel.app` as the deployed URL). Keystatic writes four values to `.env`.
2. Add these to Vercel → Project → Settings → Environment Variables (Production + Preview): `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
3. Install the GitHub App on the `KreativeTab` repo and redeploy.

## Local development

```sh
bun install
bun run dev        # http://localhost:4321, CMS at /keystatic (edits local files)
bun run build      # production build (.vercel/output)
bun run test       # SEO checks on the build output
bun run icons      # regenerate favicons/PWA icons from public/favicon.svg
```

## SEO

- Per-page title/description (CMS **SEO** fields; site defaults in **Site settings → SEO**)
- Canonical URLs, Open Graph + Twitter `summary_large_image` cards
- Share images: generated 1200×630 cards for pages (`<page>/og.png`), cover images for portfolio and posts
- `sitemap-index.xml` (with en/it hreflang) and `robots.txt`; preview deployments are `noindex`
- JSON-LD: Organization + WebSite on every page, CreativeWork + BreadcrumbList on portfolio items, BlogPosting on posts, ItemList on the works page
- Required alt text fields for cover and gallery images

Set `PUBLIC_SITE_URL` in Vercel when a custom domain is connected so canonicals and the sitemap use it.
