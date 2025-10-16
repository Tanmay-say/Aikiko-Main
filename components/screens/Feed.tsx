'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, Twitter, Globe, Code, MessageSquare, TrendingUp, Bell, Newspaper } from 'lucide-react';
import { AikikoWordLoader } from '@/components/AikikoWordLoader';
import { BottomNav } from '../BottomNav';
import { Screen, FeedItem } from '../AikikoApp';
import { createClient } from '@/lib/supabase-client';

interface FeedProps {
  navigate: (screen: Screen, agentId?: string) => void;
}

export function Feed({ navigate }: FeedProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const fetchFeedItems = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data: items } = await supabase
        .from('feed_items')
        .select(`
          *,
          agent:agents(*)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (items) {
        setFeedItems(items);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchFeedItems();
  }, [fetchFeedItems]);

  const handleRefresh = () => {
    fetchFeedItems(true);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'twitter':
        return <Twitter size={16} className="text-[#1DA1F2] drop-shadow-[0_0_8px_rgba(29,161,242,0.35)]" />;
      case 'web':
        return <Globe size={16} className="text-[#4CAF50] drop-shadow-[0_0_8px_rgba(76,175,80,0.35)]" />;
      case 'api':
        return <Code size={16} className="text-[#FF6B6B] drop-shadow-[0_0_8px_rgba(255,107,107,0.35)]" />;
      default:
        return <MessageSquare size={16} className="text-[#FFB800] drop-shadow-[0_0_8px_rgba(255,184,0,0.35)]" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-[#4CAF50]';
      case 'negative':
        return 'text-[#FF6B6B]';
      default:
        return 'text-[#FFB800]';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-4xl font-bold text-foreground">Aikiko</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('create-agent')}
          className="bg-background border-2 border-[#D65A31] text-[#D65A31] px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-[#D65A31] hover:text-white transition-colors shadow-[0_8px_20px_rgba(214,90,49,0.25)]"
        >
          <Plus size={20} />
          Create Agent
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 px-6">
        {refreshing && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-[#D65A31]" size={24} />
          </div>
        )}

        {loading && !refreshing ? (
          <div className="flex justify-center items-center h-64">
            <AikikoWordLoader size={220} />
          </div>
        ) : feedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-32 h-32 mb-6 rounded-full bg-card flex items-center justify-center">
              <Newspaper size={48} className="text-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No updates found</h3>
            <p className="text-foreground/60 mb-6 max-w-xs">
              Your agent updates will appear here once you have active agents
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('create-agent')}
              className="bg-[#D65A31] text-white px-6 py-3 rounded-full font-semibold shadow-[0_8px_20px_rgba(214,90,49,0.35)]"
            >
              Get Started
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {feedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('agent-detail', item.agent_id)}
                className="bg-card rounded-3xl p-5 cursor-pointer border border-border hover:border-[#D65A31]/40 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-background p-2 rounded-xl">
                    {getSourceIcon(item.agent?.source_type || 'subject')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-semibold text-lg truncate mb-1">
                      {item.agent?.title || 'Untitled Agent'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-foreground/60">
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={getSentimentColor(item.sentiment)}>
                        {item.sentiment}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-foreground/80 text-sm leading-relaxed mb-4 line-clamp-3">
                  {item.summary}
                </p>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-background text-foreground py-2 px-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={16} />
                    View
                  </motion.button>
                  {item.has_analysis && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-background text-foreground py-2 px-3 rounded-xl text-sm font-medium"
                    >
                      Analysis
                    </motion.button>
                  )}
                  {item.alert_count > 0 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#D65A31] text-white py-2 px-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-[0_8px_20px_rgba(214,90,49,0.35)]"
                    >
                      <Bell size={16} />
                      {item.alert_count}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav currentScreen="feed" navigate={navigate} />
    </div>
  );
}