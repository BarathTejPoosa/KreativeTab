import { getCollectionStaticPaths } from "@/lib/collection-helpers";
import generateOgImage from "@/lib/og-image-generator";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute<CollectionProps<"pages">> = async ({ props: { data: page } }) => {
	const isHome = page?.slug.endsWith("/homepage") || page?.slug.endsWith("/index");
	const response = await generateOgImage({
		title: isHome ? (page?.data.seo.title ?? page?.data.title) : page?.data.title,
		subtitle: page?.data.seo.description,
	});
	return new Response(response, {
		status: 200,
		headers: { "Content-Type": "image/png" },
	});
};

export async function getStaticPaths() {
	return await getCollectionStaticPaths("pages");
}
