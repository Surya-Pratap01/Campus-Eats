const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zcbmvhjkharfmmiqslls.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_N1mq3YVsrcG9mwtJYwE-1Q_WsuKHY2L'

const supabase = createClient(supabaseUrl, supabaseKey)

// 1. Recovered Green Nox outlet data from previous records
const greenNoxOutletData = {
  name: 'Green Nox',
  description: 'Healthy, fresh, and balanced food made for everyday wellness.',
  location: 'P-Block, Bennett University',
  photo_url: '/outlets/green-nox.jpg.png'
}

// 2. Recovered Snap Eats menu data from scripts/populate-new-outlets.js
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
  { name: 'Canned Beverages', category: 'Beverages', price: 0 },
  { name: 'Bottled Water', category: 'Beverages', price: 0 },
  
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

// 3. Recovered House of Chow menu data from scripts/populate-new-outlets.js
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

async function insertMenuItemsInBatches(outletId, items, batchSize = 25) {
  let inserted = 0
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize).map(item => ({
      outlet_id: outletId,
      name: item.name,
      category: item.category,
      price: item.price,
      photo_url: null
    }))

    const { error } = await supabase.from('menu_items').insert(chunk)
    if (error) {
      console.error(`Error inserting batch ${i} - ${i + chunk.length}:`, error)
      throw error
    }
    inserted += chunk.length
  }
  return inserted
}

async function restore() {
  console.log('=== RESTORING REQUESTED OUTLETS AND MENUS ===\n')

  // 1. RESTORE GREEN NOX
  console.log('1. Restoring Green Nox outlet record...')
  let { data: existingGreenNox } = await supabase
    .from('outlets')
    .select('*')
    .eq('name', 'Green Nox')
    .maybeSingle()

  let greenNoxId
  if (!existingGreenNox) {
    const { data: newGreenNox, error: gnErr } = await supabase
      .from('outlets')
      .insert(greenNoxOutletData)
      .select()
      .single()

    if (gnErr) {
      console.error('Error restoring Green Nox outlet:', gnErr)
    } else {
      greenNoxId = newGreenNox.id
      console.log(`✓ Restored Green Nox outlet record (ID: ${greenNoxId})`)
    }
  } else {
    greenNoxId = existingGreenNox.id
    console.log(`✓ Green Nox outlet record already present (ID: ${greenNoxId})`)
  }

  // 2. RESTORE SNAP EATS MENUS
  console.log('\n2. Restoring Snap Eats outlet and menu items...')
  let { data: snapEatsOutlet } = await supabase
    .from('outlets')
    .select('*')
    .ilike('name', '%snap%')
    .maybeSingle()

  if (!snapEatsOutlet) {
    console.log('Creating Snap Eats outlet...')
    const { data: newSnap, error: snapErr } = await supabase
      .from('outlets')
      .insert({
        name: 'Snap Eats',
        description: 'A go-to joint for students seeking quick bites, snacks, and late-night meals outside regular mess hours.',
        location: 'Left side of LRC',
        photo_url: null
      })
      .select()
      .single()
    if (snapErr) throw snapErr
    snapEatsOutlet = newSnap
  }

  // Clear any existing menu items for Snap Eats to avoid duplicates
  await supabase.from('menu_items').delete().eq('outlet_id', snapEatsOutlet.id)
  
  // Insert verified 141 items
  const snapCount = await insertMenuItemsInBatches(snapEatsOutlet.id, snapEatsMenu)
  console.log(`✓ Restored ${snapCount} menu items for Snap Eats`)

  // 3. RESTORE HOUSE OF CHOW MENUS
  console.log('\n3. Restoring House of Chow outlet and menu items...')
  let { data: hocOutlet } = await supabase
    .from('outlets')
    .select('*')
    .ilike('name', '%house of chow%')
    .maybeSingle()

  if (!hocOutlet) {
    console.log('Creating House of Chow outlet...')
    const { data: newHoc, error: hocErr } = await supabase
      .from('outlets')
      .insert({
        name: 'House of Chow',
        description: 'Serving a wide variety of popular Indo-Chinese and Asian fast-food options to students and faculty.',
        location: 'Left side of LRC',
        photo_url: '/outlets/house-of-chow.jpg.png'
      })
      .select()
      .single()
    if (hocErr) throw hocErr
    hocOutlet = newHoc
  }

  // Clear any existing menu items for House of Chow to avoid duplicates
  await supabase.from('menu_items').delete().eq('outlet_id', hocOutlet.id)
  
  // Insert verified 127 items
  const hocCount = await insertMenuItemsInBatches(hocOutlet.id, houseOfChowMenu)
  console.log(`✓ Restored ${hocCount} menu items for House of Chow`)

  // 4. VERIFY FINAL DATABASE STATE
  console.log('\n=== VERIFICATION ===')
  const { data: allOutlets } = await supabase
    .from('outlets')
    .select(`
      id,
      name,
      location,
      description,
      photo_url,
      menu_items (count)
    `)
    .order('name')

  console.log(`Total Outlets in DB: ${allOutlets?.length || 0}`)
  for (const o of allOutlets || []) {
    const itemCount = o.menu_items?.[0]?.count || 0
    console.log(`  - ${o.name}: ${itemCount} menu items (Location: ${o.location || 'N/A'}, Photo: ${o.photo_url || 'None'})`)
  }

  const hasChillWheel = allOutlets?.some(o => o.name.toLowerCase().includes('chill wheel'))
  console.log(`Chill Wheel present? ${hasChillWheel ? 'YES (ERROR)' : 'NO (CORRECT)'}`)
}

restore().catch(console.error)
