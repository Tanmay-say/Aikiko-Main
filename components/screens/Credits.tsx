'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Zap, Crown, Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

interface CreditsProps {
  goBack: () => void;
}

interface Profile {
  credits: number;
  subscription_plan: string;
  subscription_credits: number;
  addon_credits: number;
}

export function Credits({ goBack }: CreditsProps) {
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

  const subscriptionPlans = [
    {
      name: 'Free',
      price: 0,
      credits: 10,
      features: ['10 credits/month', 'Basic monitoring', 'Email support'],
      popular: false,
    },
    {
      name: 'Pro',
      price: 19,
      credits: 500,
      features: ['500 credits/month', 'Priority monitoring', 'Advanced analytics', '24/7 support'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 99,
      credits: 5000,
      features: ['5000 credits/month', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee'],
      popular: false,
    },
  ];

  const creditPacks = [
    { credits: 100, price: 9, discount: null },
    { credits: 500, price: 39, discount: '15% off' },
    { credits: 1000, price: 69, discount: '30% off' },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#222831]">
        <Loader2 className="animate-spin text-[#D65A31]" size={32} />
      </div>
    );
  }

  const progressPercentage = profile ? (profile.credits / 500) * 100 : 0;

  return (
    <div className="h-full flex flex-col bg-[#222831] overflow-y-auto">
      <div className="px-6 pt-6 pb-4 sticky top-0 bg-[#222831] z-10">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={goBack}
          className="w-12 h-12 bg-[#393E46] rounded-full flex items-center justify-center mb-4"
        >
          <ArrowLeft size={24} className="text-[#EEEEEE]" />
        </motion.button>

        <h1 className="text-4xl font-bold text-[#EEEEEE] font-['Museo_Moderno']">Credits</h1>
        <p className="text-[#EEEEEE]/60 text-lg mt-1">Manage your credits and subscription</p>
      </div>

      <div className="px-6 pb-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#FFB800]/20 to-[#393E46] rounded-3xl p-6 border border-[#FFB800]/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#EEEEEE]/60 text-sm mb-1">Your Balance</p>
              <h2 className="text-5xl font-bold text-[#EEEEEE]">{profile?.credits || 0}</h2>
              <p className="text-[#EEEEEE]/60 text-sm mt-1">credits</p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90" width="96" height="96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#393E46"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#FFB800"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={32} className="text-[#FFB800]" />
              </div>
            </div>
          </div>
          <div className="bg-[#222831]/50 rounded-xl p-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#EEEEEE]/60">Subscription</span>
              <span className="text-[#EEEEEE]">{profile?.subscription_credits || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#EEEEEE]/60">Add-on</span>
              <span className="text-[#EEEEEE]">{profile?.addon_credits || 0}</span>
            </div>
          </div>
        </motion.div>

        <div>
          <h3 className="text-[#EEEEEE] font-bold text-xl mb-4">Subscription Plans</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`min-w-[280px] bg-[#393E46] rounded-3xl p-6 relative ${
                  plan.popular ? 'border-2 border-[#FFB800]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFB800] text-[#222831] px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Crown size={12} />
                    POPULAR
                  </div>
                )}
                <h4 className="text-[#EEEEEE] font-bold text-2xl mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-[#EEEEEE]">${plan.price}</span>
                  <span className="text-[#EEEEEE]/60">/month</span>
                </div>
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check size={16} className="text-[#4CAF50]" />
                      <span className="text-[#EEEEEE]/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold ${
                    plan.popular
                      ? 'bg-[#FFB800] text-[#222831]'
                      : 'bg-[#222831] text-[#EEEEEE]'
                  }`}
                >
                  {profile?.subscription_plan === plan.name.toLowerCase() ? 'Current Plan' : 'Upgrade'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[#EEEEEE] font-bold text-xl mb-4">One-Time Credit Packs</h3>
          <div className="grid grid-cols-2 gap-4">
            {creditPacks.map((pack, index) => (
              <motion.div
                key={pack.credits}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#393E46] rounded-2xl p-4 relative"
              >
                {pack.discount && (
                  <div className="absolute -top-2 -right-2 bg-[#D65A31] text-[#EEEEEE] px-2 py-1 rounded-lg text-xs font-bold">
                    {pack.discount}
                  </div>
                )}
                <Zap size={24} className="text-[#FFB800] mb-2" />
                <h4 className="text-[#EEEEEE] font-bold text-xl mb-1">{pack.credits}</h4>
                <p className="text-[#EEEEEE]/60 text-sm mb-3">credits</p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#D65A31] text-[#EEEEEE] py-2 rounded-xl font-semibold"
                >
                  ${pack.price}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}