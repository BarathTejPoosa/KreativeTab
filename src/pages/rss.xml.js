import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import seo from "@/content/global/en/seo.json";
import { siteTitle, siteUrl } from "site.config";

export const prerender = true;

export async function GET() {
	const posts = (await getCollection("posts"))
		.filter((post) => post.slug.startsWith("en/") && !post.data.hidden)
		.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
	return rss({
		title: `${siteTitle} | Insights`,
		description: seo.description,
		site: siteUrl,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			link: `/post/${post.slug.replace(/^en\//, "")}/`,
			categories: post.data.tags,
		})),
		customData: "<language>en-gb</language>",
	});
}
