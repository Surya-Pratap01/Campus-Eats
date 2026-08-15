-- Set up Supabase Storage for outlet images

-- Create storage bucket for outlet images
INSERT INTO storage.buckets (id, name, public)
VALUES ('outlet-images', 'outlet-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to outlet images
CREATE POLICY "Public Access Outlet Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'outlet-images');

-- Allow authenticated users to upload outlet images
CREATE POLICY "Authenticated Upload Outlet Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'outlet-images');

-- Allow authenticated users to update outlet images
CREATE POLICY "Authenticated Update Outlet Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'outlet-images');

-- Allow authenticated users to delete outlet images
CREATE POLICY "Authenticated Delete Outlet Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'outlet-images');
