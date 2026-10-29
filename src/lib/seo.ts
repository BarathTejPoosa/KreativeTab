import contacts from "@/content/global/contacts.json";
import { siteTitle, siteUrl } from "site.config";

export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

/** Turn a root-relative path into an absolute URL on the production site. */
export const absoluteUrl = (path: string) => new URL(path, `${siteUrl}/`).toString();

/** Directory-style URLs always end with "/" so canonicals match the sitemap. */
export const withTrailingSlash = (pathname: string) =>
	pathname.endsWith("/") || /\.[a-z0-9]+$/i.test(pathname) ? pathname : `${pathname}/`;

export function organizationJsonLd(description?: string) {
	const sameAs = (contacts.socials ?? [])
		.map((s: { link?: string }) => s.link)
		.filter((link): link is string => Boolean(link));
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": organizationId,
		name: siteTitle,
		url: `${siteUrl}/`,
		logo: absoluteUrl("/pwa-512x512.png"),
		...(description ? { description } : {}),
		...(contacts.mail ? { email: contacts.mail } : {}),
		...(contacts.phone ? { telephone: contacts.phone } : {}),
		...(sameAs.length ? { sameAs } : {}),
	};
}

export function websiteJsonLd(locale: string) {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": websiteId,
		name: siteTitle,
		url: `${siteUrl}/`,
		inLanguage: locale,
		publisher: { "@id": organizationId },
	};
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: absoluteUrl(withTrailingSlash(item.path)),
		})),
	};
}

/** Serialise JSON-LD safely for an inline <script>. */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
