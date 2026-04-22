-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  blood_group text NOT NULL,
  is_donor boolean DEFAULT true,
  location geography(Point, 4326),
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Create Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blood_group text NOT NULL,
  units_required integer NOT NULL,
  hospital_name text NOT NULL,
  location geography(Point, 4326) NOT NULL,
  status text CHECK (status IN ('open', 'fulfilled', 'cancelled')) DEFAULT 'open',
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 5. Profiles RLS Policies
-- Users can read all profiles (for donor discovery)
CREATE POLICY "Users can read all profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Allow profile creation on signup
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 6. Requests RLS Policies
-- Users can read all requests
CREATE POLICY "Users can read all requests" 
ON public.requests FOR SELECT 
USING (true);

-- Users can create requests (authenticated only)
CREATE POLICY "Authenticated users can create requests" 
ON public.requests FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

-- Users can update own requests
CREATE POLICY "Users can update own requests" 
ON public.requests FOR UPDATE 
USING (auth.uid() = requester_id);

-- Users can delete own requests
CREATE POLICY "Users can delete own requests" 
ON public.requests FOR DELETE 
USING (auth.uid() = requester_id);

-- 7. Geospatial Indexing (for efficient ST_DWithin queries)
CREATE INDEX IF NOT EXISTS profiles_location_idx ON public.profiles USING GIST (location);
CREATE INDEX IF NOT EXISTS requests_location_idx ON public.requests USING GIST (location);

-- 8. PostGIS Helper Function: find_nearby_donors
CREATE OR REPLACE FUNCTION find_nearby_donors(
  lat double precision,
  lng double precision,
  radius_km double precision
)
RETURNS TABLE (
  id uuid,
  full_name text,
  phone text,
  blood_group text,
  distance_meters double precision
)
LANGUAGE plpgsql
SECURITY DEFINER -- Ensures the function runs with privileges of the creator
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.blood_group,
    ST_Distance(p.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) AS distance_meters
  FROM public.profiles p
  WHERE p.is_donor = true
    AND p.location IS NOT NULL
    AND ST_DWithin(
      p.location, 
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, 
      radius_km * 1000 -- Convert km to meters
    )
  ORDER BY distance_meters ASC;
END;
$$;
