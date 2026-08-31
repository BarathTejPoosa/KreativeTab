// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import type { ButtonHTMLAttributes, ReactNode, AnchorHTMLAttributes } from "react";

const A = "/originkit/hero-10";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  href?: string;
};

const BASE_CLASS =
  "relative inline-flex shrink-0 touch-manipulation items-center justify-center overflow-clip rounded-[32px] font-sans text-[20px] font-medium leading-[1.2] tracking-[-0.4px] text-white transition-[opacity,transform] duration-200 ease [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97] motion-reduce:active:scale-100 cursor-pointer";

const PRIMARY_DARK = "#191b1a";

const PRIMARY_GRADIENT =
  "linear-gradient(77.36deg, #191b1a 13.89%, #19231e 18.74%, #19261f 23.4%, #19271b 33.87%, #192a1a 38.59%, #19301b 43.32%, #234818 52.9%, #25c36f 114.64%)";

export const Button = ({
  variant = "primary",
  children,
  className = "",
  type = "button",
  href,
  ...props
}: ButtonProps) => {
  const Comp = href ? "a" : "button";
  const compProps = href ? { href, ...props } : { type, ...props };

  if (variant === "secondary") {
    return (
      <Comp
        className={`${BASE_CLASS} group border border-solid border-[#3a3a3a] px-4 py-3.5 ${className}`}
        {...(compProps as any)}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[32px] bg-[#262626] transition-colors duration-200 ease motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-[#3a3a3a]"
        />
        <span className="relative z-1 text-[20px] text-center">{children}</span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_-4px_4px_0_rgba(255,255,255,0.05),inset_0_4px_4px_0_rgba(255,255,255,0.05)]"
        />
      </Comp>
    );
  }

  return (
    <Comp
      className={`${BASE_CLASS} group px-5 py-3.5 shadow-[0_4px_2px_0_rgba(0,0,0,0.25),0_-1.2px_0.5px_0_rgba(255,255,255,0.4),0_66px_19px_0_rgba(0,0,0,0),0_42px_17px_0_rgba(0,0,0,0.01),0_24px_14px_0_rgba(0,0,0,0.05),0_11px_11px_0_rgba(0,0,0,0.09),0_3px_6px_0_rgba(0,0,0,0.1)] bg-brand-flare text-black hover:bg-brand-flare/90 ${className}`}
      {...(compProps as any)}
    >
      <span className="relative z-1 whitespace-nowrap text-[20px] font-semibold">
        {children}
      </span>
    </Comp>
  );
};
