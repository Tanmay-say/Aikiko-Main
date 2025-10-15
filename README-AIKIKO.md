# Aikiko - AI-Powered Monitoring Platform

A comprehensive mobile-first web application built with Next.js for monitoring and analyzing content across multiple sources.

## Features

### 📱 Mobile-First Design
- Optimized for 390x844px viewport (mobile devices)
- Chunky rounded cards with playful interactions
- Premium feel with smooth animations
- Compatible with Telegram Mini Apps, Farcaster, Base dApp, etc.

### 🎨 Color Palette
- **Primary Background:** #222831 (dark navy)
- **Card Background:** #393E46 (grey)
- **Accent/CTA:** #D65A31 (vibrant orange)
- **Text:** #EEEEEE (off-white)
- **Success/Premium:** #FFB800 (gold)

### 🚀 Core Features

#### 1. Feed Dashboard
- Scrollable feed with AI-generated summaries
- Source type indicators (Twitter, Web, API, Subject)
- Sentiment analysis badges
- Action buttons (View, Analysis, Alerts)
- Empty state with onboarding flow
- Bottom navigation

#### 2. Create Agent Flow
- Multi-step form with progress indicators
- Source type selection (Subject, Web Page, Twitter, API)
- AI-powered monitoring rules configuration
- Notification settings with frequency controls
- Credits cost calculation
- Smooth slide transitions

#### 3. Agent Management
- List view of all agents
- Active/Paused status indicators
- Quick actions and settings
- Agent detail view with tabs:
  - Overview: Status and AI summary
  - Activity: Timeline of changes
  - Insights: Trend analysis
  - Settings: Pause/Resume/Delete

#### 4. Credits & Subscription
- Visual credits balance with circular progress
- Subscription plan cards
- One-time credit packs
- Usage statistics
- Transaction history

#### 5. Profile & Settings
- Current plan overview
- Credits breakdown
- Notification preferences (Email/Push)
- Upgrade to Pro options

## Tech Stack

- **Framework:** Next.js 13+ (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **UI Components:** shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Supabase credentials
# You can get these from your Supabase project dashboard
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

The application requires the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

You can find these in your Supabase project dashboard under Project Settings > API.

## Database Schema

### Tables

- **profiles** - User profiles with credits and subscription info
- **agents** - Monitoring agents created by users
- **feed_items** - Content updates for each agent
- **activities** - Timeline of changes for agents
- **transactions** - Credits and subscription transactions

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authenticated access required

## Usage

### Creating an Agent

1. Click "+ Create Agent" button
2. Select source type (Subject or Web Page)
3. Enter agent details
4. Set notification criteria (optional)
5. Choose monitoring frequency
6. Review and create

### Managing Credits

1. Navigate to Profile tab
2. Click on Credits card
3. View current balance and breakdown
4. Purchase credit packs or upgrade subscription

### Viewing Feed

- Feed updates appear automatically as agents are monitored
- Click on any feed item to view details
- Use action buttons for quick access to analysis and alerts

## Customization

### Colors
Update the color values in component files:
- Primary: `#222831`
- Card: `#393E46`
- Accent: `#D65A31`
- Text: `#EEEEEE`
- Gold: `#FFB800`

### Animations
Framer Motion is used throughout. Adjust animation values in component files for different effects.

### Mobile Viewport
The app is optimized for 390x844px. Update the max-width in `AikikoApp.tsx` for different sizes.

## Integration

### Telegram Mini App
The app is ready to be integrated as a Telegram Mini App with the current mobile-optimized design.

### Farcaster Frame
Can be used as a Farcaster Frame with minimal modifications.

### Base dApp
Compatible with Base blockchain integration for crypto features.

## License

MIT