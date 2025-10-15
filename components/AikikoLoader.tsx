'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function AikikoLoader() {
  return (
    <div className="fixed inset-0 bg-[#222831] flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 1],
          opacity: [0, 1, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="relative"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-32 h-32 rounded-full bg-[#D65A31]/20 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#D65A31]/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#D65A31] flex items-center justify-center">
                <Image 
                  src="/images/logo.svg" 
                  alt="Aikiko Logo" 
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-32 h-32 rounded-full border-4 border-[#FFB800] border-opacity-0"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}