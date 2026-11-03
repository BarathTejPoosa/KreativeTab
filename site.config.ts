/**
 * Site-wide settings.
 *
 * The public URL is resolved at build time so canonical URLs, Open Graph tags,
 * the sitemap and robots.txt always point at the real production address:
 *   1. PUBLIC_SITE_URL, if set (to override the domain), or
 *   2. the production domain, kreativetab.com.
 */
const env = typeof process !== "undefined" ? process.env : ({} as Record<string, string | undefined>);

function resolveSiteUrl(): string {
	const explicit = env.PUBLIC_SITE_URL?.trim();
	if (explicit) return explicit.replace(/\/+$/, "");
	return "https://kreativetab.com";
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
