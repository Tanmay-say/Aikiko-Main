'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Twitter, Globe, Code, MessageSquare, Check, Loader2 } from 'lucide-react';
import { Screen } from '../AikikoApp';
import { createClient } from '@/lib/supabase-client';

interface CreateAgentProps {
  goBack: () => void;
  navigate: (screen: Screen) => void;
}

type SourceType = 'twitter' | 'web' | 'api' | 'subject';

export function CreateAgent({ goBack, navigate }: CreateAgentProps) {
  const [step, setStep] = useState(1);
  const [sourceType, setSourceType] = useState<SourceType>('subject');
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [notificationCriteria, setNotificationCriteria] = useState('');
  const [monitorFrequency, setMonitorFrequency] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const sources = [
    { id: 'subject' as SourceType, icon: MessageSquare, label: 'Subject', color: '#FFB800' },
    { id: 'web' as SourceType, icon: Globe, label: 'Web Page', color: '#4CAF50' },
    { id: 'twitter' as SourceType, icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
    { id: 'api' as SourceType, icon: Code, label: 'API', color: '#FF6B6B' },
  ];

  const handleCreateAgent = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('Please sign in to create agents');
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('agents').insert({
        user_id: user.id,
        title: title || 'Untitled Agent',
        source_type: sourceType,
        source_url: sourceUrl || null,
        notification_criteria: notificationCriteria || null,
        monitor_frequency: monitorFrequency,
        credits_per_check: 1.0,
        is_active: isActive,
      });

      if (error) throw error;

      navigate('feed');
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  const getCreditsPerDay = () => {
    switch (monitorFrequency) {
      case 'hourly':
        return '~24.00';
      case 'daily':
        return '~1.00';
      case 'weekly':
        return '~0.14';
      default:
        return '1.00';
    }
  };

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

        <h1 className="text-4xl font-bold text-[#EEEEEE] font-['Museo_Moderno']">Create Agent</h1>
        <p className="text-[#EEEEEE]/60 text-lg mt-1">to watch and monitor.</p>

        <div className="flex gap-2 mt-6">
          {[1, 2, 3].map((dotStep) => (
            <div
              key={dotStep}
              className={`h-2 rounded-full transition-all ${
                step >= dotStep ? 'bg-[#D65A31] w-8' : 'bg-[#393E46] w-2'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setSourceType('subject')}
                  className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-colors ${
                    sourceType === 'subject'
                      ? 'bg-[#222831] text-[#EEEEEE]'
                      : 'bg-[#393E46] text-[#EEEEEE]/60'
                  }`}
                >
                  Subject
                </button>
                <button
                  onClick={() => setSourceType('web')}
                  className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-colors ${
                    sourceType === 'web'
                      ? 'bg-[#222831] text-[#EEEEEE]'
                      : 'bg-[#393E46] text-[#EEEEEE]/60'
                  }`}
                >
                  Web Page
                </button>
              </div>

              {sourceType === 'subject' ? (
                <div>
                  <label className="text-[#EEEEEE] font-semibold block mb-2">
                    Subject Name <span className="text-[#D65A31]">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bitcoin price"
                    className="w-full bg-[#393E46] text-[#EEEEEE] px-4 py-4 rounded-2xl border-2 border-transparent focus:border-[#D65A31] outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[#EEEEEE] font-semibold block mb-2">
                    Web Page URL <span className="text-[#D65A31]">*</span>
                  </label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="e.g. https://netflix.com/careers/jobs"
                    className="w-full bg-[#393E46] text-[#EEEEEE] px-4 py-4 rounded-2xl border-2 border-transparent focus:border-[#D65A31] outline-none"
                  />
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <label className="text-[#EEEEEE] font-semibold block mb-2">
                Notification Criteria (optional)
              </label>
              <textarea
                value={notificationCriteria}
                onChange={(e) => setNotificationCriteria(e.target.value)}
                placeholder={
                  sourceType === 'subject'
                    ? 'e.g. Tell me when Bitcoin price goes above $120,000'
                    : 'e.g. Tell me when Backend Engineer job is posted'
                }
                rows={6}
                className="w-full bg-[#393E46] text-[#EEEEEE] px-4 py-4 rounded-2xl border-2 border-transparent focus:border-[#D65A31] outline-none resize-none"
              />
              <p className="text-[#EEEEEE]/60 text-sm mt-2">
                Describe what specific things you want to monitor and to be notified about.
              </p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="text-[#EEEEEE] font-semibold block mb-2">Monitor Every</label>
                <select
                  value={monitorFrequency}
                  onChange={(e) => setMonitorFrequency(e.target.value as any)}
                  className="w-full bg-[#393E46] text-[#EEEEEE] px-4 py-4 rounded-2xl border-2 border-transparent focus:border-[#D65A31] outline-none appearance-none"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                <p className="text-[#EEEEEE]/60 text-sm mt-2">
                  You have 10 credits. This interval will use {getCreditsPerDay()} credits/day
                </p>
              </div>

              <div>
                <label className="text-[#EEEEEE] font-semibold block mb-3">Monitoring Status</label>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsActive(!isActive)}
                    className={`w-14 h-7 rounded-full transition-colors ${
                      isActive ? 'bg-[#4CAF50]' : 'bg-[#EEEEEE]/20'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isActive ? 28 : 2 }}
                      className="w-6 h-6 bg-[#EEEEEE] rounded-full"
                    />
                  </motion.button>
                  <span className="text-[#EEEEEE]">
                    {isActive ? 'Start monitoring immediately' : 'Start paused'}
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1DA1F2]/10 border-2 border-[#1DA1F2]/30 rounded-2xl p-4"
              >
                <div className="flex gap-3">
                  <div className="text-[#1DA1F2] mt-1">ℹ️</div>
                  <div>
                    <h4 className="text-[#1DA1F2] font-semibold mb-1">How it works</h4>
                    <p className="text-[#EEEEEE]/80 text-sm leading-relaxed">
                      Once created, your agent will start monitoring relevant content from various sources.
                      You&#39;ll receive updates in your feed and receiving notifications as new information becomes
                      available.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#222831] border-t border-[#393E46] p-6 max-w-[390px] mx-auto">
        {step < 3 ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && sourceType === 'subject' && !title) ||
              (step === 1 && sourceType === 'web' && !sourceUrl)
            }
            className="w-full bg-[#D65A31] text-[#EEEEEE] py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateAgent}
            disabled={loading}
            className="w-full bg-[#D65A31] text-[#EEEEEE] py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating...
              </>
            ) : (
              <>
                <Check size={20} />
                Create Agent
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}