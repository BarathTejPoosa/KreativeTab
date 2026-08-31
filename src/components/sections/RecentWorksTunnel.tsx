import { useEffect, useState } from "react";
import GalleryTunnel from "@/components/originkit/ui/hero-13/gallery-tunnel";

type Work = {
	title: string;
	href: string;
	tags: string;
};

type Props = {
	title: string;
	images: string[];
	works: Work[];
	allWorkHref: string;
	allWorkLabel: string;
};

export default function RecentWorksTunnel({
	title,
	images,
	works,
	allWorkHref,
	allWorkLabel,
}: Props) {
	const [reduceMotion, setReduceMotion] = useState(true);

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduceMotion(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);

	return (
		<section data-cursor-theme="dark" className="relative isolate min-h-screen w-full overflow-hidden bg-black text-white">
			<div aria-hidden="true" className="absolute inset-0 z-0 opacity-80">
				<GalleryTunnel
					images={images}
					background="#000000"
					colors={["#000000", "#161616", "#8BE67D", "#2F393D"]}
					lineColor="#FFFFFF"
					lineOpacity={8}
					grid={5}
					speed={reduceMotion ? 0 : 22}
					boost={reduceMotion ? 0 : 55}
					fade={82}
					label={!reduceMotion}
					labelText="Explore"
					labelIcon="/brand/kreativetab-icon.svg"
					labelFill="#8BE67D"
					labelColor="#000000"
				/>
			</div>

			<div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-black/35"></div>

			<div className="pointer-events-none relative z-20 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-between px-5 py-12 lg:px-10 lg:py-16">
				<div className="flex items-start justify-between gap-6 pb-6">
					<div>
						<p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8BE67D]">Selected projects</p>
						<h2 className="font-display text-[clamp(1.75rem,3vw,2.375rem)] font-bold leading-tight text-white">{title}</h2>
					</div>
					<a href={allWorkHref} className="pointer-events-auto hidden min-h-11 items-center border border-white px-5 text-sm font-semibold transition-colors hover:bg-white hover:text-black sm:inline-flex">
						{allWorkLabel} <span className="ml-2" aria-hidden="true">↗</span>
					</a>
				</div>

				<div className="grid gap-px border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
					{works.map((work, index) => (
						<a key={work.href} href={work.href} className="pointer-events-auto group min-h-36 bg-black/80 p-5 transition-colors hover:bg-[#8BE67D] hover:text-black">
							<span className="text-xs text-white/50 group-hover:text-black/60">0{index + 1}</span>
							<h3 className="mt-7 text-lg font-semibold text-white group-hover:text-black">{work.title}</h3>
							<p className="mt-2 line-clamp-2 text-sm text-white/55 group-hover:text-black/70">{work.tags}</p>
						</a>
					))}
				</div>

				<a href={allWorkHref} className="pointer-events-auto mt-5 flex min-h-11 items-center justify-center border border-white px-5 text-sm font-semibold sm:hidden">
					{allWorkLabel}
				</a>
			</div>
		</section>
	);
}
