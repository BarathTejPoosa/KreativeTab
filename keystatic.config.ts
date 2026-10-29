// keystatic.config.ts
//
// KreativeTab CMS (Keystatic). Open /keystatic on the site to edit content.
// Content is saved as files in this Git repository, so every change is
// versioned and triggers a new Vercel deployment automatically.
import { collection, config, fields, singleton } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";
import {
	ContactIcon,
	ContainerFluidIcon,
	ContainerIcon,
	FlexboxIcon,
	GeneralIcon,
	HeroIcon,
	ProseIcon,
} from "./.keystatic/keystatic-icons";
import { BrandMarkComponent } from "./.keystatic/mark";

const REPO = "BarathTejPoosa/KreativeTab" as const;

/**
 * Local development edits files on disk. The deployed site saves through
 * GitHub, so editors sign in with a GitHub account that has write access to
 * the repository. PUBLIC_KEYSTATIC_STORAGE=local|github overrides this
 * (use `github` locally once to run Keystatic's "Create GitHub App" setup).
 * This file also runs in the browser, so only import.meta.env PUBLIC_ vars are used.
 */
const storageOverride = import.meta.env?.PUBLIC_KEYSTATIC_STORAGE;
const useLocalStorage =
	storageOverride === "local" || (storageOverride !== "github" && Boolean(import.meta.env?.DEV));

type LocaleKey = "en" | "it";
const LOCALES: { key: LocaleKey; prefix: string; group: string }[] = [
	{ key: "en", prefix: "", group: "Content" },
	{ key: "it", prefix: "Italian · ", group: "Italian (optional)" },
];

/* -------------------------------------------------------------------------- */
/* Shared fields                                                              */
/* -------------------------------------------------------------------------- */

const altText = (label = "Alt text") =>
	fields.text({
		label,
		description:
			"Describe the image for screen readers and Google, e.g. “Mobile app home screen for a fitness brand”. Required for good SEO.",
	});

const seoFields = (what: string) =>
	fields.object(
		{
			title: fields.text({
				label: "SEO title",
				description: `Shown in Google and browser tabs. Leave empty to use the ${what} title. Aim for 50–60 characters.`,
				validation: { length: { max: 70 } },
			}),
			description: fields.text({
				label: "SEO description",
				description: `Shown under the title in Google. Leave empty to use the ${what} summary. Aim for 120–160 characters.`,
				multiline: true,
				validation: { length: { max: 200 } },
			}),
			noindex: fields.checkbox({
				label: "Hide from search engines",
				description: "Tick to add noindex and leave this page out of the sitemap.",
				defaultValue: false,
			}),
		},
		{ label: "SEO", description: "Optional overrides for search engines and social sharing" },
	);

const markdocBody = (imageDir: string) =>
	fields.markdoc({
		label: "Content",
		options: {
			heading: [2, 3, 4, 5, 6],
			image: {
				directory: imageDir,
				publicPath: `/${imageDir}/`,
			},
		},
		components: {},
	});

/* -------------------------------------------------------------------------- */
/* Page building blocks (used by Home, About, Services, …)                     */
/* -------------------------------------------------------------------------- */

