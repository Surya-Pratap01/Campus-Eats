const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// SnapEats Menu - 141 items
const snapEatsMenu = [
  // HOT BEVERAGES
  { name: 'Cappuccino', category: 'Hot Beverages', price: 49 },
  { name: 'Hot Coffee', category: 'Hot Beverages', price: 49 },
  { name: 'Hot Chocolate', category: 'Hot Beverages', price: 59 },
  
  // CHAI NAGRI
  { name: 'Adrak Chai (Cup / Kulhar)', category: 'Chai Nagri', price: 10 },
  { name: 'Masala Chai (Cup / Kulhar)', category: 'Chai Nagri', price: 10 },
  
  // SANDWICHES
  { name: 'Veg Sandwich', category: 'Sandwiches', price: 69 },
  { name: 'Cheese Sandwich', category: 'Sandwiches', price: 99 },
  { name: 'Paneer Tikka Sandwich', category: 'Sandwiches', price: 99 },
  { name: 'Chicken Tikka Sandwich', category: 'Sandwiches', price: 129 },
  { name: 'Seekh Kebab Sandwich', category: 'Sandwiches', price: 129 },
  
  // BURGERS
  { name: 'Veg Burger', category: 'Burgers', price: 59 },
  { name: 'Cheese Burger', category: 'Burgers', price: 69 },
  { name: 'Peppy Paneer Burger', category: 'Burgers', price: 109 },
  { name: 'Egg & Mayo Burger', category: 'Burgers', price: 99 },
  { name: 'Chicken Burger', category: 'Burgers', price: 129 },
  
  // DIL SE TANDOORI
  { name: 'Malai Paneer Tikka (8 Pcs)', category: 'Dil Se Tandoori', price: 249 },
  { name: 'Malai Soya Chap (8 Pcs)', category: 'Dil Se Tandoori', price: 199 },
  { name: 'Tandoori Mushroom (8 Pcs)', category: 'Dil Se Tandoori', price: 199 },
  { name: 'Chicken Tikka (8 Pcs)', category: 'Dil Se Tandoori', price: 299 },
  { name: 'Seekh Kebab-Chicken (8 Pcs)', category: 'Dil Se Tandoori', price: 299 },
  { name: 'Seekh Kebab-Mutton (8 Pcs)', category: 'Dil Se Tandoori', price: 349 },
  { name: 'Tandoori Chicken Half (4 Pcs)', category: 'Dil Se Tandoori', price: 199 },
  { name: 'Tandoori Chicken Full (8 Pcs)', category: 'Dil Se Tandoori', price: 349 },
  { name: 'Lachha Parantha (1 Pc)', category: 'Dil Se Tandoori', price: 59 },
  { name: 'Garlic Naan', category: 'Dil Se Tandoori', price: 59 },
  { name: 'Butter Naan', category: 'Dil Se Tandoori', price: 59 },
  { name: 'Chicken Keema Naan', category: 'Dil Se Tandoori', price: 139 },
  { name: 'Mutton Keema Naan', category: 'Dil Se Tandoori', price: 199 },
  { name: 'Chicken Tangi (4 Pcs)', category: 'Dil Se Tandoori', price: 249 },
  
  // CRISPY SNACKS
  { name: 'Classic Salted Fries', category: 'Crispy Snacks', price: 80 },
  { name: 'Peri Peri Fries', category: 'Crispy Snacks', price: 99 },
  { name: 'Potato Wedges', category: 'Crispy Snacks', price: 99 },
  { name: 'Sweet Corn', category: 'Crispy Snacks', price: 99 },
  { name: 'Crispy Corn', category: 'Crispy Snacks', price: 129 },
  { name: 'Crispy Chicken', category: 'Crispy Snacks', price: 159 },
  { name: 'Macaroni - Veg', category: 'Crispy Snacks', price: 99 },
  { name: 'Macaroni - Chicken', category: 'Crispy Snacks', price: 199 },
  { name: 'Pasta - Veg', category: 'Crispy Snacks', price: 99 },
  { name: 'Pasta - Chicken', category: 'Crispy Snacks', price: 199 },
  { name: 'Honey Chilly Potato', category: 'Crispy Snacks', price: 129 },
  { name: 'Veg Manchurian Dry', category: 'Crispy Snacks', price: 129 },
  { name: 'Chicken Manchurian Dry', category: 'Crispy Snacks', price: 249 },
  { name: 'Chilly Paneer Dry', category: 'Crispy Snacks', price: 159 },
  { name: 'Chilly Chicken Dry', category: 'Crispy Snacks', price: 249 },
  { name: 'Mushroom Chilly Dry', category: 'Crispy Snacks', price: 249 },
  
  // SOUPS (WINTER EDITION)
  { name: 'Tomato Soup', category: 'Soups', price: 79 },
  { name: 'Vegetable Soup', category: 'Soups', price: 79 },
  { name: 'Manchow Soup', category: 'Soups', price: 99 },
  { name: 'Chicken Soup', category: 'Soups', price: 119 },
  { name: 'Canned Beverages', category: 'Beverages', price: 0 }, // MRP
  { name: 'Bottled Water', category: 'Beverages', price: 0 }, // MRP
  
  // DIMSUMS & CIGAR SPRING ROLLS
  { name: 'Veg Momos (8 Pcs) - Steamed / Fried', category: 'Dimsums', price: 99 },
  { name: 'Paneer Momos (8 Pcs) - Steamed / Fried', category: 'Dimsums', price: 119 },
  { name: 'Chicken Momos (8 Pcs) - Steamed / Fried', category: 'Dimsums', price: 129 },
  { name: 'Veg Cigar Rolls', category: 'Dimsums', price: 119 },
  { name: 'Chicken Cigar Rolls', category: 'Dimsums', price: 139 },
  
  // STREET FLAVOURS
  { name: 'Pao Bhaji', category: 'Street Flavours', price: 70 },
  { name: 'Chole Bhature', category: 'Street Flavours', price: 89 },
  { name: 'Paneer Bread Pakora', category: 'Street Flavours', price: 49 },
  { name: 'Classic Bread Omelette', category: 'Street Flavours', price: 79 },
  { name: 'Cheese Bread Omelette', category: 'Street Flavours', price: 99 },
  { name: 'Chicken Bread Omelette', category: 'Street Flavours', price: 129 },
  { name: 'Vada Pao', category: 'Street Flavours', price: 49 },
  { name: 'Boiled Chicken', category: 'Street Flavours', price: 199 },
  { name: 'Chicken Salad', category: 'Street Flavours', price: 249 },
  
  // COLD BEVERAGES
  { name: 'Cold Coffee', category: 'Cold Beverages', price: 85 },
  { name: 'Iced Americano', category: 'Cold Beverages', price: 85 },
  { name: 'Iced Cappuccino', category: 'Cold Beverages', price: 85 },
  { name: 'Coffee Frappe', category: 'Cold Beverages', price: 85 },
  { name: 'Mocha Frappe', category: 'Cold Beverages', price: 85 },
  { name: 'Hazel Frappe', category: 'Cold Beverages', price: 85 },
  { name: 'Oreo Frappe', category: 'Cold Beverages', price: 85 },
  { name: 'Fresh Lime Soda', category: 'Cold Beverages', price: 85 },
  { name: 'Green Apple Soda', category: 'Cold Beverages', price: 85 },
  { name: 'Green Iced Tea', category: 'Cold Beverages', price: 85 },
  { name: 'Masala Lemonade', category: 'Cold Beverages', price: 85 },
  { name: 'Mint Mojito', category: 'Cold Beverages', price: 85 },
  { name: 'Blue Lagoon', category: 'Cold Beverages', price: 85 },
  { name: 'Imli Banta', category: 'Cold Beverages', price: 85 },
  { name: 'Kala Khatta', category: 'Cold Beverages', price: 85 },
  { name: 'Guava Chilli', category: 'Cold Beverages', price: 85 },
  { name: 'Pineapple Shake', category: 'Cold Beverages', price: 85 },
  { name: 'Strawberry Shake', category: 'Cold Beverages', price: 85 },
  { name: 'Choco Shake', category: 'Cold Beverages', price: 85 },
  { name: 'Rich Mango Shake', category: 'Cold Beverages', price: 85 },
  { name: 'O-O-Oreo Shake', category: 'Cold Beverages', price: 85 },
  { name: 'Butter Scotch Shake', category: 'Cold Beverages', price: 85 },
  { name: 'Kitkat Shake', category: 'Cold Beverages', price: 85 },
  { name: 'Chocolate Almond Shake', category: 'Cold Beverages', price: 85 },
  { name: 'Brownie Blast Shake', category: 'Cold Beverages', price: 85 },
  
  // VEG KATHI ROLLS
  { name: 'Veg Kathi Roll', category: 'Veg Kathi Rolls', price: 99 },
  { name: 'Paneer Kathi Roll', category: 'Veg Kathi Rolls', price: 119 },
  { name: 'Paneer Makhani Roll', category: 'Veg Kathi Rolls', price: 139 },
  { name: 'Paneer Schezwan Roll', category: 'Veg Kathi Rolls', price: 129 },
  { name: 'Paneer Shawarma Roll', category: 'Veg Kathi Rolls', price: 99 },
  { name: 'Noodle Roll', category: 'Veg Kathi Rolls', price: 89 },
  { name: 'Soya Chap Roll', category: 'Veg Kathi Rolls', price: 89 },
  { name: 'Creamy Soya Roll', category: 'Veg Kathi Rolls', price: 99 },
  
  // CONTINENTAL
  { name: 'White Pasta', category: 'Continental', price: 99 },
  { name: 'Red Pasta', category: 'Continental', price: 99 },
  { name: 'Mix Pasta', category: 'Continental', price: 99 },
  { name: 'Cheese Pasta', category: 'Continental', price: 139 },
  { name: 'Chicken Pasta', category: 'Continental', price: 149 },
  
  // NON VEG KATHI ROLLS
  { name: 'Egg Roll', category: 'Non Veg Kathi Rolls', price: 89 },
  { name: 'Chicken Tikka Roll', category: 'Non Veg Kathi Rolls', price: 149 },
  { name: 'Chicken Achari Roll', category: 'Non Veg Kathi Rolls', price: 129 },
  { name: 'Chicken Egg Roll', category: 'Non Veg Kathi Rolls', price: 169 },
  { name: 'Chicken Shawarma Roll', category: 'Non Veg Kathi Rolls', price: 159 },
  { name: 'Chicken Kebab Roll', category: 'Non Veg Kathi Rolls', price: 129 },
  { name: 'Mutton Kebab Roll', category: 'Non Veg Kathi Rolls', price: 189 },
  { name: 'Noodle Egg Roll', category: 'Non Veg Kathi Rolls', price: 109 },
  
  // CLASSIC INDIAN COMBOS
  { name: 'Aloo Pyaz Parantha with Curd & Pickle', category: 'Classic Indian Combos', price: 90 },
  { name: 'Paneer Parantha with Curd & Pickle', category: 'Classic Indian Combos', price: 99 },
  { name: 'Egg Parantha with Curd & Pickle', category: 'Classic Indian Combos', price: 119 },
  { name: 'Chicken Keema Parantha with Curd & Pickle', category: 'Classic Indian Combos', price: 139 },
  { name: 'Veg Combo with Rice - Rajma / Chole / Kadhi / Soya Chap', category: 'Classic Indian Combos', price: 89 },
  { name: 'Rice & Egg Curry Combo', category: 'Classic Indian Combos', price: 149 },
  { name: 'Rice & Paneer Combo', category: 'Classic Indian Combos', price: 149 },
  { name: 'Chicken Curry (2 Pcs) with Rice / Parantha / Naan', category: 'Classic Indian Combos', price: 199 },
  { name: 'Mutton Curry (2 Pcs) with Rice / Parantha / Naan', category: 'Classic Indian Combos', price: 259 },
  { name: 'Chicken Biryani with Sallan (Serves 2)', category: 'Classic Indian Combos', price: 299 },
  { name: 'Premium Thali - Veg', category: 'Classic Indian Combos', price: 199 },
  { name: 'Premium Thali - Non Veg', category: 'Classic Indian Combos', price: 299 },
  { name: 'Hakka Noodles + Chilly Paneer Gravy', category: 'Classic Indian Combos', price: 249 },
  { name: 'Hakka Noodles + Veg Manchurian Gravy', category: 'Classic Indian Combos', price: 249 },
  { name: 'Hakka Noodles + Chilly Chicken Gravy', category: 'Classic Indian Combos', price: 299 },
  { name: 'Hakka Noodles + Chicken Manchurian Gravy', category: 'Classic Indian Combos', price: 299 },
  { name: 'Fried Rice + Chilly Paneer Gravy', category: 'Classic Indian Combos', price: 249 },
  { name: 'Fried Rice + Veg Manchurian Gravy', category: 'Classic Indian Combos', price: 249 },
  { name: 'Fried Rice + Chilly Chicken Gravy', category: 'Classic Indian Combos', price: 299 },
  { name: 'Fried Rice + Chicken Manchurian Gravy', category: 'Classic Indian Combos', price: 299 },
  { name: 'Fried Rice - Veg', category: 'Classic Indian Combos', price: 149 },
  { name: 'Fried Rice - Chicken', category: 'Classic Indian Combos', price: 249 },
  { name: 'Hakka Noodles - Veg', category: 'Classic Indian Combos', price: 149 },
  { name: 'Hakka Noodles - Chicken', category: 'Classic Indian Combos', price: 249 },
  { name: 'Schezwan Fried Rice + Hot Garlic Paneer', category: 'Classic Indian Combos', price: 249 },
  { name: 'Schezwan Fried Rice + Chilly Chicken Gravy', category: 'Classic Indian Combos', price: 299 },
  { name: 'Schezwan Fried Rice + Chicken Manchurian', category: 'Classic Indian Combos', price: 299 },
  { name: 'Chicken Lollipop (4)', category: 'Classic Indian Combos', price: 299 },
  { name: 'Chinese Platter - Veg', category: 'Classic Indian Combos', price: 249 },
  { name: 'Chinese Platter - Non Veg', category: 'Classic Indian Combos', price: 349 }
]

