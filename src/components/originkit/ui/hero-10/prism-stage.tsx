// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

"use client";

import BackgroundBoxes from "@/components/originkit/ui/hero-10/prism-grid";

/**
 * Perspective prism grid for the lower hero.
 * Oversized width on mobile/tablet hides left/right plane edges.
 */
export const PrismStage = () => {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[1] h-[60%] overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-80 [mask-image:linear-gradient(to_top,transparent_0%,black_15%,black_40%,transparent_85%)]">
        {/* Wider than viewport below desktop so L/R edges stay off-screen */}
        <div className="absolute inset-y-0 left-1/2 w-[240%] -translate-x-1/2 ipad:w-[200%] desktop-sm:inset-0 desktop-sm:w-full desktop-sm:translate-x-0">
          <BackgroundBoxes
            backgroundColor="transparent"
            boxSize={28}
            borderWidth={1}
            borderColor="#2E2E2E"
            rotate={{ x: 0, y: 50 }}
            planeTop={62}
            colors={{
              paletteCount: 4,
              color1: "#8BE67D",
              color2: "#FFFFFF",
              color3: "#4A7A42",
              color4: "#FFFFFF",
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};
