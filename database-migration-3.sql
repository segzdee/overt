-- Performance optimized migrations for OvertimeStaff platform

-- Set up tables for market updates if they don't exist
CREATE TABLE IF NOT EXISTS market_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('URGENT', 'SWAP', 'PREMIUM')),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  rate TEXT,
  highlight BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  region TEXT,
  currency TEXT DEFAULT 'EUR',
  original_rate NUMERIC NOT NULL,
  currency_rate NUMERIC DEFAULT 1,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for market_updates table
CREATE INDEX IF NOT EXISTS idx_market_updates_type ON market_updates(type);
CREATE INDEX IF NOT EXISTS idx_market_updates_created_at ON market_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_updates_urgency ON market_updates(urgency_level);

-- Create profiles table if it doesn't exist (matches existing schema)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  role TEXT CHECK (role IN ('admin', 'agency', 'business', 'staff')),

  PRIMARY KEY (id),
  UNIQUE(username),
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Create shifts table with optimized schema
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  business_id UUID REFERENCES profiles(id),
  agency_id UUID REFERENCES profiles(id),
  worker_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('available', 'pending', 'assigned', 'completed', 'cancelled')) NOT NULL,
  hourly_rate NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  region TEXT,
  skills TEXT[],
  requirements TEXT,
  position_type TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES profiles(id)
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')) NOT NULL,
  notes TEXT,
  admin_notes TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optimized indexes for shifts and applications tables
CREATE INDEX IF NOT EXISTS idx_shifts_status ON shifts(status);
CREATE INDEX IF NOT EXISTS idx_shifts_date_range ON shifts(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_shifts_business_id ON shifts(business_id);
CREATE INDEX IF NOT EXISTS idx_shifts_agency_id ON shifts(agency_id);
CREATE INDEX IF NOT EXISTS idx_shifts_worker_id ON shifts(worker_id);
CREATE INDEX IF NOT EXISTS idx_shifts_location ON shifts(location);
CREATE INDEX IF NOT EXISTS idx_shifts_is_urgent ON shifts(is_urgent) WHERE is_urgent = true;
CREATE INDEX IF NOT EXISTS idx_shifts_position_type ON shifts(position_type);
CREATE INDEX IF NOT EXISTS idx_shifts_created_at ON shifts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_shift_id ON applications(shift_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker_id ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  postal_code TEXT,
  country TEXT,
  industry TEXT,
  size TEXT CHECK (size IN ('small', 'medium', 'large', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create organization_members table for many-to-many relationship
CREATE TABLE IF NOT EXISTS organization_members (
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (organization_id, profile_id)
);

-- Create indexes for organizations
CREATE INDEX IF NOT EXISTS idx_organization_members_profile ON organization_members(profile_id);

-- Function to handle new user creation (adapted from existing schema)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, updated_at)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    new.raw_user_meta_data->>'role',
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update 'updated_at' timestamp on record changes
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers to all relevant tables
DROP TRIGGER IF EXISTS set_timestamp_profiles ON profiles;
CREATE TRIGGER set_timestamp_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS set_timestamp_shifts ON shifts;
CREATE TRIGGER set_timestamp_shifts
  BEFORE UPDATE ON shifts
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS set_timestamp_applications ON applications;
CREATE TRIGGER set_timestamp_applications
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS set_timestamp_market_updates ON market_updates;
CREATE TRIGGER set_timestamp_market_updates
  BEFORE UPDATE ON market_updates
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS set_timestamp_organizations ON organizations;
CREATE TRIGGER set_timestamp_organizations
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Function to handle market update notifications
CREATE OR REPLACE FUNCTION notify_market_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'market_update',
    json_build_object(
      'event', TG_OP,
      'id', NEW.id,
      'type', NEW.type,
      'urgency_level', NEW.urgency_level,
      'time', now()
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for market update notifications
DROP TRIGGER IF EXISTS market_update_notify ON market_updates;
CREATE TRIGGER market_update_notify
  AFTER INSERT OR UPDATE ON market_updates
  FOR EACH ROW EXECUTE PROCEDURE notify_market_update();

-- Set up Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- RLS policies for shifts
CREATE POLICY "Shifts are viewable by everyone."
  ON shifts FOR SELECT
  USING ( true );

CREATE POLICY "Agency and business users can insert shifts."
  ON shifts FOR INSERT
  WITH CHECK ( 
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'agency' OR profiles.role = 'business' OR profiles.role = 'admin')
    )
  );

CREATE POLICY "Business users can update their shifts."