const pageComponents = {
						Container: wrapper({
							label: "Container",
							icon: ContainerIcon({ ariaHidden: true }),
							description: "Centred container with side margins",
							schema: {
								class: fields.text({
									label: "Custom CSS classes (optional)",
								}),
							},
						}),
						ContainerFluid: wrapper({
							label: "Wide container",
							icon: ContainerFluidIcon({ ariaHidden: true }),
							description: "Full-width container with small side margins",
							schema: {
								class: fields.text({
									label: "Custom CSS classes (optional)",
								}),
							},
						}),
						Prose: wrapper({
							label: "Text block",
							icon: ProseIcon({ ariaHidden: true }),
							description: "Text block, ideal for long-form copy",
							schema: {
								class: fields.text({
									label: "Custom CSS classes (optional)",
								}),
							},
						}),
						Flex: wrapper({
							label: "Flexbox",
							icon: FlexboxIcon({ ariaHidden: true }),
							description: "Flexible row/column layout",
							schema: {
								class: fields.text({
									label: "Custom CSS classes (optional)",
									description: "Advanced: extra CSS classes",
								}),
								direction: fields.select({
									label: "Direzione",
									description: "Layout direction",
									options: [
										{ label: "Left to right", value: "ltr" },
										{ label: "Right to left", value: "rtl" },
										{ label: "Top to bottom", value: "ttb" },
										{ label: "Bottom to top", value: "btt" },
									],
									defaultValue: "ltr",
								}),
								verticalAlign: fields.select({
									label: "Vertical alignment",
									description: "Vertical alignment",
									options: [
										{ label: "Top", value: "top" },
										{ label: "Centre", value: "middle" },
										{ label: "Bottom", value: "bottom" },
										{ label: "Stretch", value: "stretch" },
										{ label: "Space between", value: "spaceBetween" },
										{ label: "Space around", value: "spaceAround" },
									],
									defaultValue: "top",
								}),
								horizontalAlign: fields.select({
									label: "Horizontal alignment",
									description: "Horizontal alignment",
									options: [
										{ label: "Left", value: "left" },
										{ label: "Centre", value: "center" },
										{ label: "Right", value: "right" },
										{ label: "Space between", value: "spaceBetween" },
										{ label: "Space around", value: "spaceAround" },
										{ label: "Space evenly", value: "spaceEvenly" },
									],
									defaultValue: "left",
								}),
								itemsAlignment: fields.select({
									label: "Item alignment",
									description: "How items line up inside the layout",
									options: [
										{ label: "Start", value: "start" },
										{ label: "Centre", value: "center" },
										{ label: "End", value: "end" },
										{ label: "Stretch", value: "stretch" },
										{ label: "Text baseline", value: "baseline" },
									],
									defaultValue: "start",
								}),
								gap: fields.number({
									label: "Gap",
									description: "Space between items",
									defaultValue: 0,
								}),
								wrap: fields.checkbox({
									label: "Wrap",
									description: "Wrap items onto a new line when there is no room",
									defaultValue: false,
								}),
							},
						}),
						Hero: block({
							label: "Hero",
							description: "Big headline section at the top of the home page",
							icon: HeroIcon({ ariaHidden: true }),
							schema: {
								title: fields.text({
									label: "Title",
									validation: {
										isRequired: true,
									},
								}),
								subtitle: fields.text({
									label: "Subtitle",
									validation: {
										isRequired: true,
									},
								}),
								buttons: fields.array(
									fields.object({
										title: fields.text({ label: "Title" }),
										href: fields.text({ label: "Url" }),
										style: fields.select({
											label: "Style",
											options: [
												{ label: "Filled", value: "button" },
												{ label: "Outlined", value: "outline" },
												{ label: "Light", value: "buttonLight" },
												{ label: "Text link", value: "primary" },
											],
											defaultValue: "button",
										}),
										icon: fields.text({ label: "Icon" }),
									}),
									// Labelling options
									{
										label: "Actions",
										itemLabel: (props) => props.fields.title.value,
									},
								),
							},
						}),
						LogoCloud: block({
							label: "LogoCloud",
							description: "LogoCloud",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {
								title: fields.text({
									label: "Title",
									validation: {
										isRequired: true,
									},
								}),
								logos: fields.array(
									fields.image({
										label: "Logo",
										directory: "src/assets/pages",
										publicPath: "/src/assets/pages/",
									}),
									{
										label: "Loghi",
									},
								),
							},
						}),
						Services: block({
							label: "Services",
							description: "Services",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {
								title: fields.text({
									label: "Title",
									defaultValue: "Three services, done properly.",
									validation: {
										isRequired: true,
									},
								}),
								services: fields.array(
									fields.object({
										title: fields.text({ label: "Title", description: "Branding, Web Design or Product Design" }),
										description: fields.text({ label: "Description", multiline: true }),
										icon: fields.image({
											label: "Icon",
											directory: "src/assets/pages",
											publicPath: "/src/assets/pages/",
										}),
									}),
									// Labelling options
									{
										label: "Servizi",
										itemLabel: (props) => props.fields.title.value,
									},
								),
							},
						}),
						VideoEffect: block({
							label: "VideoEffect",
							description: "VideoEffect",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {},
						}),
						RecentWork: block({
							label: "RecentWork",
							description: "RecentWork",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {
								title: fields.text({
									label: "Title",
									validation: {
										isRequired: true,
									},
								}),
								buttons: fields.array(
									fields.object({
										title: fields.text({ label: "Title" }),
										href: fields.text({ label: "Url" }),
										style: fields.select({
											label: "Style",
											options: [
												{ label: "Filled", value: "button" },
												{ label: "Outlined", value: "outline" },
												{ label: "Light", value: "buttonLight" },
												{ label: "Text link", value: "primary" },
											],
											defaultValue: "button",
										}),
										icon: fields.text({ label: "Icon" }),
									}),
									// Labelling options
									{
										label: "Actions",
										itemLabel: (props) => props.fields.title.value,
									},
								),
								tunnelImages: fields.array(
									fields.image({
										label: "Image",
										directory: "src/assets/pages",
										publicPath: "/src/assets/pages/",
									}),
									{
										label: "Tunnel Images",
										description: "Optional custom images for the 3D tunnel background. If empty, the covers of the recent works will be used.",
									}
								),
							},
						}),
						Testimonial: block({
							label: "Testimonial",
							description: "Testimonial",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {
								testimonial: fields.text({
									label: "Testimonial",
									multiline: true,
									validation: {
										isRequired: true,
									},
								}),
								name: fields.text({
									label: "Name",
									validation: {
										isRequired: true,
									},
								}),
							},
						}),
						Results: block({
							label: "Results",
							description: "Results",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {
								title: fields.text({
									label: "Title",
									validation: {
										isRequired: true,
									},
								}),
								results: fields.array(
									fields.object({
										label: fields.text({ label: "Label" }),
										value: fields.text({ label: "Value" }),
									}),
									// Labelling options
									{
										label: "Results",
										itemLabel: (props) => props.fields.label.value,
									},
								),
							},
						}),
						BlogLatest: block({
							label: "BlogLatest",
							description: "BlogLatest",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {
								title: fields.text({
									label: "Title",
									validation: {
										isRequired: true,
									},
								}),
							},
						}),
						About: block({
							label: "About",
							description: "About section",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {
								title: fields.text({
									label: "Title",
									validation: {
										isRequired: true,
									},
								}),
								subtitle: fields.text({
									label: "Subtitle",
									validation: {
										isRequired: true,
									},
								}),
								content: fields.text({
									label: "Content",
									multiline: true,
									validation: {
										isRequired: true,
									},
								}),
							},
						}),
						Works: block({
							label: "Works",
							description: "Works section",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {},
						}),
						News: block({
							label: "News",
							description: "News section",
							icon: GeneralIcon({ ariaHidden: true }),
							schema: {},
						}),
						Contact: block({
							label: "Contact",
							description: "Contact form section",
							icon: ContactIcon({ ariaHidden: true }),
							schema: {
								title: fields.text({
									label: "Title",
									validation: {
										isRequired: true,
									},
								}),
								fields: fields.array(
									fields.object({
										label: fields.text({ label: "Label" }),
										placeholder: fields.text({ label: "Placeholder" }),
										width: fields.number({ label: "Width" }),
										type: fields.select({
											label: "Type",
											options: [
												{ label: "Text", value: "text" },
												{ label: "Email", value: "email" },
												{ label: "Textarea", value: "textarea" },
											],
											defaultValue: "text",
										}),
										required: fields.checkbox({ label: "Required" }),
									}),
									{
										label: "Fields",
										itemLabel: (props) => props.fields.label.value,
									},
								),
							},
						}),
};

