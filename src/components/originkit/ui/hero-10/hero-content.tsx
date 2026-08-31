// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import FocusReveal from "@/components/originkit/ui/hero-10/focus-reveal";
import { Button } from "@/components/originkit/ui/hero-10/button";
import { TextArc } from "@/components/originkit/ui/hero-10/text-arc";
import type { Hero10Props } from "@/components/originkit/hero-10";

/** ease-out-cubic */
const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

const HEADLINE = "Powering Tomorrow's Intelligent Ecosystem";

const HEADLINE_TRANSITION = {
  type: "tween" as const,
  duration: 0.3,
  delay: 0.08,
  ease: "easeOut" as const,
  staggerChildren: 0.028,
};

export const HeroContent = ({ title, subtitle, buttons = [] }: Hero10Props) => {
  const reduceMotion = useReducedMotion();
  const [headlineDone, setHeadlineDone] = useState(false);

  const handleHeadlineComplete = useCallback(() => {
    setHeadlineDone(true);
  }, []);

  const restVisible = reduceMotion || headlineDone;

  const restReveal = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 12 },
          animate: restVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
          transition: {
            type: "tween" as const,
            duration: 0.3,
            ease: EASE_OUT,
            delay: restVisible ? delay : 0,
          },
        };

  return (
    <div className="relative z-20 mx-auto flex w-full flex-col items-center desktop-sm:mt-12">
      <TextArc />

      <div className="flex flex-col gap-6">
        <div className="flex w-full flex-col items-center gap-6 ipad:gap-8">
          <div className="flex w-full flex-col items-center gap-2 ipad:gap-4 text-center">
            <FocusReveal
              text={title || HEADLINE}
              as="h1"
              staggerFrom="start"
              blur={12}
              transition={HEADLINE_TRANSITION}
              onComplete={handleHeadlineComplete}
              className="w-full text-center font-display text-[44px] ipad:text-[72px] leading-none tracking-[-0.88px] text-white text-pretty"
            />

            <motion.p
              {...restReveal(0)}
              className="w-full max-w-[340px] ipad:max-w-none font-sans text-[14px] ipad:text-[16px] leading-[1.4] tracking-[-0.28px] text-white/70 text-pretty"
              dangerouslySetInnerHTML={{ __html: subtitle || "Create smarter products with scalable AI infrastructure, real-time insights, and enterprise-grade security—all in one unified platform." }}
            />
          </div>
        </div>

        <motion.div
          {...restReveal(0.1)}
          className="pointer-events-auto mx-auto flex max-w-[310px] items-center gap-4"
        >
          {buttons.map((btn, i) => (
            <Button
              key={i}
              variant={i === 0 ? "primary" : "secondary"}
              aria-label={btn.title}
              href={btn.href}
            >
              {btn.title}
            </Button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
