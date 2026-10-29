import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import alpinejs from "@astrojs/alpinejs";
import markdoc from "@astrojs/markdoc";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import keystatic from "@keystatic/astro";
import AstroPWA from "@vite-pwa/astro";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import { defaultLocale, isIndexable, localeTags, locales, siteTitle, siteUrl } from "./site.config";

/**
 * URLs of CMS entries marked "Hide from search engines" (seo.noindex),
 * so they are also left out of the sitemap.
 */
function noindexPaths(): Set<string> {
	const paths = new Set<string>();
	const routes = { pages: "", works: "/work", posts: "/post" } as const;
	for (const [collection, prefix] of Object.entries(routes)) {
		const dir = join("src", "content", collection);
		if (!existsSync(dir)) continue;
		for (const locale of readdirSync(dir)) {
			const localeDir = join(dir, locale);
			for (const file of readdirSync(localeDir).filter((f) => f.endsWith(".mdoc"))) {
				const frontmatter = readFileSync(join(localeDir, file), "utf8").split("---")[1] ?? "";
				if (!/^\s+noindex:\s*true\s*$/m.test(frontmatter)) continue;
				const slug = file.replace(/\.mdoc$/, "");
				const page = slug === "homepage" ? "" : `/${slug}`;
				const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
				paths.add(`${localePrefix}${prefix}${page}/`.replace(/\/+/g, "/"));
			}
		}
	}
	return paths;
}
const hiddenFromSearch = noindexPaths();

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	output: "hybrid",
	// Vercel adapter: static pages are prerendered, only the Keystatic CMS
	// routes (/keystatic and /api/keystatic) run as serverless functions.
	adapter: vercel(),
	compressHTML: true,
	i18n: {
		defaultLocale: defaultLocale,
		locales: locales,
		routing: {
			prefixDefaultLocale: false,
		},
	},
	redirects: {
		"/admin": "/keystatic",
	},
	vite: {
		define: {
			__DATE__: `'${new Date().toISOString()}'`,
		},
	},
	integrations: [
		alpinejs(),
		sitemap({
			filter: (page) => {
				const { pathname } = new URL(page);
				return !/\/(keystatic|admin|api)(\/|$)/.test(pathname) && !hiddenFromSearch.has(pathname);
			},
			i18n: {
				defaultLocale,
				locales: Object.fromEntries(
					Object.entries(localeTags).map(([locale, tag]) => [locale, tag.replace("_", "-")]),
				),
			},
		}),
		icon(),
		react(),
		markdoc(),
		keystatic(),
		robotsTxt({
			// Preview deployments are blocked entirely; production allows
			// everything except the CMS and API routes.
			policy: isIndexable
				? [{ userAgent: "*", allow: "/", disallow: ["/keystatic", "/api/", "/admin"] }]
				: [{ userAgent: "*", disallow: "/" }],
			sitemap: true,
		}),
		AstroPWA({
			mode: import.meta.env.PROD ? "production" : "development",
			base: "/",
			scope: "/",
			includeAssets: ["favicon.svg"],
			registerType: "autoUpdate",
			injectRegister: false,
			manifest: {
				name: siteTitle,
				short_name: siteTitle,
				theme_color: "#ffffff",
			},
			pwaAssets: {
				config: true,
			},
			workbox: {
				navigateFallback: "/",
				// Precache the app shell only; images are fetched on demand so
				// first-time visitors don't download every portfolio image.
				globPatterns: ["**/*.{css,js,html,ico,txt,webmanifest}", "favicon.svg", "pwa-*.png"],
				globIgnores: ["**/og.png", "originkit/**"],
				navigateFallbackDenylist: [/^\/keystatic/, /^\/api/],
				skipWaiting: true,
				maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
			},
			devOptions: {
				enabled: false,
				navigateFallbackAllowlist: [/^\//],
			},
			experimental: {
				directoryAndTrailingSlashHandler: true,
			},
		}),
	],
});
