'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Trash2, Twitter, Globe, Code, MessageSquare } from 'lucide-react';
import { Screen, Agent } from '../AikikoApp';
import { createClient } from '@/lib/supabase-client';

interface AgentDetailProps {
  agentId: string;
  goBack: () => void;
}

export function AgentDetail({ agentId, goBack }: AgentDetailProps) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const supabase = createClient();

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', agentId)
          .single();

        if (error) throw error;
        if (data) setAgent(data);
      } catch (error) {
        console.error('Error fetching agent:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId, supabase]);

  const toggleAgentStatus = async () => {
    if (!agent) return;

    try {
      const { error } = await supabase
        .from('agents')
        .update({ is_active: !agent.is_active })
        .eq('id', agentId);

      if (error) throw error;

      setAgent({ ...agent, is_active: !agent.is_active });
    } catch (error) {
      console.error('Error updating agent status:', error);
    }
  };

  const deleteAgent = async () => {
    if (!agent) return;

    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;

      goBack();
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Failed to delete agent');
    }
  };

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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#222831]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D65A31]"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#222831] p-6">
        <h2 className="text-[#EEEEEE] text-xl font-bold mb-2">Agent not found</h2>
        <p className="text-[#EEEEEE]/60 text-center mb-6">
          The agent you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={goBack}
          className="bg-[#D65A31] text-[#EEEEEE] px-6 py-3 rounded-full font-semibold"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#222831]">
      <div className="px-6 pt-6 pb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={goBack}
          className="w-12 h-12 bg-[#393E46] rounded-full flex items-center justify-center mb-4"
        >
          <ArrowLeft size={24} className="text-[#EEEEEE]" />
        </motion.button>

        <div className="flex items-start gap-4 mb-6">
          <div className="bg-[#393E46] p-4 rounded-2xl">
            {getSourceIcon(agent.source_type)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-[#EEEEEE] truncate mb-2 font-['Museo_Moderno']">
              {agent.title}
            </h1>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                agent.is_active
                  ? 'bg-[#4CAF50]/20 text-[#4CAF50]'
                  : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
              }`}>
                {agent.is_active ? 'Active' : 'Paused'}
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-[#393E46] text-[#EEEEEE]/60">
                {agent.source_type}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleAgentStatus}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 ${
              agent.is_active
                ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                : 'bg-[#4CAF50]/20 text-[#4CAF50]'
            }`}
          >
            {agent.is_active ? <Pause size={20} /> : <Play size={20} />}
            {agent.is_active ? 'Pause' : 'Activate'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={deleteAgent}
            className="bg-[#393E46] text-[#FF6B6B] py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
          >
            <Trash2 size={20} />
            Delete
          </motion.button>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex gap-1 bg-[#393E46] rounded-2xl p-1">
          {['overview', 'activity', 'insights', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-[#222831] text-[#EEEEEE]'
                  : 'text-[#EEEEEE]/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-[#393E46] rounded-3xl p-6">
              <h2 className="text-[#EEEEEE] font-semibold text-lg mb-4">Monitoring Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#EEEEEE]/60">Frequency</span>
                  <span className="text-[#EEEEEE] capitalize">{agent.monitor_frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#EEEEEE]/60">Credits per check</span>
                  <span className="text-[#EEEEEE]">{agent.credits_per_check}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#EEEEEE]/60">Last checked</span>
                  <span className="text-[#EEEEEE]">
                    {agent.last_checked_at
                      ? new Date(agent.last_checked_at).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#EEEEEE]/60">Created</span>
                  <span className="text-[#EEEEEE]">
                    {new Date(agent.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {agent.source_url && (
              <div className="bg-[#393E46] rounded-3xl p-6">
                <h2 className="text-[#EEEEEE] font-semibold text-lg mb-2">Source URL</h2>
                <p className="text-[#D65A31] break-all">{agent.source_url}</p>
              </div>
            )}

            {agent.notification_criteria && (
              <div className="bg-[#393E46] rounded-3xl p-6">
                <h2 className="text-[#EEEEEE] font-semibold text-lg mb-2">Notification Criteria</h2>
                <p className="text-[#EEEEEE]/80 text-sm leading-relaxed">
                  Once created, your agent will start monitoring relevant content from various sources.
                  You&#39;ll receive updates in your feed and receiving notifications as new information becomes
                  available.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="py-6 text-center">
            <div className="bg-[#393E46] rounded-3xl p-8 max-w-xs mx-auto">
              <div className="w-16 h-16 bg-[#222831] rounded-full flex items-center justify-center mx-auto mb-4">
                <Play size={32} className="text-[#D65A31]" />
              </div>
              <h3 className="text-[#EEEEEE] font-semibold text-lg mb-2">Activity Timeline</h3>
              <p className="text-[#EEEEEE]/60 text-sm">
                Activity history for this agent will appear here
              </p>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="py-6 text-center">
            <div className="bg-[#393E46] rounded-3xl p-8 max-w-xs mx-auto">
              <div className="w-16 h-16 bg-[#222831] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe size={32} className="text-[#D65A31]" />
              </div>
              <h3 className="text-[#EEEEEE] font-semibold text-lg mb-2">AI Insights</h3>
              <p className="text-[#EEEEEE]/60 text-sm">
                Trend analysis and insights will appear here
              </p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 py-6">
            <div className="bg-[#393E46] rounded-3xl p-6">
              <h2 className="text-[#EEEEEE] font-semibold text-lg mb-4">Agent Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#EEEEEE] font-medium">Monitoring Status</h3>
                    <p className="text-[#EEEEEE]/60 text-sm">
                      {agent.is_active
                        ? 'Agent is actively monitoring'
                        : 'Agent is paused'}
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAgentStatus}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      agent.is_active ? 'bg-[#4CAF50]' : 'bg-[#EEEEEE]/20'
                    }`}
                  >
                    <motion.div
                      animate={{
                        x: agent.is_active ? 24 : 2,
                      }}
                      className="w-5 h-5 bg-[#EEEEEE] rounded-full"
                    />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="bg-[#393E46] rounded-3xl p-6">
              <h2 className="text-[#EEEEEE] font-semibold text-lg mb-4">Danger Zone</h2>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={deleteAgent}
                className="w-full bg-[#FF6B6B]/20 text-[#FF6B6B] py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 size={20} />
                Delete Agent
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}