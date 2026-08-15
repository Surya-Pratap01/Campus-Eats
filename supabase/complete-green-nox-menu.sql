-- Complete Green Nox Menu Population
-- This script will populate Green Nox with the complete verified menu of 74 items

-- First, get the Green Nox outlet ID
DO $$
DECLARE
  green_nox_id UUID;
BEGIN
  SELECT id INTO green_nox_id FROM outlets WHERE name = 'Green Nox' LIMIT 1;
  
  IF green_nox_id IS NULL THEN
    -- Create Green Nox outlet if it doesn't exist
    INSERT INTO outlets (name, description, location, photo_url)
    VALUES (
      'Green Nox',
      'Healthy, fresh, and balanced food made for everyday wellness.',
      'P-Block, Bennett University',
      NULL
    )
    RETURNING id INTO green_nox_id;
  END IF;
  
  -- Delete existing menu items for Green Nox to avoid duplicates
  -- Note: This will remove existing ratings - if preserving ratings is critical, we need a different approach
  DELETE FROM menu_items WHERE outlet_id = green_nox_id;
  
  -- Insert complete verified menu
  
  -- QUICK BITES — 5
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Classic French Fries', 'Quick Bites', 89, NULL),
    (green_nox_id, 'Peri Peri French Fries', 'Quick Bites', 99, NULL),
    (green_nox_id, 'Korean French Fries', 'Quick Bites', 99, NULL),
    (green_nox_id, 'Loaded French Fries', 'Quick Bites', 139, NULL),
    (green_nox_id, 'Loaded Nachos', 'Quick Bites', 129, NULL);
  
  -- TACOS — 3
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Mexican Veg Taco (2pc)', 'Tacos', 129, NULL),
    (green_nox_id, 'Cottage Cheese Taco (2pc)', 'Tacos', 139, NULL),
    (green_nox_id, 'Mexican Chicken Taco (2pc)', 'Tacos', 169, NULL);
  
  -- WAFFLES (2pcs) — 4
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Double Chocolate Waffles', 'Waffles', 149, NULL),
    (green_nox_id, 'Brownie Waffles', 'Waffles', 179, NULL),
    (green_nox_id, 'Mixed Berry Waffles', 'Waffles', 189, NULL),
    (green_nox_id, 'Cookies and Caramel Waffles', 'Waffles', 199, NULL);
  
  -- FRESH JUICE — 6
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Watermelon Juice', 'Fresh Juice', 79, NULL),
    (green_nox_id, 'Mixed Fruit Juice', 'Fresh Juice', 89, NULL),
    (green_nox_id, 'Watermelon Beetroot Fusion Juice', 'Fresh Juice', 99, NULL),
    (green_nox_id, 'Orange Juice (Seasonal)', 'Fresh Juice', 129, NULL),
    (green_nox_id, 'ABC Red Nutritional Juice', 'Fresh Juice', 129, NULL),
    (green_nox_id, 'The Vitamin C Juice', 'Fresh Juice', 129, NULL);
  
  -- WRAPS — 5
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Assorted Grilled Veggies Wrap', 'Wraps', 129, NULL),
    (green_nox_id, 'Paneer Tikka Wrap', 'Wraps', 149, NULL),
    (green_nox_id, 'Hummus Falafel Wrap', 'Wraps', 179, NULL),
    (green_nox_id, 'Grilled Chicken Wrap', 'Wraps', 179, NULL),
    (green_nox_id, 'Tandoori Chicken Wrap', 'Wraps', 179, NULL);
  
  -- SUB — 8
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Green Farm Sub', 'Sub', 109, NULL),
    (green_nox_id, 'Delight Veggies Sub', 'Sub', 149, NULL),
    (green_nox_id, 'Cheesy Tikka Sub', 'Sub', 179, NULL),
    (green_nox_id, 'Hummus Falafel Sub', 'Sub', 179, NULL),
    (green_nox_id, 'Paneer Tikka Sub', 'Sub', 179, NULL),
    (green_nox_id, 'Pesto Chicken Sub', 'Sub', 199, NULL),
    (green_nox_id, 'Tandoori Chicken Sub', 'Sub', 199, NULL),
    (green_nox_id, 'Grilled Chicken Sub', 'Sub', 199, NULL);
  
  -- SANDWICH (2pc / 4pc) — 6
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Classic Sandwich (2pc / 4pc)', 'Sandwich', 79, NULL),
    (green_nox_id, 'Corn & Cheese Sandwich (2pc / 4pc)', 'Sandwich', 79, NULL),
    (green_nox_id, 'Cheese Aloo Patty Sandwich (2pc / 4pc)', 'Sandwich', 99, NULL),
    (green_nox_id, 'Pesto Grilled Veggies Sandwich (2pc / 4pc)', 'Sandwich', 109, NULL),
    (green_nox_id, 'Paneer Tikka Sandwich (2pc / 4pc)', 'Sandwich', 109, NULL),
    (green_nox_id, 'Grilled Chicken BBQ Sandwich (2pc / 4pc)', 'Sandwich', 129, NULL);
  
  -- WHOLESOME MEAL — 5
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Paneer Steak with Mashed Potato', 'Wholesome Meal', 199, NULL),
    (green_nox_id, 'High Protein Chicken Bowl (200g)', 'Wholesome Meal', 199, NULL),
    (green_nox_id, 'Grilled Chicken With Mashed Potato', 'Wholesome Meal', 219, NULL),
    (green_nox_id, 'Caribbean Chicken Fillets', 'Wholesome Meal', 229, NULL),
    (green_nox_id, 'Artisanal Fish Fillet & Lemon Butter Sauce / Garlic Ranch', 'Wholesome Meal', 269, NULL);
  
  -- BURRITO BOWLS/WRAPS — 3
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Mexican Avocado Burrito Bowl', 'Burrito Bowls', 229, NULL),
    (green_nox_id, 'Cottage Cheese Burrito Bowl', 'Burrito Bowls', 239, NULL),
    (green_nox_id, 'Mexican Chicken Avocado Burrito Bowl', 'Burrito Bowls', 249, NULL);
  
  -- RICE — 4
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Soya Paneer Rice Bowl', 'Rice', 179, NULL),
    (green_nox_id, 'Paneer Steak Rice Bowl', 'Rice', 199, NULL),
    (green_nox_id, 'Grilled Chicken Rice Bowl', 'Rice', 229, NULL),
    (green_nox_id, 'Chicken Steak Rice Bowl', 'Rice', 249, NULL);
  
  -- BURGER (Whole Wheat Goodness) — 4
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Korean Veg Burger', 'Burger', 89, NULL),
    (green_nox_id, 'Cheese Veg Burger', 'Burger', 89, NULL),
    (green_nox_id, 'Paneer Mania Burger', 'Burger', 99, NULL),
    (green_nox_id, 'Grilled Chicken Burger', 'Burger', 129, NULL);
  
  -- PASTA (Durum Wheat) — 6 (3 items × Veg/Non-Veg)
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Alfredo Pasta — Veg', 'Pasta', 149, NULL),
    (green_nox_id, 'Alfredo Pasta — Non-Veg', 'Pasta', 179, NULL),
    (green_nox_id, 'Arrabbiata Pasta — Veg', 'Pasta', 149, NULL),
    (green_nox_id, 'Arrabbiata Pasta — Non-Veg', 'Pasta', 179, NULL),
    (green_nox_id, 'Mix Sauce Pasta — Veg', 'Pasta', 149, NULL),
    (green_nox_id, 'Mix Sauce Pasta — Non-Veg', 'Pasta', 179, NULL);
  
  -- SALADS — 13
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Classic Caesar Salad', 'Salads', 189, NULL),
    (green_nox_id, 'Extravaganza Veggies Salad', 'Salads', 199, NULL),
    (green_nox_id, 'Protein Packed Salad', 'Salads', 199, NULL),
    (green_nox_id, 'Basil Pesto Pasta Salad', 'Salads', 199, NULL),
    (green_nox_id, 'Hummus Falafel Salad', 'Salads', 209, NULL),
    (green_nox_id, 'Assorted Veggies & Quinoa Salad', 'Salads', 209, NULL),
    (green_nox_id, 'Cottage Cheese Salad', 'Salads', 209, NULL),
    (green_nox_id, 'Greek Salad With Avocado & Feta Cheese', 'Salads', 249, NULL),
    (green_nox_id, 'Chicken Caesar Salad', 'Salads', 229, NULL),
    (green_nox_id, 'Egg Green Salad', 'Salads', 249, NULL),
    (green_nox_id, 'Grilled Chicken & Quinoa Salad', 'Salads', 249, NULL),
    (green_nox_id, 'High Protein Chicken Salad', 'Salads', 249, NULL),
    (green_nox_id, 'Grilled Chicken & Avocado Salad', 'Salads', 269, NULL);
  
  -- FRUIT SALAD — 2
  INSERT INTO menu_items (outlet_id, name, category, price, photo_url) VALUES
    (green_nox_id, 'Rainbow Fruit Salad', 'Fruit Salad', 149, NULL),
    (green_nox_id, 'Delight Fruit Salad', 'Fruit Salad', 169, NULL);
  
  RAISE NOTICE 'Green Nox menu populated successfully with 74 items';
END $$;

-- Verify the insertion
SELECT COUNT(*) as total_items FROM menu_items WHERE outlet_id = (SELECT id FROM outlets WHERE name = 'Green Nox' LIMIT 1);
