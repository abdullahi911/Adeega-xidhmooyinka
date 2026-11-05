-- ==============================================================================
-- XIRMO INTERNET — Complete Supabase Database Setup & Admin Creation Script
-- ==============================================================================
-- How to use:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> Click on "SQL Editor" on the left menu.
-- 3. Click "+ New query", paste this entire script, and click "RUN".
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CREATE 'packages' TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('safaricom', 'ethiotelecom', 'other')),
  category TEXT NOT NULL CHECK (category IN ('daily', 'weekly', 'monthly', 'custom')),
  name TEXT NOT NULL,
  badge TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  data_amount TEXT DEFAULT 'Unlimited',
  data_unit TEXT DEFAULT 'Unlimited',
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  currency TEXT DEFAULT 'Birr',
  bonus TEXT DEFAULT '',
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CREATE 'notifications' TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT DEFAULT 'announcement' CHECK (type IN ('announcement', 'alert', 'promotion', 'maintenance')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. CREATE 'admin_settings' TABLE (For automated password & credentials syncing)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. AUTOMATIC updated_at TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_packages_updated_at ON public.packages;
CREATE TRIGGER set_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_notifications_updated_at ON public.notifications;
CREATE TRIGGER set_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_admin_settings_updated_at ON public.admin_settings;
CREATE TRIGGER set_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view active packages" ON public.packages;
DROP POLICY IF EXISTS "Admins full access to packages" ON public.packages;
DROP POLICY IF EXISTS "Allow all for packages" ON public.packages;

DROP POLICY IF EXISTS "Public can view active notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins full access to notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow all for notifications" ON public.notifications;

DROP POLICY IF EXISTS "Allow all for admin_settings" ON public.admin_settings;

-- Policies allowing seamless frontend package editing and password updating
CREATE POLICY "Allow all for packages"
  ON public.packages FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for notifications"
  ON public.notifications FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for admin_settings"
  ON public.admin_settings FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 7. SEED INITIAL WELCOME ANNOUNCEMENT (OPTIONAL)
INSERT INTO public.notifications (id, title, description, type, is_active)
VALUES (
  'notif-1',
  'Welcome to Xirmo Internet!',
  'Explore our high-speed internet packages from Safaricom and EthioTelecom. Contact us today to order your package.',
  'announcement',
  true
)
ON CONFLICT (id) DO NOTHING;
