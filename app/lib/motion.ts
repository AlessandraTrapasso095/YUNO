import type { Transition, Variants } from "motion/react";

export const motionEase = {
  standard: [0.2, 0, 0, 1] as const,
  emphasized: [0.16, 1, 0.3, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
};

export const motionDuration = {
  instant: 0.1,
  fast: 0.16,
  normal: 0.24,
  slow: 0.5,
  reveal: 0.65,
};

export const motionSpring = {
  soft: {
    type: "spring",
    stiffness: 180,
    damping: 24,
    mass: 0.9,
  } satisfies Transition,

  responsive: {
    type: "spring",
    stiffness: 260,
    damping: 24,
    mass: 0.8,
  } satisfies Transition,

  celebration: {
    type: "spring",
    stiffness: 220,
    damping: 18,
    mass: 0.8,
  } satisfies Transition,
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: {
      duration: motionDuration.normal,
      delay,
      ease: motionEase.standard,
    },
  }),
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDuration.reveal,
      delay,
      ease: motionEase.emphasized,
    },
  }),
};

export const fadeDown: Variants = {
  hidden: {
    opacity: 0,
    y: -12,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDuration.normal,
      delay,
      ease: motionEase.emphasized,
    },
  }),
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      ...motionSpring.soft,
      delay,
    },
  }),
};

export const popIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.82,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: motionSpring.celebration,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: motionEase.emphasized,
    },
  },
};

export const viewportOnce = {
  once: true,
  amount: 0.2,
} as const;

export const storyItem: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: motionEase.emphasized,
    },
  },
};

export const storyLine: Variants = {
  hidden: {
    opacity: 0,
    scaleY: 0,
  },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.24,
      ease: motionEase.emphasized,
    },
  },
};

export const rewardPop: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.88,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: motionSpring.celebration,
  },
};

export const storyContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.18,
    },
  },
};

export const orbitPop: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.82,
    y: 8,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...motionSpring.responsive,
      delay,
    },
  }),
};

export const ctaContainer: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: motionDuration.slow,
      ease: motionEase.emphasized,
      delayChildren: 0.12,
      staggerChildren: 0.1,
    },
  },
};

export const ctaItem: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: motionEase.emphasized,
    },
  },
};

export const ctaMark: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.78,
    rotate: -12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -5,
    transition: motionSpring.responsive,
  },
};

export const profileCardEnter: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: motionSpring.responsive,
  },
};

export const matchAvatarLeft: Variants = {
  hidden: { opacity: 0, x: -18, scale: 0.9, rotate: -10 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: -6,
    transition: motionSpring.responsive,
  },
};

export const matchAvatarRight: Variants = {
  hidden: { opacity: 0, x: 18, scale: 0.9, rotate: 10 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: 6,
    transition: {
      ...motionSpring.responsive,
      delay: 0.06,
    },
  },
};

export const matchHeart: Variants = {
  hidden: { opacity: 0, scale: 0.55, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      ...motionSpring.celebration,
      delay: 0.12,
    },
  },
};

export const matchParticleTransition = (index: number): Transition => ({
  duration: 0.9,
  delay: 0.12 + index * 0.022,
  ease: motionEase.emphasized,
});

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: motionDuration.fast,
      ease: motionEase.standard,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: motionDuration.fast,
      ease: motionEase.exit,
    },
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.82,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: motionSpring.celebration,
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: {
      duration: motionDuration.fast,
      ease: motionEase.exit,
    },
  },
};

export const toastMotion: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    x: "-50%",
  },
  visible: {
    opacity: 1,
    y: 0,
    x: "-50%",
    transition: {
      duration: motionDuration.normal,
      ease: motionEase.emphasized,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    x: "-50%",
    transition: {
      duration: motionDuration.fast,
      ease: motionEase.exit,
    },
  },
};

export const languageMenu: Variants = {
  hidden: {
    opacity: 0,
    y: -6,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: motionDuration.fast,
      ease: motionEase.emphasized,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.985,
    transition: {
      duration: motionDuration.fast,
      ease: motionEase.exit,
    },
  },
};
