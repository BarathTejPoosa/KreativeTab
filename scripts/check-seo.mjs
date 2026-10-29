// Post-build SEO checks. Run after `bun run build`: `bun run test`.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const outDir = [".vercel/output/static", "dist"].find((dir) => existsSync(join(dir, "index.html")));
if (!outDir) {
	console.error("No build output found. Run `bun run build` first.");
	process.exit(1);
}

const errors = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);

const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});

const htmlFiles = walk(outDir).filter((f) => f.endsWith("index.html"));
const meta = (html, attr, key) =>
	html.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`, "i"))?.[1] ??
	html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`, "i"))?.[1];

const titles = new Map();
let site;

for (const file of htmlFiles) {
	const rel = `/${relative(outDir, file).replace(/index\.html$/, "")}`;
	const html = readFileSync(file, "utf8");

	const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
	// Titles must be unique within a language (translations may share a title)
	const titleKey = `${rel.split("/")[1] === "it" ? "it" : "en"}:${title}`;
	if (!title) fail(rel, "missing <title>");
	else if (titles.has(titleKey)) fail(rel, `duplicate title also used by ${titles.get(titleKey)}`);
	else titles.set(titleKey, rel);

	const description = meta(html, "name", "description");
	if (!description) fail(rel, "missing meta description");

	const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
	if (!canonical) fail(rel, "missing canonical");
	else {
		const url = new URL(canonical);
		site ??= url.origin;
		if (url.pathname !== rel) fail(rel, `canonical path ${url.pathname} does not match`);
	}

	for (const key of ["og:title", "og:description", "og:image", "og:url", "og:type", "og:site_name", "og:locale"]) {
		if (!meta(html, "property", key)) fail(rel, `missing ${key}`);
	}
	const ogImage = meta(html, "property", "og:image");
	if (ogImage && !/^https?:\/\//.test(ogImage)) fail(rel, "og:image must be absolute");
	if (ogImage?.endsWith("/og.png") && !existsSync(join(outDir, new URL(ogImage).pathname))) {
		fail(rel, `og:image ${ogImage} not generated`);
	}
	if (meta(html, "name", "twitter:card") !== "summary_large_image") fail(rel, "twitter:card is not summary_large_image");
	for (const key of ["twitter:title", "twitter:description", "twitter:image"]) {
		if (!meta(html, "name", key)) fail(rel, `missing ${key}`);
	}

	const types = [];
	for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
		try {
			const data = JSON.parse(json);
			for (const item of [data].flat()) types.push(item["@type"]);
		} catch {
			fail(rel, "invalid JSON-LD");
		}
	}
	if (!types.includes("Organization") || !types.includes("WebSite")) fail(rel, "missing Organization/WebSite JSON-LD");
	if (/\/work\/[^/]+\/$/.test(rel) && !types.includes("CreativeWork")) fail(rel, "missing CreativeWork JSON-LD");
	if (/\/post\/[^/]+\/$/.test(rel) && !types.includes("BlogPosting")) fail(rel, "missing BlogPosting JSON-LD");

	for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
		if (!/\balt=/.test(img)) fail(rel, `image without alt: ${img.slice(0, 120)}`);
	}

	const lang = html.match(/<html[^>]*lang="([^"]+)"/)?.[1];
	if (!lang) fail(rel, "missing <html lang>");
}

// robots.txt and sitemap
const robots = existsSync(join(outDir, "robots.txt")) ? readFileSync(join(outDir, "robots.txt"), "utf8") : "";
if (!robots) fail("robots.txt", "missing");
else if (!/Sitemap:\s*https?:\/\/\S+sitemap-index\.xml/.test(robots)) fail("robots.txt", "missing Sitemap line");

const sitemapFiles = walk(outDir).filter((f) => /sitemap-\d+\.xml$/.test(f));
const sitemap = sitemapFiles.map((f) => readFileSync(f, "utf8")).join("\n");
if (!sitemap) fail("sitemap", "missing sitemap-0.xml");
for (const file of htmlFiles) {
	const rel = `/${relative(outDir, file).replace(/index\.html$/, "")}`;
	const html = readFileSync(file, "utf8");
	const noindex = /<meta[^>]*name="robots"[^>]*noindex/.test(html);
	const listed = sitemap.includes(`${site}${rel}<`);
	if (!noindex && !listed && /\/(work|post)\//.test(rel)) fail("sitemap", `${rel} missing`);
	if (noindex && listed) fail("sitemap", `${rel} is noindex but listed`);
}
if (/\/keystatic/.test(sitemap)) fail("sitemap", "CMS admin URL listed");

for (const icon of ["favicon.svg", "favicon.ico", "apple-touch-icon-180x180.png", "pwa-512x512.png"]) {
	if (!existsSync(join(outDir, icon))) fail(icon, "missing");
}

if (errors.length) {
	console.error(`SEO check failed (${errors.length}):\n- ${errors.join("\n- ")}`);
	process.exit(1);
}
console.log(`SEO check passed: ${htmlFiles.length} pages in ${outDir} (site ${site}).`);