/* -------------------------------------------------------------------------- */
/* Collections                                                                */
/* -------------------------------------------------------------------------- */

const pagesCollection = (locale: LocaleKey, prefix: string) =>
	collection({
		label: `${prefix}Pages`,
		slugField: "title",
		path: `src/content/pages/${locale}/*`,
		entryLayout: "content",
		columns: ["title", "lastUpdateDate"],
		previewUrl: locale === "en" ? "/{slug}" : `/${locale}/{slug}`,
		format: { contentField: "content" },
		schema: {
			title: fields.slug({
				name: { label: "Title", validation: { isRequired: true } },
				slug: {
					label: "URL slug",
					description:
						"The page address. “homepage” is the home page. Avoid changing it after publishing, it breaks links.",
				},
			}),
			subtitle: fields.text({ label: "Subtitle", multiline: true }),
			cover: fields.image({
				label: "Cover image",
				directory: "src/assets/pages",
				publicPath: "@/assets/pages/",
			}),
			coverAlt: altText("Cover image alt text"),
			type: fields.select({
				label: "Page type",
				options: [
					{ label: "Informational", value: "informational" },
					{ label: "Service", value: "service" },
					{ label: "Contact / support", value: "support" },
					{ label: "Blog", value: "blog" },
					{ label: "Terms & conditions", value: "terms" },
				],
				defaultValue: "informational",
			}),
			lastUpdateDate: fields.date({
				label: "Last updated",
				defaultValue: { kind: "today" },
				validation: { isRequired: true },
			}),
			hideTitle: fields.checkbox({ label: "Hide the page title", defaultValue: false }),
			addPadding: fields.checkbox({ label: "Add padding", defaultValue: true }),
			seo: fields.object(
				{
					title: fields.text({
						label: "SEO title",
						description: "Shown in Google and browser tabs. Aim for 50–60 characters.",
						validation: { isRequired: true, length: { max: 70 } },
					}),
					description: fields.text({
						label: "SEO description",
						description: "Shown under the title in Google. Aim for 120–160 characters.",
						multiline: true,
						validation: { isRequired: true, length: { max: 200 } },
					}),
					author: fields.text({ label: "Author", defaultValue: "KreativeTab" }),
					image: fields.image({
						label: "Social share image (optional)",
						description: "1200×630 image used when the page is shared. Leave empty for an automatic one.",
						directory: "src/assets/pages/og",
						publicPath: "@/assets/pages/og/",
					}),
					noindex: fields.checkbox({
						label: "Hide from search engines",
						defaultValue: false,
					}),
				},
				{ label: "SEO", description: "Search engine and social sharing settings" },
			),
			content: fields.markdoc({
				label: "Content",
				options: {
					heading: [2, 3, 4, 5, 6],
					image: {
						directory: "src/assets/pages",
						publicPath: "/src/assets/pages/",
					},
				},
				components: pageComponents,
			}),
		},
	});

