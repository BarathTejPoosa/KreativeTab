/**
 * Site-wide settings.
 *
 * The public URL is resolved at build time so canonical URLs, Open Graph tags,
 * the sitemap and robots.txt always point at the real production address:
 *   1. PUBLIC_SITE_URL (set this in Vercel once you connect a custom domain), or
 *   2. Vercel's production domain (VERCEL_PROJECT_PRODUCTION_URL), or
 *   3. the free kreativetab.vercel.app address.
 */
const env = typeof process !== "undefined" ? process.env : ({} as Record<string, string | undefined>);

function resolveSiteUrl(): string {
	const explicit = env.PUBLIC_SITE_URL?.trim();
	if (explicit) return explicit.replace(/\/+$/, "");
	const vercelProd = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
	if (vercelProd) return `https://${vercelProd.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
	return "https://kreativetab.vercel.app";
}

export const siteUrl = resolveSiteUrl();
export const siteTitle = "KreativeTab";
/** Preview deployments must not be indexed by search engines. */
export const isIndexable = (env.VERCEL_ENV ?? "production") === "production";
export const defaultLocale = "en";
export const locales = ["en", "it"];
export type Locale = "en" | "it";
/** Locale codes used for og:locale and the sitemap's hreflang entries. */
export const localeTags: Record<Locale, string> = { en: "en_GB", it: "it_IT" };
