import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori, { type SatoriOptions } from "satori";
import sharp from "sharp";
import { siteTitle, siteUrl } from "site.config";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgData {
	title: string;
	eyebrow?: string;
	subtitle?: string;
}

const root = process.cwd();
const fontFile = (pkg: string, file: string) =>
	readFile(join(root, "node_modules", "@fontsource", pkg, "files", file));

let fontsPromise: Promise<SatoriOptions["fonts"]> | undefined;
const loadFonts = () => {
	fontsPromise ??= Promise.all([
		fontFile("plus-jakarta-sans", "plus-jakarta-sans-latin-700-normal.woff"),
		fontFile("inter", "inter-latin-400-normal.woff"),
	]).then(([heading, body]) => [
		{ name: "Jakarta", data: heading, weight: 700, style: "normal" },
		{ name: "Inter", data: body, weight: 400, style: "normal" },
	]);
	return fontsPromise;
};

let markPromise: Promise<string> | undefined;
const loadMark = () => {
	// Rasterise first: nested SVG images are not rendered when the card is converted to PNG
	markPromise ??= readFile(join(root, "src", "assets", "og-mark.svg"))
		.then((svg) => sharp(svg).resize(112, 112).png().toBuffer())
		.then((png) => `data:image/png;base64,${png.toString("base64")}`);
	return markPromise;
};

const host = new URL(siteUrl).host;

const Template = (props: OgData & { mark: string }) => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			width: "100%",
			height: "100%",
			padding: "72px 80px",
			color: "#ffffff",
			background:
				"radial-gradient(circle at 20% 80%, rgb(48, 48, 48) 0%, rgb(0, 0, 0) 85%)",
			fontFamily: "Inter",
		}}
	>
		<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
			<img src={props.mark} width={56} height={56} alt="" />
			<span style={{ fontFamily: "Jakarta", fontSize: 32, fontWeight: 700 }}>
				{siteTitle}
			</span>
		</div>
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			{props.eyebrow && (
				<span
					style={{
						fontSize: 26,
						textTransform: "uppercase",
						letterSpacing: "0.12em",
						color: "#a3a3a3",
					}}
				>
					{props.eyebrow}
				</span>
			)}
			<span
				style={{
					fontFamily: "Jakarta",
					fontSize: props.title.length > 60 ? 56 : 72,
					fontWeight: 700,
					lineHeight: 1.08,
					maxWidth: "1000px",
				}}
			>
				{props.title}
			</span>
			{props.subtitle && (
				<span
					style={{ fontSize: 28, color: "#d4d4d4", maxWidth: "960px", lineHeight: 1.35 }}
				>
					{props.subtitle.length > 140
						? `${props.subtitle.slice(0, 137)}…`
						: props.subtitle}
				</span>
			)}
		</div>
		<span style={{ fontSize: 24, color: "#a3a3a3" }}>{host}</span>
	</div>
);

/** Render a 1200×630 PNG share card. Fonts are bundled locally (no network at build). */
const generateOgImage = async (data: OgData): Promise<Buffer> => {
	const [fonts, mark] = await Promise.all([loadFonts(), loadMark()]);
	const svg = await satori(Template({ ...data, title: data.title || siteTitle, mark }), {
		width: OG_WIDTH,
		height: OG_HEIGHT,
		fonts,
	});
	return sharp(Buffer.from(svg)).png().toBuffer();
};

export default generateOgImage;