/** Categories used for the portfolio filter chips on /works. */
const workCategories = [
	"Branding",
	"Social & Campaigns",
	"Motion",
	"Web",
	"Product",
] as const;

const workImage = (label = "Image") =>
	fields.image({
		label,
		directory: "src/assets/works",
		publicPath: "@/assets/works/",
		validation: { isRequired: true },
	});

const workCaption = () =>
	fields.text({ label: "Caption (optional)", description: "One short line shown under the media." });

const worksCollection = (locale: LocaleKey, prefix: string) =>
	collection({
		label: `${prefix}Portfolio`,
		slugField: "title",
		path: `src/content/works/${locale}/*`,
		entryLayout: "form",
		columns: ["title", "client", "category", "year"],
		previewUrl: locale === "en" ? "/work/{slug}" : `/${locale}/work/{slug}`,
		format: { contentField: "content" },
		schema: {
			title: fields.slug({
				name: {
					label: "Project title",
					validation: { isRequired: true },
				},
				slug: {
					label: "URL slug",
					description: "The project address, e.g. /work/my-project. Avoid changing it after publishing.",
				},
			}),
			client: fields.text({ label: "Client", description: "Client or brand name (optional)" }),
			category: fields.select({
				label: "Category",
				description: "Used for the filter chips on the Works page.",
				options: workCategories.map((value) => ({ label: value, value })),
				defaultValue: "Branding",
			}),
			tags: fields.array(fields.text({ label: "Tag" }), {
				label: "Tags",
				description: "Services or tools, e.g. Logo, Identity, Figma.",
				itemLabel: (props) => props.value,
			}),
			year: fields.integer({
				label: "Year",
				defaultValue: new Date().getFullYear(),
				validation: { isRequired: true, min: 2000, max: 2100 },
			}),
			cover: fields.image({
				label: "Cover image",
				description: "Shown on the Works grid as a 4:3 tile (at least 1600×1200 works best).",
				directory: "src/assets/works",
				publicPath: "@/assets/works/",
				validation: { isRequired: true },
			}),
			coverAlt: altText("Cover image alt text"),
			intro: fields.text({
				label: "Intro (optional)",
				description: "One short paragraph shown above the images. Also used as the Google description.",
				multiline: true,
				validation: { length: { max: 400 } },
			}),
			blocks: fields.blocks(
				{
					image: {
						label: "Image (full width)",
						itemLabel: (props) => props.fields.alt.value || props.fields.caption.value || "Image",
						schema: fields.object({
							image: workImage(),
							alt: altText(),
							caption: workCaption(),
						}),
					},
					imagePair: {
						label: "Two images side by side",
						itemLabel: (props) => props.fields.caption.value || "Image pair",
						schema: fields.object({
							left: workImage("Left image"),
							leftAlt: altText("Left image alt text"),
							right: workImage("Right image"),
							rightAlt: altText("Right image alt text"),
							caption: workCaption(),
						}),
					},
					video: {
						label: "Video",
						itemLabel: (props) => props.fields.caption.value || props.fields.url.value || "Video",
						schema: fields.object({
							url: fields.text({
								label: "Video link",
								description:
									"A YouTube or Vimeo link, or a direct .mp4 link. Leave empty if you upload a file below.",
							}),
							file: fields.file({
								label: "…or upload an .mp4 (keep it under ~20 MB)",
								directory: "public/videos/works",
								publicPath: "/videos/works/",
							}),
							caption: workCaption(),
						}),
					},
					text: {
						label: "Text",
						itemLabel: (props) => props.fields.text.value.slice(0, 40) || "Text",
						schema: fields.object({
							text: fields.text({ label: "Text", multiline: true, validation: { isRequired: true } }),
						}),
					},
				},
				{
					label: "Content blocks",
					description: "The project itself: add images, image pairs, videos and short text, in order.",
				},
			),
			link: fields.url({ label: "Live project link (optional)" }),
			featured: fields.checkbox({
				label: "Featured",
				description: "Featured projects appear first on the Works page and the home page.",
				defaultValue: false,
			}),
			hidden: fields.checkbox({ label: "Hidden (draft)", defaultValue: false }),
			example: fields.checkbox({
				label: "Example / placeholder project",
				description: "Shows an “Example” badge. Untick (or delete the project) once you add real work.",
				defaultValue: false,
			}),
			seo: seoFields("project"),
			content: fields.emptyContent({ extension: "mdoc" }),
		},
	});

