'use client';

import { useEffect, useState } from 'react';
import { Feed } from './screens/Feed';
import { AgentsList } from './screens/AgentsList';
import { Profile } from './screens/Profile';
import { CreateAgent } from './screens/CreateAgent';
import { AgentDetail } from './screens/AgentDetail';
import { Credits } from './screens/Credits';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import AuthUI from '@/components/AuthUI';
import { AikikoWordLoader } from './AikikoWordLoader';

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
  const [localAgents, setLocalAgents] = useState<Agent[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const fast = setTimeout(() => setShowSplash(false), 800);
    const safety = setTimeout(() => setShowSplash(false), 3000);
    return () => {
      clearTimeout(fast);
      clearTimeout(safety);
    };
  }, []);

  const navigate = (screen: Screen, agentId?: string) => {
    if (agentId) setSelectedAgentId(agentId);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (currentScreen === 'agent-detail' || currentScreen === 'create-agent' || currentScreen === 'credits' || currentScreen === 'profile') {
      setCurrentScreen('feed');
      setSelectedAgentId(null);
    }
  };

  // Initial splash
  if (showSplash || authLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <AikikoWordLoader size={260} />
      </div>
    );
  }

  // Force a sign-in flow before accessing the app
  if (!user) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-[390px] bg-card/60 backdrop-blur border border-white/10 rounded-3xl p-6">
          <AuthUI />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
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
              <AgentsList navigate={navigate} localAgents={localAgents} />
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
              <CreateAgent
                goBack={goBack}
                navigate={navigate}
                onCreated={(agent) => setLocalAgents((prev) => [agent as Agent, ...prev])}
              />
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