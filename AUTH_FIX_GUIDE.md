# Get Your Supabase Anon Key

## Step 1: Get the Anon Key from Supabase

1. Go to: https://supabase.com/dashboard/project/ynzzkchwtioimzmjrnsd/settings/api

2. Copy the **"anon public"** key (it starts with `eyJ...`)

3. It should look like this:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluenprY2h3dGlvaW16bWpybnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MjQ4MTcsImV4cCI6MjA0NzAwMDgxN30.ACTUAL_SIGNATURE_HERE
   ```

## Step 2: Update the Code

Replace `YOUR_ACTUAL_ANON_KEY_HERE` in `lib/supabase-client.ts` with your actual anon key.

## Step 3: Set Environment Variables in Vercel

1. Go to: https://vercel.com/your-team/aikiko/settings/environment-variables

2. Add these variables for **Production, Preview, and Development**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://ynzzkchwtioimzmjrnsd.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [paste your anon key here]
   ```

3. **Redeploy** your project

## Step 4: Verify Google Provider in Supabase

1. Go to: https://supabase.com/dashboard/project/ynzzkchwtioimzmjrnsd/auth/providers

2. Click on **Google** provider

3. Make sure it shows **"Enabled"**

4. If not enabled:
   - Toggle **OFF** then **ON**
   - Paste your Google Client ID and Secret
   - Click **Save**
   - **Refresh the page** to confirm it stayed enabled

## Quick Test

After making these changes:

1. Hard refresh https://aikiko.vercel.app
2. Open DevTools Console
3. You should see:
   ```
   🔍 Supabase Config: { url: "https://ynzzkchwtioimzmjrnsd.supabase.co", hasAnonKey: true, anonKeyLength: 200+, usingFallback: false }
   ✅ Supabase client created successfully
   ```

4. Try Google auth - it should work now!

---

**The 401 error happens because:**
- Either the anon key is missing/wrong
- Or the Google provider isn't enabled in Supabase
- Or the Google Client ID/Secret is wrong

This fix addresses all three issues.
