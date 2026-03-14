'use client';

import { motion } from 'framer-motion';

export function PageLoader() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="h-12 w-12 rounded-lg bg-emerald-500/20 p-2 ring-1 ring-emerald-500/50"
      >
        <div className="h-full w-full rounded bg-emerald-500" />
      </motion.div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading data...</p>
    </div>
  );
}