const postsCollection = (locale: LocaleKey, prefix: string) =>
	collection({
		label: `${prefix}Blog posts`,
		slugField: "title",
		path: `src/content/posts/${locale}/*`,
		entryLayout: "content",
		columns: ["title", "pubDate"],
		previewUrl: locale === "en" ? "/post/{slug}" : `/${locale}/post/{slug}`,
		format: { contentField: "content" },
		schema: {
			title: fields.slug({
				name: { label: "Title", validation: { isRequired: true } },
				slug: {
					label: "URL slug",
					description: "The post address, e.g. /post/my-post. Avoid changing it after publishing.",
				},
			}),
			description: fields.text({
				label: "Summary",
				multiline: true,
				validation: { isRequired: true },
			}),
			category: fields.text({ label: "Category", defaultValue: "News" }),
			author: fields.text({ label: "Author", defaultValue: "KreativeTab", validation: { isRequired: true } }),
			cover: fields.image({
				label: "Cover image",
				directory: "src/assets/posts",
				publicPath: "@/assets/posts/",
				validation: { isRequired: true },
			}),
			coverAlt: altText("Cover image alt text"),
			tags: fields.array(fields.text({ label: "Tag" }), {
				label: "Tags",
				itemLabel: (props) => props.value,
			}),
			pubDate: fields.date({
				label: "Publication date",
				defaultValue: { kind: "today" },
				validation: { isRequired: true },
			}),
			lastUpdateDate: fields.date({
				label: "Last updated",
				defaultValue: { kind: "today" },
				validation: { isRequired: true },
			}),
			hidden: fields.checkbox({ label: "Hidden (draft)", defaultValue: false }),
			example: fields.checkbox({
				label: "Example / placeholder post",
				description: "Shows an “Example” badge. Untick (or delete the post) once you publish real articles.",
				defaultValue: false,
			}),
			seo: seoFields("post"),
			content: markdocBody("src/assets/posts"),
		},
	});

/* -------------------------------------------------------------------------- */
/* Site-wide settings                                                         */
/* -------------------------------------------------------------------------- */

const headerSingleton = (locale: LocaleKey, prefix: string) =>
	singleton({
		label: `${prefix}Navigation`,
		path: `src/content/global/${locale}/header`,
		format: { data: "json" },
		schema: {
			logo: fields.object({
				imagePath: fields.text({ label: "Logo path", defaultValue: "/src/assets/global/navigation/logo.svg" }),
				title: fields.text({ label: "Logo text (optional)" }),
			}),
			pages: fields.array(
				fields.object({
					title: fields.text({ label: "Label" }),
					link: fields.text({ label: "Link", description: "e.g. /about or /services" }),
				}),
				{ label: "Menu links", itemLabel: (props) => props.fields.title.value },
			),
			actions: fields.array(
				fields.object({
					title: fields.text({ label: "Label" }),
					link: fields.text({ label: "Link" }),
					style: fields.select({
						label: "Style",
						options: [
							{ label: "Filled", value: "button" },
							{ label: "Outlined", value: "outline" },
						],
						defaultValue: "button",
					}),
				}),
				{ label: "Buttons", itemLabel: (props) => props.fields.title.value },
			),
		},
	});

