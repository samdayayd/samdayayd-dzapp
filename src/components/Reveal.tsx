"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/** Fades + slides an element up by a small amount the first time it
    scrolls into view — used sparingly on the landing page's own sections,
    never on application screens (a listing feed re-animating every time
    you scroll back up would just be annoying, not "premium"). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
