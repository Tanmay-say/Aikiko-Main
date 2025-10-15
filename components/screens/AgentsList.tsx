'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, Twitter, Globe, Code, MessageSquare, MoreVertical, BookOpen } from 'lucide-react';
import { BottomNav } from '../BottomNav';
import { Screen, Agent } from '../AikikoApp';
import { createClient } from '@/lib/supabase-client';

interface AgentsListProps {
  navigate: (screen: Screen, agentId?: string) => void;
}

export function AgentsList({ navigate }: AgentsListProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('agents')
          .select('*')
          .order('created_at', { ascending: false });

        if (data) {
          setAgents(data);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [supabase]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'twitter':
        return <Twitter size={20} className="text-[#1DA1F2]" />;
      case 'web':
        return <Globe size={20} className="text-[#4CAF50]" />;
      case 'api':
        return <Code size={20} className="text-[#FF6B6B]" />;
      default:
        return <MessageSquare size={20} className="text-[#FFB800]" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#222831]">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-4xl font-bold text-[#EEEEEE] font-['Museo_Moderno']">Agents</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('create-agent')}
          className="bg-[#D65A31] text-[#EEEEEE] p-3 rounded-full"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 px-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-[#D65A31]" size={32} />
          </div>
        ) : agents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <div className="w-32 h-32 mb-6 rounded-full bg-[#393E46] flex items-center justify-center">
              <BookOpen size={48} className="text-[#EEEEEE]/30" />
            </div>
            <h3 className="text-xl font-bold text-[#EEEEEE] mb-2">No agents yet</h3>
            <p className="text-[#EEEEEE]/60 mb-6 max-w-xs">
              Create your first agent to start monitoring
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('create-agent')}
              className="bg-[#D65A31] text-[#EEEEEE] px-6 py-3 rounded-full font-semibold"
            >
              Create Agent
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('agent-detail', agent.id)}
                className="bg-[#393E46] rounded-3xl p-5 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-[#222831] p-3 rounded-xl">
                    {getSourceIcon(agent.source_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-[#EEEEEE] font-semibold text-lg">
                        {agent.title}
                      </h3>
                      <button className="text-[#EEEEEE]/60">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#EEEEEE]/60 mb-3">
                      <span className="capitalize">{agent.monitor_frequency}</span>
                      <span>•</span>
                      <span>{agent.credits_per_check} credits/check</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        agent.is_active
                          ? 'bg-[#4CAF50]/20 text-[#4CAF50]'
                          : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                      }`}>
                        {agent.is_active ? 'Active' : 'Paused'}
                      </div>
                      {agent.source_url && (
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-[#222831] text-[#EEEEEE]/60 truncate max-w-[180px]">
                          {agent.source_url}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav currentScreen="agents" navigate={navigate} />
    </div>
  );
}