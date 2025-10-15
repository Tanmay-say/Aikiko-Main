'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { BottomNav } from '../BottomNav';
import { Screen } from '../AikikoApp';
import { createClient } from '@/lib/supabase-client';

interface ProfileProps {
  navigate: (screen: Screen) => void;
}

interface Profile {
  credits: number;
  subscription_plan: string;
  subscription_credits: number;
  addon_credits: number;
  email_notifications: boolean;
  push_notifications: boolean;
}

export function Profile({ navigate }: ProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (data) {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  const updateNotificationSetting = async (field: 'email_notifications' | 'push_notifications', value: boolean) => {
    if (!profile) return;

    setProfile({ ...profile, [field]: value });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ [field]: value })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error updating notification setting:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#222831]">
        <Loader2 className="animate-spin text-[#D65A31]" size={32} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#222831]">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-4xl font-bold text-[#EEEEEE] font-['Museo_Moderno']">Profile</h1>
        <p className="text-[#EEEEEE]/60 text-lg mt-1">Account Settings</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 px-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-[#393E46] rounded-3xl p-6"
          >
            <p className="text-[#EEEEEE]/60 text-sm mb-2">Your plan</p>
            <h2 className="text-5xl font-bold text-[#EEEEEE] capitalize">
              {profile?.subscription_plan || 'Free'}
            </h2>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('credits')}
            className="bg-[#393E46] rounded-3xl p-6 cursor-pointer"
          >
            <p className="text-[#EEEEEE]/60 text-sm mb-2">Credits</p>
            <h2 className="text-5xl font-bold text-[#EEEEEE] mb-2">
              {profile?.credits || 0}
            </h2>
            <p className="text-xs text-[#EEEEEE]/60">
              Subscription Credits: {profile?.subscription_credits || 0}
            </p>
            <p className="text-xs text-[#EEEEEE]/60">
              Addon Credits: {profile?.addon_credits || 0}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#222831] text-[#EEEEEE] py-2 rounded-xl text-sm font-semibold mt-3"
            >
              Buy Credits
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#393E46] rounded-3xl p-6"
        >
          <h3 className="text-[#EEEEEE] font-semibold text-lg mb-2">Subscription</h3>
          <p className="text-[#EEEEEE]/60 text-sm mb-4">
            Buy, Cancel, Switch Paid Plans, etc.
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#222831] text-[#EEEEEE] py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles size={20} className="text-[#FFB800]" />
            Upgrade to Pro Plan
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#393E46] rounded-3xl p-6"
        >
          <h3 className="text-[#EEEEEE] font-semibold text-lg mb-4">Notification Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#EEEEEE]">Email Notifications</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateNotificationSetting('email_notifications', !profile?.email_notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  profile?.email_notifications ? 'bg-[#4CAF50]' : 'bg-[#EEEEEE]/20'
                }`}
              >
                <motion.div
                  animate={{
                    x: profile?.email_notifications ? 24 : 2,
                  }}
                  className="w-5 h-5 bg-[#EEEEEE] rounded-full"
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#EEEEEE]">Push Notifications</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateNotificationSetting('push_notifications', !profile?.push_notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  profile?.push_notifications ? 'bg-[#4CAF50]' : 'bg-[#EEEEEE]/20'
                }`}
              >
                <motion.div
                  animate={{
                    x: profile?.push_notifications ? 24 : 2,
                  }}
                  className="w-5 h-5 bg-[#EEEEEE] rounded-full"
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav currentScreen="profile" navigate={navigate} />
    </div>
  );
}