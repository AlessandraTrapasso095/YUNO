"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import {
  fadeIn,
  fadeUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  storyContainer,
  storyItem,
  storyLine,
  rewardPop,
  orbitPop,
  ctaContainer,
  ctaItem,
  ctaMark,
  viewportOnce,
} from "../lib/motion";

type MotionDivProps = HTMLMotionProps<"div">;

type RevealProps = MotionDivProps & {
  variant?: "fade" | "up" | "scale";
  delay?: number;
};

const revealVariants: Record<
  NonNullable<RevealProps["variant"]>,
  Variants
> = {
  fade: fadeIn,
  up: fadeUp,
  scale: scaleIn,
};

export function Reveal({
  variant = "up",
  delay = 0,
  children,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : revealVariants[variant]}
      custom={delay}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={reduceMotion ? undefined : viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  ...props
}: MotionDivProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : staggerContainer}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={reduceMotion ? undefined : viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  ...props
}: MotionDivProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : staggerItem}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StoryMotionProps = MotionDivProps & {
  kind?: "item" | "line" | "reward";
};

export function SkillHoursStory({
  children,
  ...props
}: MotionDivProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : storyContainer}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={reduceMotion ? undefined : viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SkillHoursStoryItem({
  kind = "item",
  children,
  ...props
}: StoryMotionProps) {
  const reduceMotion = useReducedMotion();

  const variants =
    kind === "reward"
      ? rewardPop
      : kind === "line"
        ? storyLine
        : storyItem;

  return (
    <motion.div
      variants={reduceMotion ? undefined : variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}


type OrbitPopProps = MotionDivProps & {
  delay?: number;
};

export function OrbitPop({
  delay = 0,
  children,
  ...props
}: OrbitPopProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : orbitPop}
      custom={delay}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={reduceMotion ? undefined : viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}


export function CtaMotion({
  children,
  ...props
}: MotionDivProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : ctaContainer}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={reduceMotion ? undefined : viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type CtaItemProps = MotionDivProps & {
  mark?: boolean;
};

export function CtaMotionItem({
  mark = false,
  children,
  ...props
}: CtaItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : mark ? ctaMark : ctaItem}
      {...props}
    >
      {children}
    </motion.div>
  );
}
