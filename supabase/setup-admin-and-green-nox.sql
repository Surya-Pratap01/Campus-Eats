-- Proper RLS setup for CampusEats
-- This ensures security while allowing the app to work correctly

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view outlets" ON outlets;
DROP POLICY IF EXISTS "Admins can manage outlets" ON outlets;
DROP POLICY IF EXISTS "Authenticated users can view menu items" ON menu_items;
DROP POLICY IF EXISTS "Admins can manage menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can view ratings" ON ratings;
DROP POLICY IF EXISTS "Users can manage own ratings" ON ratings;

-- Create proper RLS policies

-- Profiles: Users can view all profiles (needed for reviews), update own profile
CREATE POLICY "Users can view profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Outlets: Authenticated users can view, only admins can modify
CREATE POLICY "Authenticated users can view outlets" ON outlets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage outlets" ON outlets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Menu items: Authenticated users can view, only admins can modify
CREATE POLICY "Authenticated users can view menu items" ON menu_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage menu items" ON menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Ratings: Authenticated users can view all ratings, manage own ratings
CREATE POLICY "Authenticated users can view ratings" ON ratings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users can update own ratings" ON ratings FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Users can delete own ratings" ON ratings FOR DELETE USING (auth.uid() = student_id);

-- Ensure admin user exists and has admin privileges
INSERT INTO profiles (id, email, full_name, is_admin)
VALUES ('dc203d0e-bb48-4c1f-8513-9063d420f6ae', 's24cseu1873@bennett.edu.in', 'Admin User', true)
ON CONFLICT (id) DO UPDATE SET is_admin = true;
