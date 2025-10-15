'use client';

import { Newspaper, Bot, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { AgenticIcon } from './AgenticIcon';
import { Screen } from './AikikoApp';

interface BottomNavProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, navigate }: BottomNavProps) {
  const navItems = [
    { id: 'feed' as Screen, icon: Newspaper, label: 'Feed' },
    { id: 'agents' as Screen, icon: Bot, label: 'Agents' },
    { id: 'profile' as Screen, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border max-w-[390px] mx-auto backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 relative ${idx === 1 ? 'scale-110 -mt-4' : ''}`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative ${idx === 1 ? 'p-2 rounded-2xl border border-[#D65A31]/30 bg-[#D65A31]/10 backdrop-blur' : ''}`}
              >
                <Icon
                  size={idx === 1 ? 26 : 24}
                  className={`transition-colors ${
                    isActive ? 'text-[#D65A31]' : 'text-foreground/60'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D65A31] shadow-[0_0_10px_#D65A31]"
                  />
                )}
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}