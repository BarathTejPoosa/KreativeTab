// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

import { useEffect, useState } from "react";
import CircularText from "@/components/originkit/ui/hero-10/text-ring";

/**
 * Upper arc of “AI Without Limits” above the headline.
 * Edges fade via alpha mask only — no painted overlays — so text blends into bg.
 */

/** Matches `--breakpoint-*` in globals.css */
const IPAD_MIN = 768;
const DESKTOP_SM_MIN = 1280;
const WIDE_LG_MIN = 1600;

/**
 * CircularText diameter per breakpoint:
 * - android-sm (< 768 / --breakpoint-android-sm band): 440
 * - ipad (≥ 768): 750
 * - desktop-sm (≥ 1280): 900
 * - wide-lg (≥ 1600): 1100
 */
const DIAMETER = {
  androidSm: 440,
  ipad: 750,
  desktopSm: 900,
  wideLg: 1100,
} as const;

const getDiameter = (width: number) => {
  if (width >= WIDE_LG_MIN) return DIAMETER.wideLg;
  if (width >= DESKTOP_SM_MIN) return DIAMETER.desktopSm;
  if (width >= IPAD_MIN) return DIAMETER.ipad;
  // android-sm and below
  return DIAMETER.androidSm;
};

const getFontSize = (width: number) =>
  width >= DESKTOP_SM_MIN ? "16px" : "13px";

export const TextArc = () => {
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState("13px");
  const [diameter, setDiameter] = useState<(typeof DIAMETER)[keyof typeof DIAMETER]>(
    DIAMETER.androidSm,
  );

  useEffect(() => {
    setMounted(true);

    const sync = () => {
      const width = window.innerWidth;
      setDiameter(getDiameter(width));
      setFontSize(getFontSize(width));
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Soft L/R fade: text alpha → 0 into #091009 (no solid bars)
  const edgeMask =
    "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)";

  return (
    <div
      className="pointer-events-none relative mx-auto mb-3 h-[56px] w-full max-w-[316px] overflow-hidden"
      aria-hidden="true"
      style={{
        maskImage: edgeMask,
        WebkitMaskImage: edgeMask,
        maskMode: "alpha",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      {mounted ? (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{ width: diameter, height: diameter }}
        >
          <CircularText
            words={["AI Without Limits"]}
            separator=" · "
            diameter={diameter}
            color="rgba(255,255,255,1)"
            onHover="pause"
            hoverSpeed={8}
            transition={{ type: "tween", duration: 40, ease: "linear" }}
            font={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize,
              letterSpacing: "0.06em",
              lineHeight: "1em",
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : null}
    </div>
  );
};
