import { getCollection } from "astro:content";

/** Published (not hidden) posts for a locale. */
export async function getPublishedPosts(locale: string) {
	const posts = await getCollection("posts");
	return posts.filter((post) => post.slug.startsWith(`${locale}/`) && !post.data.hidden);
}

/** The News page only shows in the nav, footer and sitemap once a locale has a published post. */
export async function hasPublishedPosts(locale: string) {
	return (await getPublishedPosts(locale)).length > 0;
}

export const isNewsLink = (link: string) => link.replace(/\/+$/, "") === "/news";
