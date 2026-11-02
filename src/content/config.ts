import { defineCollection, z } from "astro:content";

// Keystatic writes empty strings / nulls for untouched optional fields, so
// optional text is normalised to `undefined` here.
const optionalText = z
	.string()
	.nullish()
	.transform((value) => (value && value.trim() !== "" ? value : undefined));

const seoOverrides = z
	.object({
		title: optionalText,
		description: optionalText,
		noindex: z.boolean().nullish(),
	})
	.nullish();

const pagesCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			subtitle: optionalText,
			type: z.string(),
			lastUpdateDate: z.date(),
			hideTitle: z.optional(z.boolean()),
			hidden: z.optional(z.boolean()),
			cover: image().nullish(),
			coverAlt: optionalText,
			seo: z.object({
				title: z.string(),
				description: z.string(),
				author: optionalText,
				image: image().nullish(),
				noindex: z.boolean().nullish(),
			}),
		}),
});

const postsCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.date(),
			lastUpdateDate: z.date(),
			description: z.string(),
			category: optionalText,
			author: z.string(),
			cover: image(),
			coverAlt: optionalText,
			tags: z.array(z.string()).default([]),
			hidden: z.optional(z.boolean()),
			example: z.boolean().default(false),
			seo: seoOverrides,
		}),
});

/** Portfolio items (Behance-style). URL: /work/<slug> */
const worksCollection = defineCollection({
	schema: ({ image }) => {
		const caption = optionalText;
		const block = z.discriminatedUnion("discriminant", [
			z.object({
				discriminant: z.literal("image"),
				value: z.object({ image: image(), alt: optionalText, caption }),
			}),
			z.object({
				discriminant: z.literal("imagePair"),
				value: z.object({
					left: image(),
					leftAlt: optionalText,
					right: image(),
					rightAlt: optionalText,
					caption,
				}),
			}),
			z.object({
				discriminant: z.literal("video"),
				value: z.object({ url: optionalText, file: optionalText, caption }),
			}),
			z.object({
				discriminant: z.literal("text"),
				value: z.object({ text: z.string() }),
			}),
		]);
		return z.object({
			title: z.string(),
			client: optionalText,
			category: optionalText,
			/** Extra filter categories the project is also listed under */
			alsoIn: z.array(z.string()).default([]),
			tags: z.array(z.string()).default([]),
			year: z.number().int(),
			cover: image(),
			coverAlt: optionalText,
			intro: optionalText,
			blocks: z.array(block).default([]),
			link: optionalText,
			extraLinks: z
				.array(z.object({ label: z.string(), url: z.string() }))
				.default([]),
			caseStudy: z
				.object({
					problem: optionalText,
					built: optionalText,
					stack: z.array(z.string()).default([]),
				})
				.optional(),
			lighthouse: z
				.object({
					performance: z.number().nullish(),
					accessibility: z.number().nullish(),
					bestPractices: z.number().nullish(),
					seo: z.number().nullish(),
					testedUrl: optionalText,
					testedOn: z.coerce.date().nullish(),
				})
				.optional(),
			featured: z.boolean().default(false),
			hidden: z.optional(z.boolean()),
			example: z.boolean().default(false),
			seo: seoOverrides,
		});
	},
});

const servicesCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.date(),
			lastUpdateDate: z.date(),
			cover: z.optional(image()),
			description: z.string(),
			hidden: z.optional(z.boolean()),
		}),
});

export const collections = {
	posts: postsCollection,
	pages: pagesCollection,
	services: servicesCollection,
	works: worksCollection,
};