// House of Chow Menu - 127 items
const houseOfChowMenu = [
  // RICE
  { name: 'Veg Fried Rice (Half / Full)', category: 'Rice', price: 105 },
  { name: 'Chicken Fried Rice (Half / Full)', category: 'Rice', price: 147 },
  { name: 'Paneer Fried Rice (Half / Full)', category: 'Rice', price: 150 },
  { name: 'Egg Fried Rice (Half / Full)', category: 'Rice', price: 120 },
  { name: 'Chilli Garlic Fried Rice (Half / Full)', category: 'Rice', price: 120 },
  
  // VEG APPETIZERS
  { name: 'Crispy Chilli Potato (Half / Full)', category: 'Veg Appetizers', price: 95 },
  { name: 'Veg Spring Roll', category: 'Veg Appetizers', price: 110 },
  { name: 'Chilli Paneer (Half / Full)', category: 'Veg Appetizers', price: 125 },
  { name: 'Bhel Puri (Half / Full)', category: 'Veg Appetizers', price: 55 },
  { name: 'Crispy Corn (Half / Full)', category: 'Veg Appetizers', price: 105 },
  { name: 'Veg Salt And Pepper (Half / Full)', category: 'Veg Appetizers', price: 155 },
  { name: 'Salted Fries (Half / Full)', category: 'Veg Appetizers', price: 80 },
  { name: 'Peri Peri Fries (Half / Full)', category: 'Veg Appetizers', price: 90 },
  { name: 'Cheese Fries (Half / Full)', category: 'Veg Appetizers', price: 100 },
  { name: 'Tandoori Fries (Half / Full)', category: 'Veg Appetizers', price: 100 },
  { name: 'Cheese Baked Fries', category: 'Veg Appetizers', price: 167 },
  
  // NOODLES
  { name: 'Chilli Garlic Noodle (Half / Full)', category: 'Noodles', price: 95 },
  { name: 'Chilli Garlic Chicken Noodles (Half / Full)', category: 'Noodles', price: 125 },
  { name: 'Veg Hakka Noodles (Half / Full)', category: 'Noodles', price: 90 },
  { name: 'Chicken Hakka Noodles (Half / Full)', category: 'Noodles', price: 155 },
  { name: 'Veg Chowmein (Half / Full)', category: 'Noodles', price: 90 },
  { name: 'Chicken Chowmein (Half / Full)', category: 'Noodles', price: 155 },
  { name: 'Veg Singapore Noodles (Half / Full)', category: 'Noodles', price: 95 },
  { name: 'Chicken Singapore Noodles (Half / Full)', category: 'Noodles', price: 185 },
  { name: 'Veg Chopsey', category: 'Noodles', price: 245 },
  { name: 'Chicken Chopsey', category: 'Noodles', price: 305 },
  
  // MOMOS (8 PCS)
  { name: 'Veg Kurkure Momos', category: 'Momos', price: 130 },
  { name: 'Chicken Steam Momos', category: 'Momos', price: 125 },
  { name: 'Chicken Kurkure Momos', category: 'Momos', price: 167 },
  
  // PICK A MEAL
  { name: 'Chow Box (Veg / Paneer / Chicken)', category: 'Pick A Meal', price: 205 },
  { name: 'Bento Box (Veg / Paneer / Chicken)', category: 'Pick A Meal', price: 305 },
  
  // CHINESE BURGERS
  { name: 'Chilli Paneer Burger', category: 'Chinese Burgers', price: 90 },
  { name: 'Chinese Veg Burger', category: 'Chinese Burgers', price: 75 },
  { name: 'Chilli Garlic Veg Burger', category: 'Chinese Burgers', price: 80 },
  { name: 'Chilli Chicken Burger', category: 'Chinese Burgers', price: 99 },
  
  // WRAPS
  { name: 'Veggie Wrap', category: 'Wraps', price: 75 },
  { name: 'Salad Wrap', category: 'Wraps', price: 67 },
  { name: 'Paneer Wrap', category: 'Wraps', price: 95 },
  { name: 'Chilli Paneer Wrap', category: 'Wraps', price: 125 },
  { name: 'Chicken Kebab Wrap', category: 'Wraps', price: 125 },
  { name: 'Chilli Chicken Wrap', category: 'Wraps', price: 147 },
  
  // CHAI PE CHARCHA
  { name: 'Adrah Chai (₹10 / ₹15 / ₹20)', category: 'Chai Pe Charcha', price: 10 },
  { name: 'Kadak Elaichi (₹15 / ₹20 / ₹25)', category: 'Chai Pe Charcha', price: 15 },
  { name: 'Aloo Patties', category: 'Chai Pe Charcha', price: 30 },
  { name: 'Paneer Patties', category: 'Chai Pe Charcha', price: 35 },
  
  // CHINESE SANDWICHES
  { name: 'Veg Sandwich', category: 'Chinese Sandwiches', price: 80 },
  { name: 'Veg Chilli Garlic Sandwich', category: 'Chinese Sandwiches', price: 89 },
  { name: 'Chilli Paneer Sandwich', category: 'Chinese Sandwiches', price: 145 },
  { name: 'Schezwan/Chilli Garlic Paneer', category: 'Chinese Sandwiches', price: 167 },
  { name: 'Chilli Chicken Sandwich', category: 'Chinese Sandwiches', price: 157 },
  { name: 'Schezwan/Chilli Garlic Chicken', category: 'Chinese Sandwiches', price: 175 },
  
  // VEG
  { name: 'Black Pepper Veg (Half / Full)', category: 'Veg', price: 110 },
  { name: 'Chilli Soya Veg (Half / Full)', category: 'Veg', price: 110 },
  { name: 'Hot Garlic Veg (Half / Full)', category: 'Veg', price: 110 },
  { name: 'Kung Pao Veg (Half / Full)', category: 'Veg', price: 110 },
  { name: 'Manchurian Veg (Half / Full)', category: 'Veg', price: 110 },
  { name: 'Thai Green Curry Veg (Half / Full)', category: 'Veg', price: 110 },
  { name: 'Thai Red Curry Veg (Half / Full)', category: 'Veg', price: 110 },
  { name: 'Szechuan Veg (Half / Full)', category: 'Veg', price: 110 },
  
  // PANEER
  { name: 'Black Pepper Paneer (Half / Full)', category: 'Paneer', price: 165 },
  { name: 'Chilli Soya Paneer (Half / Full)', category: 'Paneer', price: 165 },
  { name: 'Hot Garlic Paneer (Half / Full)', category: 'Paneer', price: 165 },
  { name: 'Kung Pao Paneer (Half / Full)', category: 'Paneer', price: 165 },
  { name: 'Manchurian Paneer (Half / Full)', category: 'Paneer', price: 165 },
  { name: 'Thai Green Curry Paneer (Half / Full)', category: 'Paneer', price: 165 },
  { name: 'Thai Red Curry Paneer (Half / Full)', category: 'Paneer', price: 165 },
  { name: 'Szechuan Paneer (Half / Full)', category: 'Paneer', price: 165 },
  
  // NON VEG
  { name: 'Black Pepper Chicken (Half / Full)', category: 'Non Veg', price: 165 },
  { name: 'Chilli Soya Chicken (Half / Full)', category: 'Non Veg', price: 165 },
  { name: 'Hot Garlic Chicken (Half / Full)', category: 'Non Veg', price: 165 },
  { name: 'Kung Pao Chicken (Half / Full)', category: 'Non Veg', price: 165 },
  { name: 'Manchurian Chicken (Half / Full)', category: 'Non Veg', price: 175 },
  { name: 'Thai Green Curry Chicken (Half / Full)', category: 'Non Veg', price: 157 },
  { name: 'Thai Red Curry Chicken (Half / Full)', category: 'Non Veg', price: 175 },
  { name: 'Szechuan Chicken (Half / Full)', category: 'Non Veg', price: 175 },
  
  // NON VEG APPETIZERS
  { name: 'Chicken Drumsticks (Half / Full)', category: 'Non Veg Appetizers', price: 145 },
  { name: 'Chicken Spring Roll (Half / Full)', category: 'Non Veg Appetizers', price: 145 },
  { name: 'Chilli Chicken (Half / Full)', category: 'Non Veg Appetizers', price: 165 },
  
  // SOUPS
  { name: 'Vegetable Soup', category: 'Soups', price: 105 },
  { name: 'Chicken Soup', category: 'Soups', price: 125 },
  { name: 'Veg Manchow Soup', category: 'Soups', price: 115 },
  { name: 'Chicken Manchow Soup', category: 'Soups', price: 135 },
  
  // ICE CREAM SHAKES (300 ml)
  { name: 'Vanilla Shake', category: 'Ice Cream Shakes', price: 85 },
  { name: 'Chocolate Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Strawberry Shake', category: 'Ice Cream Shakes', price: 85 },
  { name: 'Butter Scotch Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Black Currant Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Kitkat Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Chocochips Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Mocha Brownie Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'American Nuts Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Cookie Cream Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Swiss Cake Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Alphonso Mango Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Lotus Biscoff Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Hot Chocolate Fudge Shake', category: 'Ice Cream Shakes', price: 115 },
  { name: 'Brownie Sundae Shake', category: 'Ice Cream Shakes', price: 115 },
  
  // ICE CREAM SCOOPS
  { name: 'Vanilla Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 55 },
  { name: 'Chocolate Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'Strawberry Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 55 },
  { name: 'Butter Scotch Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'Chocochips Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'Mocha Brownie Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'American Nuts Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'Black Currant Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'Cookie Cream Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'Swiss Cake Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'Alphonso Mango Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'Lotus Biscoff Scoop (Single / Double)', category: 'Ice Cream Scoops', price: 75 },
  { name: 'Hot Chocolate Fudge', category: 'Ice Cream Scoops', price: 135 },
  { name: 'Brownie Sundae', category: 'Ice Cream Scoops', price: 160 },
  
  // COOLERS (300 ml)
  { name: 'Ice Tea (Lemon / Peach)', category: 'Coolers', price: 55 },
  { name: 'Strawberry / Watermelon', category: 'Coolers', price: 65 },
  { name: 'Blue Lagoon', category: 'Coolers', price: 70 },
  { name: 'Fruit Beer', category: 'Coolers', price: 80 },
  { name: 'Fresh Lime Soda', category: 'Coolers', price: 75 },
  { name: 'Cold Coffee', category: 'Coolers', price: 85 },
  { name: 'Hazelnut Cold Coffee', category: 'Coolers', price: 95 },
  { name: 'Caramel Cold Coffee', category: 'Coolers', price: 95 },
  
  // MOJITOS
  { name: 'Classic Mint Mojito', category: 'Mojitos', price: 85 },
  { name: 'Kiwi Mojito', category: 'Mojitos', price: 85 },
  { name: 'Spicy Mango Mojito', category: 'Mojitos', price: 85 },
  { name: 'Peach Mojito', category: 'Mojitos', price: 85 },
  { name: 'Green Apple Mojito', category: 'Mojitos', price: 85 },
  { name: 'Strawberry Mojito', category: 'Mojitos', price: 85 },
  { name: 'Black Currant Mojito', category: 'Mojitos', price: 85 },
  { name: 'Passion Fruit Mojito', category: 'Mojitos', price: 85 },
  { name: 'Blueberry Mojito', category: 'Mojitos', price: 85 },
  { name: 'Watermelon Mojito', category: 'Mojitos', price: 85 }
]

async function populateOutlet(outletName, location, description, menuItems) {
  try {
    console.log(`\n=== Populating ${outletName} ===`)
    
    // Get or create outlet
    let { data: outlet, error: outletError } = await supabase
      .from('outlets')
      .select('*')
      .eq('name', outletName)
      .single()
    
    if (outletError || !outlet) {
      console.log(`Creating ${outletName} outlet...`)
      const { data: newOutlet, error: createError } = await supabase
        .from('outlets')
        .insert({
          name: outletName,
          description: description,
          location: location,
          photo_url: null
        })
        .select()
        .single()
      
      if (createError) {
        console.error(`Error creating outlet:`, createError)
        return
      }
      outlet = newOutlet
    }
    
    console.log(`${outletName} outlet ID: ${outlet.id}`)
    
    // Get existing menu items
    const { data: existingItems, error: existingError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('outlet_id', outlet.id)
    
    if (existingError) {
      console.error('Error fetching existing items:', existingError)
      return
    }
    
    console.log(`Found ${existingItems?.length || 0} existing menu items`)
    
    // Create map of existing items
    const existingMap = new Map()
    existingItems?.forEach(item => {
      existingMap.set(item.name, item)
    })
    
    // Track statistics
    let updated = 0
    let added = 0
    let skipped = 0
    
    // Process menu items
    for (const menuItem of menuItems) {
      const existing = existingMap.get(menuItem.name)
      
      if (existing) {
        // Update existing item
        const { error: updateError } = await supabase
          .from('menu_items')
          .update({
            category: menuItem.category,
            price: menuItem.price
          })
          .eq('id', existing.id)
        
        if (updateError) {
          console.error(`Error updating ${menuItem.name}:`, updateError)
        } else {
          console.log(`✓ Updated: ${menuItem.name}`)
          updated++
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('menu_items')
          .insert({
            outlet_id: outlet.id,
            name: menuItem.name,
            category: menuItem.category,
            price: menuItem.price,
            photo_url: null
          })
        
        if (insertError) {
          console.error(`Error inserting ${menuItem.name}:`, insertError)
        } else {
          console.log(`+ Added: ${menuItem.name}`)
          added++
        }
      }
    }
    
    // Remove outdated items
    const verifiedNames = new Set(menuItems.map(item => item.name))
    for (const existing of existingItems || []) {
      if (!verifiedNames.has(existing.name)) {
        console.log(`- Removing outdated: ${existing.name}`)
        const { error: deleteError } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', existing.id)
        
        if (deleteError) {
          console.error(`Error deleting ${existing.name}:`, deleteError)
        }
      }
    }
    
    // Verify final count
    const { data: finalItems, error: finalError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('outlet_id', outlet.id)
    
    if (finalError) {
      console.error('Error verifying final count:', finalError)
    } else {
      console.log(`\n=== ${outletName} SUMMARY ===`)
      console.log(`Updated: ${updated}`)
      console.log(`Added: ${added}`)
      console.log(`Total items: ${finalItems?.length || 0}`)
      console.log(`Expected: ${menuItems.length}`)
      
      if (finalItems?.length === menuItems.length) {
        console.log('✓ Menu population successful!')
      } else {
        console.log('⚠ Menu count mismatch')
      }
    }
    
  } catch (error) {
    console.error(`Unexpected error for ${outletName}:`, error)
  }
}

async function populateAllOutlets() {
  console.log('Starting outlet population...')
  
  // Populate SnapEats
  await populateOutlet(
    'SnapEats',
    'Left side of LRC',
    'A go-to joint for students seeking quick bites, snacks, and late-night meals outside regular mess hours.',
    snapEatsMenu
  )
  
  // Populate House of Chow
  await populateOutlet(
    'House of Chow',
    'Left side of LRC',
    'Serving a wide variety of popular Indo-Chinese and Asian fast-food options to students and faculty.',
    houseOfChowMenu
  )
  
  console.log('\n=== ALL OUTLETS POPULATED ===')
}

populateAllOutlets()
