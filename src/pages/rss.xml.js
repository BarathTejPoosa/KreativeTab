import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
	const posts = await getCollection("posts");
	return rss({
		title: "KreativeTab | Insights",
		description: "My journey learning Astro",
		site: "https://my-blog-site.netlify.app",
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			link: `/post/${post.slug}/`,
		})),
		customData: "<language>en-us</language>",
	});
}
