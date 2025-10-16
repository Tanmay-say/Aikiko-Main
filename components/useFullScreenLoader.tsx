'use client';

import { useEffect, useState } from 'react';
import { AikikoWordLoader } from './AikikoWordLoader';
import { motion, AnimatePresence } from 'framer-motion';

export function useFullScreenLoader(initial = false) {
  const [visible, setVisible] = useState(initial);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const Overlay = () => (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm flex items-center justify-center"
        >
          <AikikoWordLoader size={220} />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { visible, show, hide, Overlay } as const;
}


