'use client';

import { motion } from 'framer-motion';

export function AikikoWordLoader({ size = 180 }: { size?: number }) {
  const stroke = '#D65A31';
  const textColor = 'currentColor';

  return (
    <div className="flex items-center justify-center" style={{ color: 'var(--foreground)' }}>
      <svg
        width={size}
        height={size * 0.35}
        viewBox="0 0 800 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFB800" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#FFB800" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFB800" stopOpacity="0.0" />
          </linearGradient>
          <clipPath id="textClip">
            <text x="20" y="200" fontFamily="var(--font-museo-moderno, MuseoModerno, sans-serif)" fontSize="200" fontWeight="700">Aikiko</text>
          </clipPath>
        </defs>

        <text
          x="20"
          y="200"
          fontFamily="var(--font-museo-moderno, MuseoModerno, sans-serif)"
          fontSize="200"
          fontWeight="700"
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        >
          Aikiko
        </text>

        <motion.text
          x="20"
          y="200"
          fontFamily="var(--font-museo-moderno, MuseoModerno, sans-serif)"
          fontSize="200"
          fontWeight="700"
          fill={textColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0.85, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatType: 'mirror' }}
        >
          Aikiko
        </motion.text>

        <g clipPath="url(#textClip)">
          <motion.rect
            x="-200"
            y="0"
            width="200"
            height="280"
            fill="url(#glow)"
            initial={{ x: -200 }}
            animate={{ x: 900 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          />
        </g>

        <motion.circle
          cx="740"
          cy="40"
          r="6"
          fill="#FFB800"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}


