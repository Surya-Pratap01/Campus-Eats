-- Step 1: Add Green Nox Outlet
INSERT INTO outlets (name, description, location, photo_url)
VALUES (
  'Green Nox',
  'Healthy, fresh, and balanced food made for everyday wellness.',
  'P-Block, Bennett University',
  NULL
);

-- Step 2: Get the outlet ID that was just created
-- Run this query and note the ID returned:
SELECT id FROM outlets WHERE name = 'Green Nox' ORDER BY created_at DESC LIMIT 1;

-- Step 3: Replace 'YOUR_OUTLET_ID' below with the actual ID from Step 2, then run these inserts:

-- QUICK BITES
INSERT INTO menu_items (outlet_id, name, category, price, photo_url)
VALUES 
  ('YOUR_OUTLET_ID', 'Classic French Fries', 'Snacks', 89, NULL),
  ('YOUR_OUTLET_ID', 'Peri Peri French Fries', 'Snacks', 99, NULL),
  ('YOUR_OUTLET_ID', 'Korean French Fries', 'Snacks', 99, NULL),
  ('YOUR_OUTLET_ID', 'Loaded French Fries', 'Snacks', 139, NULL),
  ('YOUR_OUTLET_ID', 'Loaded Nachos', 'Snacks', 129, NULL);

-- TACOS
INSERT INTO menu_items (outlet_id, name, category, price, photo_url)
VALUES 
  ('YOUR_OUTLET_ID', 'Mexican Veg Taco(2pc)', 'Meals', 129, NULL),
  ('YOUR_OUTLET_ID', 'Cottage Cheese Taco(2pc)', 'Meals', 139, NULL),
  ('YOUR_OUTLET_ID', 'Mexican Chicken Taco(2pc)', 'Meals', 169, NULL);

-- WAFFLES (2pcs)
INSERT INTO menu_items (outlet_id, name, category, price, photo_url)
VALUES 
  ('YOUR_OUTLET_ID', 'Double Chocolate Waffles', 'Desserts', 149, NULL),
  ('YOUR_OUTLET_ID', 'Brownie Waffles', 'Desserts', 179, NULL),
  ('YOUR_OUTLET_ID', 'Mixed Berry Waffles', 'Desserts', 189, NULL),
  ('YOUR_OUTLET_ID', 'Cookies and Caramel Waffles', 'Desserts', 199, NULL);

-- FRESH JUICE
INSERT INTO menu_items (outlet_id, name, category, price, photo_url)
VALUES 
  ('YOUR_OUTLET_ID', 'Watermelon Juice', 'Beverages', 79, NULL),
  ('YOUR_OUTLET_ID', 'Mixed Fruit Juice', 'Beverages', 89, NULL),
  ('YOUR_OUTLET_ID', 'Watermelon Beetroot Fusion Juice', 'Beverages', 99, NULL),
  ('YOUR_OUTLET_ID', 'Orange Juice (Seasonal)', 'Beverages', 129, NULL),
  ('YOUR_OUTLET_ID', 'ABC Red Nutritional Juice', 'Beverages', 129, NULL),
  ('YOUR_OUTLET_ID', 'The Vitamin C Juice', 'Beverages', 129, NULL);
