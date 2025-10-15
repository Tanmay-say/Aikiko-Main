'use client';

import { Newspaper, User } from 'lucide-react';
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
    { id: 'agents' as Screen, icon: AgenticIcon, label: 'Agents' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#393E46] border-t border-[#222831] max-w-[390px] mx-auto">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="flex flex-col items-center justify-center flex-1 relative"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon
                  size={24}
                  className={`transition-colors ${
                    isActive ? 'text-[#D65A31]' : 'text-[#EEEEEE]/60'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D65A31]"
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