const footerSingleton = (locale: LocaleKey, prefix: string) =>
	singleton({
		label: `${prefix}Footer`,
		path: `src/content/global/${locale}/footer`,
		format: { data: "json" },
		schema: {
			title: fields.text({ label: "Headline", description: "You can use <br/> for a line break." }),
			tagline: fields.text({
				label: "Tagline",
				description: "Short line under the logo.",
				multiline: true,
				defaultValue: "Creative studio for branding, web design and product design.",
			}),
			services: fields.array(
				fields.object({
					title: fields.text({ label: "Service" }),
					link: fields.text({ label: "Link", defaultValue: "/services" }),
				}),
				{ label: "Services column", itemLabel: (props) => props.fields.title.value },
			),
			copyright: fields.text({ label: "Copyright" }),
			buttons: fields.array(
				fields.object({
					text: fields.text({ label: "Label" }),
					url: fields.text({ label: "Link" }),
				}),
				{ label: "Buttons", itemLabel: (props) => props.fields.text.value },
			),
		},
	});

const seoSingleton = (locale: LocaleKey, prefix: string) =>
	singleton({
		label: `${prefix}Default SEO`,
		path: `src/content/global/${locale}/seo`,
		format: { data: "json" },
		schema: {
			title: fields.text({
				label: "Default title",
				description: "Used when a page has no SEO title of its own.",
				validation: { isRequired: true, length: { max: 70 } },
			}),
			description: fields.text({
				label: "Default description",
				multiline: true,
				validation: { isRequired: true, length: { max: 200 } },
			}),
			author: fields.text({ label: "Publisher / author", defaultValue: "KreativeTab" }),
			twitterHandle: fields.text({
				label: "X (Twitter) handle (optional)",
				description: "e.g. @kreativetab. Leave empty if you don't have one.",
			}),
		},
	});

const localized = <T>(factory: (locale: LocaleKey, prefix: string) => T, name: string) =>
	Object.fromEntries(
		LOCALES.map(({ key, prefix }) => [key === "en" ? name : `${name}_${key}`, factory(key, prefix)]),
	) as Record<string, T>;

export default config({
	storage: useLocalStorage ? { kind: "local" } : { kind: "github", repo: REPO },
	ui: {
		brand: {
			name: "KreativeTab",
			mark: BrandMarkComponent,
		},
		navigation: {
			Content: ["works", "pages", "posts"],
			"Site settings": ["header", "footer", "seo", "contacts", "widget"],
			"Italian (optional)": ["works_it", "pages_it", "posts_it", "header_it", "footer_it", "seo_it"],
		},
	},
	singletons: {
		...localized(headerSingleton, "header"),
		...localized(footerSingleton, "footer"),
		...localized(seoSingleton, "seo"),
		contacts: singleton({
			label: "Contact details & social links",
			path: "src/content/global/contacts",
			format: { data: "json" },
			schema: {
				phone: fields.text({ label: "Phone" }),
				mail: fields.text({ label: "Email" }),
				address: fields.text({ label: "Address (optional)" }),
				socials: fields.array(
					fields.object({
						title: fields.text({ label: "Network", description: "e.g. Instagram, LinkedIn" }),
						link: fields.url({ label: "Profile URL" }),
						icon: fields.text({ label: "Icon", description: "e.g. mdi:instagram, mdi:linkedin" }),
					}),
					{
						label: "Social profiles",
						description: "Also added to Google's organisation info (sameAs).",
						itemLabel: (props) => props.fields.title.value || "Social profile",
					},
				),
			},
		}),
		widget: singleton({
			label: "WhatsApp button",
			path: "src/content/global/widget",
			format: { data: "json" },
			schema: {
				enabled: fields.checkbox({ label: "Show the floating button" }),
				icon: fields.select({
					label: "Icon",
					options: [
						{ label: "WhatsApp", value: "mdi:whatsapp" },
						{ label: "Phone", value: "mdi:phone" },
						{ label: "Email", value: "mdi:email" },
						{ label: "Chat", value: "mdi:chat" },
					],
					defaultValue: "mdi:whatsapp",
				}),
				link: fields.url({ label: "Link" }),
			},
		}),
	},
	collections: {
		...localized(worksCollection, "works"),
		...localized(pagesCollection, "pages"),
		...localized(postsCollection, "posts"),
	},
});
