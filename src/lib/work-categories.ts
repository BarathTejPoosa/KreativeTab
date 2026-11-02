/** Portfolio categories. Values are stored in English in the CMS; labels are localised for display. */
export const workCategoryOrder = ["Brand kits", "Websites", "Immersive websites", "Web apps", "Mobile apps"];

const itLabels: Record<string, string> = {
	"Brand kits": "Brand kit",
	Websites: "Siti web",
	"Immersive websites": "Siti immersivi",
	"Web apps": "Web app",
	"Mobile apps": "App mobile",
};

export function categoryLabel(category: string, locale?: string): string {
	return locale === "it" ? (itLabels[category] ?? category) : category;
}
