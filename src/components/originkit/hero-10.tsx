"use client";

import "./hero-10.css";
import { Section16Hero } from "@/components/originkit/ui/hero-10/section-16-hero";

export type HeroButtonProps = { title: string; href: string; style?: string; icon?: string };

export type Hero10Props = {
  title?: string;
  subtitle?: string;
  buttons?: HeroButtonProps[];
};

const Hero10 = (props: Hero10Props) => <Section16Hero {...props} />;

export default Hero10;
