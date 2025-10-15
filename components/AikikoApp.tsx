'use client';

import { useState } from 'react';
import { Feed } from './screens/Feed';
import { AgentsList } from './screens/AgentsList';
import { Profile } from './screens/Profile';
import { CreateAgent } from './screens/CreateAgent';
import { AgentDetail } from './screens/AgentDetail';
import { Credits } from './screens/Credits';
import { motion, AnimatePresence } from 'framer-motion';

export type Screen = 'feed' | 'agents' | 'profile' | 'create-agent' | 'agent-detail' | 'credits';

export interface Agent {
  id: string;
  title: string;
  source_type: 'twitter' | 'web' | 'api' | 'subject';
  source_url?: string;
  notification_criteria?: string;
  monitor_frequency: 'hourly' | 'daily' | 'weekly';
  credits_per_check: number;
  is_active: boolean;
  last_checked_at?: string;
  created_at: string;
}

export interface FeedItem {
  id: string;
  agent_id: string;
  agent?: Agent;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  severity: 'low' | 'medium' | 'high';
  alert_count: number;
  has_analysis: boolean;
  created_at: string;
}

export function AikikoApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('feed');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const navigate = (screen: Screen, agentId?: string) => {
    if (agentId) setSelectedAgentId(agentId);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (currentScreen === 'agent-detail' || currentScreen === 'create-agent' || currentScreen === 'credits') {
      setCurrentScreen('feed');
      setSelectedAgentId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#222831] overflow-hidden">
      <div className="w-full h-full max-w-[390px] mx-auto relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <Feed navigate={navigate} />
            </motion.div>
          )}

          {currentScreen === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <AgentsList navigate={navigate} />
            </motion.div>
          )}

          {currentScreen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <Profile navigate={navigate} />
            </motion.div>
          )}

          {currentScreen === 'create-agent' && (
            <motion.div
              key="create-agent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="h-full"
            >
              <CreateAgent goBack={goBack} navigate={navigate} />
            </motion.div>
          )}

          {currentScreen === 'agent-detail' && selectedAgentId && (
            <motion.div
              key="agent-detail"
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="h-full"
            >
              <AgentDetail agentId={selectedAgentId} goBack={goBack} />
            </motion.div>
          )}

          {currentScreen === 'credits' && (
            <motion.div
              key="credits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="h-full"
            >
              <Credits goBack={goBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}