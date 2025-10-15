/*
  # Aikiko AI Monitoring Platform Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `credits` (integer, default 10)
      - `subscription_plan` (text, default 'free')
      - `subscription_credits` (integer, default 10)
      - `addon_credits` (integer, default 0)
      - `email_notifications` (boolean, default false)
      - `push_notifications` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `agents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `source_type` (text: 'twitter', 'web', 'api', 'subject')
      - `source_url` (text, nullable)
      - `notification_criteria` (text, nullable)
      - `monitor_frequency` (text: 'hourly', 'daily', 'weekly')
      - `credits_per_check` (numeric, default 1.00)
      - `is_active` (boolean, default true)
      - `last_checked_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `feed_items`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references agents)
      - `user_id` (uuid, references profiles)
      - `summary` (text)
      - `sentiment` (text: 'positive', 'neutral', 'negative')
      - `severity` (text: 'low', 'medium', 'high')
      - `alert_count` (integer, default 0)
      - `has_analysis` (boolean, default false)
      - `created_at` (timestamptz)
    
    - `activities`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references agents)
      - `description` (text)
      - `severity` (text: 'low', 'medium', 'high')
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text: 'subscription', 'credit_pack', 'usage')
      - `amount` (numeric)
      - `credits` (integer)
      - `description` (text)
      - `status` (text: 'pending', 'completed', 'failed')
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  credits integer DEFAULT 10 NOT NULL,
  subscription_plan text DEFAULT 'free' NOT NULL,
  subscription_credits integer DEFAULT 10 NOT NULL,
  addon_credits integer DEFAULT 0 NOT NULL,
  email_notifications boolean DEFAULT false NOT NULL,
  push_notifications boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('twitter', 'web', 'api', 'subject')),
  source_url text,
  notification_criteria text,
  monitor_frequency text DEFAULT 'daily' NOT NULL CHECK (monitor_frequency IN ('hourly', 'daily', 'weekly')),
  credits_per_check numeric DEFAULT 1.00 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  last_checked_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agents"
  ON agents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agents"
  ON agents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents"
  ON agents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own agents"
  ON agents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create feed_items table
CREATE TABLE IF NOT EXISTS feed_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  summary text NOT NULL,
  sentiment text DEFAULT 'neutral' NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  severity text DEFAULT 'low' NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  alert_count integer DEFAULT 0 NOT NULL,
  has_analysis boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feed items"
  ON feed_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feed items"
  ON feed_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  severity text DEFAULT 'low' NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  metadata jsonb DEFAULT '{}' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities for own agents"
  ON activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = activities.agent_id
      AND agents.user_id = auth.uid()
    )
  );

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('subscription', 'credit_pack', 'usage')),
  amount numeric NOT NULL,
  credits integer NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'completed' NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_user_id ON feed_items(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_agent_id ON feed_items(agent_id);
CREATE INDEX IF NOT EXISTS idx_activities_agent_id ON activities(agent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);