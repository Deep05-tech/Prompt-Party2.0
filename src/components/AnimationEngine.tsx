"use client";
import { motion, AnimatePresence } from "framer-motion";

export const getHoverVariant = (styleClass: string) => {
  const hoverVariants: any = {
    bounce: { scaleX: 1.02, scaleY: 0.98, transition: { type: "spring", stiffness: 300 } },
    teleport: { scale: 0.98, boxShadow: "0 0 30px rgba(56, 189, 248, 0.4)", filter: "brightness(1.2)" },
    haki: { scale: 1.02, boxShadow: "0 0 40px rgba(220, 38, 38, 0.3)", filter: "saturate(1.5)" },
    quake: { x: [0, -2, 2, -2, 0], transition: { duration: 0.2, repeat: Infinity } },
    split: { y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" },
    void: { scale: 0.95, boxShadow: "inset 0 0 50px rgba(0,0,0,0.8)" },
    magnet: { scale: 1.01, rotate: 2, transition: { type: "spring", stiffness: 500 } },
    slither: { skewX: 2, scale: 1.02, transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" } },
    wave: { y: -5, filter: "brightness(1.1)", transition: { duration: 0.3 } },
    legend: { scale: 1.03, boxShadow: "0 0 50px rgba(253, 224, 71, 0.2)", filter: "brightness(1.3)" }
  };
  return hoverVariants[styleClass] || { scale: 1.02 };
};

export default function AnimationEngine({ children, styleClass }: { children: React.ReactNode, styleClass: string }) {
  const variants: any = {
    bounce: {
      hidden: { y: -50, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 15, mass: 1, staggerChildren: 0.1 } }
    },
    teleport: {
      hidden: { scale: 0.95, opacity: 0, filter: "blur(5px)" },
      show: { scale: [1.02, 1], opacity: 1, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 } }
    },
    haki: {
      hidden: { opacity: 0, scale: 0.98 },
      show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeInOut", staggerChildren: 0.1 } }
    },
    quake: {
      hidden: { x: -20, opacity: 0 },
      show: { x: [10, -10, 5, -5, 0], opacity: 1, transition: { duration: 0.4, ease: "linear", staggerChildren: 0.1 } }
    },
    split: {
      hidden: { opacity: 0, scale: 0.95 },
      show: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.15 } }
    },
    void: {
      hidden: { scale: 0.8, opacity: 0 },
      show: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } }
    },
    magnet: {
      hidden: { x: -100, opacity: 0 },
      show: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 150, damping: 20, staggerChildren: 0.1 } }
    },
    slither: {
      hidden: { y: 20, opacity: 0, skewX: 5 },
      show: { y: 0, opacity: 1, skewX: 0, transition: { duration: 0.6, ease: "backOut", staggerChildren: 0.1 } }
    },
    wave: {
      hidden: { y: 30, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut", staggerChildren: 0.1 } }
    },
    legend: {
      hidden: { opacity: 0, y: -10 },
      show: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut", staggerChildren: 0.1 } }
    }
  };

  const selectedVariant = variants[styleClass as keyof typeof variants] || variants.bounce;

  return (
    <AnimatePresence>
      <motion.div
        variants={selectedVariant}
        initial="hidden"
        animate="show"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
