// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

/**
 * Top-of-screen Digup glow — Figma greens (#26D277 → #2EC57E → #6AD585)
 * Curved (elliptical) bottom edge soft-blends into #091009.
 */
export const GlowBackground = () => {
  // Dome mask: flat at top-0, curved fade along the bottom edge
  const curveMask =
    "radial-gradient(ellipse 130% 100% at 50% 0%, #000 0%, #000 42%, rgba(0,0,0,0.55) 62%, transparent 78%)";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Curved top wash — elliptical mask gives the soft arc edge */}
      <div
        className="absolute inset-x-0 top-0 h-[360px] desktop-sm:h-[420px]"
        style={{
          background:
            "linear-gradient(to bottom, #8BE67D 0%, #8BE67D 28%, #8BE67D 55%, #091009 100%)",
          opacity: 0.45,
          maskImage: curveMask,
          WebkitMaskImage: curveMask,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />

      {/* Soft elliptical bloom — reinforces the curved edge + blend */}
      <div
        className="absolute top-[-40px] left-1/2 h-[280px] w-[160%] max-w-none -translate-x-1/2 blur-[70px] desktop-sm:h-[340px] desktop-sm:blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse 85% 90% at 50% 0%, #8BE67D 0%, #8BE67D 32%, #8BE67D 58%, transparent 76%)",
          opacity: 0.5,
        }}
      />

      {/* Deeper mid atmosphere */}
      <div className="absolute top-[180px] left-1/2 h-[298px] w-[587px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,230,125,0.22)_0%,transparent_70%)] blur-[40px]" />
      <div className="absolute top-[260px] left-1/2 h-[294px] w-[1826px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,230,125,0.12)_0%,transparent_65%)] blur-[60px]" />
    </div>
  );
};
