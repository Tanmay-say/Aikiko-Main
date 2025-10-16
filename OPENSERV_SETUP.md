# OpenServ Integration Setup Guide

## Quick Start

### 1. Create OpenServ Account
1. Go to https://openserv.ai/signup
2. Verify email and log in
3. Navigate to **Developer** → **Build Agent**

### 2. Create Your Monitoring Agent

#### Agent Configuration
- **Name**: `Aikiko Monitor Agent`
- **Description**: `AI agent that monitors social media, web pages, and topics for Aikiko users`

#### System Prompt
```
I'm the Aikiko Monitor Agent. I track social media accounts, web pages, and subjects based on user configuration. I analyze content, detect changes, and generate intelligent summaries for user feeds.

My capabilities include:
- Monitoring Twitter/X accounts for new posts and activity
- Tracking web pages for content changes
- Analyzing subjects and topics across multiple sources
- Generating AI-powered summaries with sentiment analysis
- Sending real-time notifications on relevant updates
- Filtering content by keywords and custom timeframes
```

#### Tools & Capabilities (if prompted)
- [x] Web scraping
- [x] API integration
- [x] Content analysis
- [x] Real-time monitoring
- [x] Custom webhooks

### 3. Get Your Credentials

After creating the agent:
1. Navigate to **Settings** → **API Keys**
2. Click **Generate New API Key**
3. Copy both:
   - **API Key**: `sk_live_...` (keep this secret!)
   - **Agent ID**: From the agent dashboard URL or settings

### 4. Configure Environment Variables

Create `.env.local` in your project root (if it doesn't exist):

```bash
# Supabase (you already have these)
NEXT_PUBLIC_SUPABASE_URL=https://ynzzkchwtioimzmjrnsd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenServ Credentials (ADD THESE)
NEXT_PUBLIC_OPENSERV_API_KEY=sk_live_your_api_key_here
NEXT_PUBLIC_OPENSERV_AGENT_ID=agent_your_agent_id_here
NEXT_PUBLIC_OPENSERV_WEBHOOK_URL=https://api.openserv.ai/webhooks/trigger/d4b0927a1335453ca7c608b2671e5d3a
```

### 5. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 6. Test Integration

1. Sign in to your app
2. Go to Create Agent
3. Fill form and click "Create Agent"
4. Check browser console for:
   ```
   OpenServ Config: { hasApiKey: true, hasAgentId: true, ... }
   ```
5. If you see errors, verify your credentials match exactly

## Troubleshooting

### Error: "OpenServ credentials missing"
- **Cause**: `.env.local` not loaded or keys missing
- **Fix**: 
  1. Verify `.env.local` exists in project root
  2. Restart dev server
  3. Hard refresh browser (Ctrl/Cmd+Shift+R)

### Error: "401 Unauthorized"
- **Cause**: Invalid API key
- **Fix**: Regenerate API key in OpenServ dashboard and update `.env.local`

### Error: "404 Not Found"
- **Cause**: Incorrect Agent ID
- **Fix**: Copy Agent ID from OpenServ dashboard Settings

### Error: "Webhook failed"
- **Cause**: Network issue or webhook URL incorrect
- **Fix**: 
  1. Check your webhook URL in OpenServ dashboard
  2. Update `NEXT_PUBLIC_OPENSERV_WEBHOOK_URL` if different
  3. Verify firewall/network allows outbound HTTPS

## How It Works

### Agent Creation Flow
```
User fills form → Click "Create Agent"
  ↓
Build OpenServ config (JSON)
  ↓
POST to OpenServ webhook with:
  - Authorization: Bearer YOUR_API_KEY
  - X-Agent-ID: YOUR_AGENT_ID
  - config: { type, provider, handle, etc. }
  ↓
OpenServ processes request
  ↓
Returns task_id and status
  ↓
Save agent to Supabase
  ↓
Start monitoring (if active)
  ↓
Display in Agents list
```

### Payload Examples

#### Twitter Monitoring
```json
{
  "action": "create_agent",
  "agent_id": "agent_xyz123",
  "config": {
    "type": "social",
    "provider": "twitter",
    "handle": "@elonmusk",
    "channels": ["timeline", "replies"],
    "timeframe": "24h",
    "keywords": ["tesla", "spacex"]
  },
  "timestamp": "2025-10-16T12:00:00Z"
}
```

#### Web Page Monitoring
```json
{
  "action": "create_agent",
  "agent_id": "agent_xyz123",
  "config": {
    "type": "web",
    "url": "https://netflix.com/careers/jobs",
    "notificationCriteria": "Tell me when Backend Engineer job is posted"
  },
  "timestamp": "2025-10-16T12:00:00Z"
}
```

## Security Notes

- **Never commit `.env.local`** to git (already in `.gitignore`)
- **Never share your API key** publicly
- **Rotate keys** if exposed
- Use **environment variables** only, never hardcode keys

## Support

- OpenServ Docs: https://docs.openserv.ai
- Aikiko Issues: [GitHub](your-repo-url)

---

**Last Updated**: Oct 2025

