'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface RefreshAnimationProps {
  isRefreshing: boolean;
}

export function RefreshAnimation({ isRefreshing }: RefreshAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
        transition={{
          duration: 0.5,
          repeat: isRefreshing ? Infinity : 0,
          ease: "linear"
        }}
        className="mb-4"
      >
        <RefreshCw size={32} className="text-[#D65A31]" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[#EEEEEE]/60 text-sm"
      >
        {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
      </motion.p>
    </div>
  );
}