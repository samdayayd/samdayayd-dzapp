"use client";

import { SessionProvider } from "next-auth/react";
import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {/* "user" respects the OS-level prefers-reduced-motion setting —
          every Reveal/motion.* animation in the app backs off automatically
          instead of each one needing its own check. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SessionProvider>
  );
}
