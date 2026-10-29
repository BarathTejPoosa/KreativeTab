import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

// Icons are generated from public/favicon.svg (KreativeTab mark).
// Regenerate after changing the favicon with: bun run icons
export default defineConfig({
	headLinkOptions: {
		preset: "2023",
	},
	preset: minimal2023Preset,
	images: "public/favicon.svg",
});
