export interface ProductVariant {
  id: string;
  name: string;
  price: number;
}

export interface ShopSponsor {
  shopId: string;
  shopName: string;
  discountPercent: number;
  area: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  isVeg: boolean;
  category: string;
  unit?: string;
  variants?: ProductVariant[];
  sponsor?: ShopSponsor;
  inStock?: boolean;
}

// ==================== VEGETABLES ====================
const vegetables: Product[] = [
  {
    id: "veg-1",
    name: "Fresh Tomato",
    price: 40,
    image: "https://images.unsplash.com/photo-1546470427-227c7369a9b8?w=400&h=300&fit=crop",
    description: "Farm fresh red tomatoes, perfect for cooking",
    rating: 4.5,
    isVeg: true,
    category: "Vegetables",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "veg-2",
    name: "Onion",
    price: 35,
    image: "https://images.unsplash.com/photo-1618512496248-a07e4b6e5c6e?w=400&h=300&fit=crop",
    description: "Fresh onions for daily cooking",
    rating: 4.4,
    isVeg: true,
    category: "Vegetables",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "veg-3",
    name: "Potato",
    price: 30,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82ber3a2?w=400&h=300&fit=crop",
    description: "Fresh potatoes, great for curries and fries",
    rating: 4.6,
    isVeg: true,
    category: "Vegetables",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "veg-4",
    name: "Green Chilli",
    price: 60,
    image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop",
    description: "Spicy green chillies for that extra kick",
    rating: 4.3,
    isVeg: true,
    category: "Vegetables",
    unit: "250 gm",
    inStock: true
  },
  {
    id: "veg-5",
    name: "Cauliflower",
    price: 45,
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2ead1?w=400&h=300&fit=crop",
    description: "Fresh white cauliflower",
    rating: 4.4,
    isVeg: true,
    category: "Vegetables",
    unit: "1 pc",
    inStock: true
  },
  {
    id: "veg-6",
    name: "Cabbage",
    price: 35,
    image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop",
    description: "Fresh green cabbage",
    rating: 4.2,
    isVeg: true,
    category: "Vegetables",
    unit: "1 pc",
    inStock: true
  },
  {
    id: "veg-7",
    name: "Spinach (Palak)",
    price: 25,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
    description: "Fresh leafy spinach",
    rating: 4.5,
    isVeg: true,
    category: "Vegetables",
    unit: "1 bunch",
    inStock: true
  },
  {
    id: "veg-8",
    name: "Brinjal (Baingan)",
    price: 40,
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop",
    description: "Purple brinjal for bhartha and curry",
    rating: 4.3,
    isVeg: true,
    category: "Vegetables",
    unit: "500 gm",
    inStock: true
  },
  {
    id: "veg-9",
    name: "Lady Finger (Bhindi)",
    price: 50,
    image: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400&h=300&fit=crop",
    description: "Fresh okra for delicious bhindi masala",
    rating: 4.4,
    isVeg: true,
    category: "Vegetables",
    unit: "500 gm",
    inStock: true
  },
  {
    id: "veg-10",
    name: "Bottle Gourd (Lauki)",
    price: 35,
    image: "https://images.unsplash.com/photo-1622921491193-345c3b1f8691?w=400&h=300&fit=crop",
    description: "Fresh bottle gourd",
    rating: 4.2,
    isVeg: true,
    category: "Vegetables",
    unit: "1 pc",
    inStock: true
  }
];

// ==================== FRUITS ====================
const fruits: Product[] = [
  {
    id: "fruit-1",
    name: "Apple",
    price: 150,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
    description: "Fresh red apples, sweet and crunchy",
    rating: 4.7,
    isVeg: true,
    category: "Fruits",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "fruit-2",
    name: "Banana",
    price: 50,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
    description: "Ripe yellow bananas, rich in potassium",
    rating: 4.5,
    isVeg: true,
    category: "Fruits",
    unit: "1 dozen",
    inStock: true
  },
  {
    id: "fruit-3",
    name: "Orange",
    price: 80,
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop",
    description: "Juicy oranges, rich in vitamin C",
    rating: 4.6,
    isVeg: true,
    category: "Fruits",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "fruit-4",
    name: "Mango",
    price: 120,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop",
    description: "Sweet Alphonso mangoes",
    rating: 4.9,
    isVeg: true,
    category: "Fruits",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "fruit-5",
    name: "Papaya",
    price: 60,
    image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=300&fit=crop",
    description: "Fresh ripe papaya",
    rating: 4.4,
    isVeg: true,
    category: "Fruits",
    unit: "1 pc",
    inStock: true
  },
  {
    id: "fruit-6",
    name: "Watermelon",
    price: 45,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
    description: "Juicy watermelon, perfect for summer",
    rating: 4.6,
    isVeg: true,
    category: "Fruits",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "fruit-7",
    name: "Grapes",
    price: 90,
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop",
    description: "Sweet green seedless grapes",
    rating: 4.5,
    isVeg: true,
    category: "Fruits",
    unit: "500 gm",
    inStock: true
  },
  {
    id: "fruit-8",
    name: "Pomegranate",
    price: 180,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop",
    description: "Fresh pomegranate, rich in antioxidants",
    rating: 4.7,
    isVeg: true,
    category: "Fruits",
    unit: "1 kg",
    inStock: true
  }
];

// ==================== DAIRY ====================
const dairy: Product[] = [
  {
    id: "dairy-1",
    name: "Fresh Milk",
    price: 60,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
    description: "Farm fresh full cream milk",
    rating: 4.8,
    isVeg: true,
    category: "Dairy",
    unit: "1 litre",
    inStock: true
  },
  {
    id: "dairy-2",
    name: "Curd (Dahi)",
    price: 45,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    description: "Fresh homemade style curd",
    rating: 4.6,
    isVeg: true,
    category: "Dairy",
    unit: "500 gm",
    inStock: true
  },
  {
    id: "dairy-3",
    name: "Paneer",
    price: 90,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
    description: "Fresh cottage cheese, soft and delicious",
    rating: 4.7,
    isVeg: true,
    category: "Dairy",
    unit: "200 gm",
    inStock: true
  },
  {
    id: "dairy-4",
    name: "Butter",
    price: 55,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop",
    description: "Creamy salted butter",
    rating: 4.5,
    isVeg: true,
    category: "Dairy",
    unit: "100 gm",
    inStock: true
  },
  {
    id: "dairy-5",
    name: "Cheese Slice",
    price: 85,
    image: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&h=300&fit=crop",
    description: "Processed cheese slices",
    rating: 4.4,
    isVeg: true,
    category: "Dairy",
    unit: "10 slices",
    inStock: true
  },
  {
    id: "dairy-6",
    name: "Ghee",
    price: 180,
    image: "https://images.unsplash.com/photo-1631898039984-fd5e147f3a14?w=400&h=300&fit=crop",
    description: "Pure desi ghee",
    rating: 4.9,
    isVeg: true,
    category: "Dairy",
    unit: "200 gm",
    inStock: true
  },
  {
    id: "dairy-7",
    name: "Mushroom",
    price: 70,
    image: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400&h=300&fit=crop",
    description: "Fresh button mushrooms",
    rating: 4.5,
    isVeg: true,
    category: "Dairy",
    unit: "200 gm",
    inStock: true
  }
];

// ==================== MEAT & FISH ====================
const meatFish: Product[] = [
  {
    id: "meat-1",
    name: "Chicken Curry Cut",
    price: 220,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
    description: "Fresh chicken curry cut pieces with bone",
    rating: 4.7,
    isVeg: false,
    category: "Meat & Fish",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "meat-2",
    name: "Chicken Boneless",
    price: 320,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
    description: "Premium boneless chicken breast",
    rating: 4.8,
    isVeg: false,
    category: "Meat & Fish",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "meat-3",
    name: "Mutton Curry Cut",
    price: 650,
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=300&fit=crop",
    description: "Fresh goat meat curry cut",
    rating: 4.6,
    isVeg: false,
    category: "Meat & Fish",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "meat-4",
    name: "Eggs",
    price: 80,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&h=300&fit=crop",
    description: "Farm fresh brown eggs",
    rating: 4.5,
    isVeg: false,
    category: "Meat & Fish",
    unit: "12 pcs",
    inStock: true
  },
  {
    id: "meat-5",
    name: "Rohu Fish",
    price: 280,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    description: "Fresh Rohu fish, cleaned and cut",
    rating: 4.6,
    isVeg: false,
    category: "Meat & Fish",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "meat-6",
    name: "Katla Fish",
    price: 260,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop",
    description: "Fresh Katla fish, cleaned",
    rating: 4.5,
    isVeg: false,
    category: "Meat & Fish",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "meat-7",
    name: "Prawns",
    price: 450,
    image: "https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?w=400&h=300&fit=crop",
    description: "Fresh prawns, cleaned and deveined",
    rating: 4.7,
    isVeg: false,
    category: "Meat & Fish",
    unit: "500 gm",
    inStock: true
  },
  {
    id: "meat-8",
    name: "Fish Fillet",
    price: 380,
    image: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=300&fit=crop",
    description: "Boneless fish fillet, ready to cook",
    rating: 4.6,
    isVeg: false,
    category: "Meat & Fish",
    unit: "500 gm",
    inStock: true
  }
];

// ==================== WOMEN'S ESSENTIALS ====================
const womensEssentials: Product[] = [
  {
    id: "women-1",
    name: "Stayfree Secure XL",
    price: 145,
    image: "https://images.unsplash.com/photo-1628526707662-e927c49b7b2c?w=400&h=300&fit=crop",
    description: "Sanitary pads with wings, extra long for overnight protection",
    rating: 4.7,
    isVeg: true,
    category: "Women's Care",
    unit: "20 pads",
    inStock: true
  },
  {
    id: "women-2",
    name: "Whisper Ultra Clean",
    price: 160,
    image: "https://images.unsplash.com/photo-1628526707662-e927c49b7b2c?w=400&h=300&fit=crop",
    description: "Ultra thin sanitary pads with dry top sheet",
    rating: 4.8,
    isVeg: true,
    category: "Women's Care",
    unit: "30 pads",
    inStock: true
  },
  {
    id: "women-3",
    name: "Cotton Bra - Basic",
    price: 250,
    image: "https://images.unsplash.com/photo-1617331140180-e8262094733a?w=400&h=300&fit=crop",
    description: "Comfortable cotton everyday bra",
    rating: 4.5,
    isVeg: true,
    category: "Women's Care",
    unit: "1 pc",
    variants: [
      { id: "women-3-32", name: "32B", price: 250 },
      { id: "women-3-34", name: "34B", price: 250 },
      { id: "women-3-36", name: "36C", price: 260 },
      { id: "women-3-38", name: "38C", price: 270 }
    ],
    inStock: true
  },
  {
    id: "women-4",
    name: "Sports Bra",
    price: 350,
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400&h=300&fit=crop",
    description: "High support sports bra for active lifestyle",
    rating: 4.6,
    isVeg: true,
    category: "Women's Care",
    unit: "1 pc",
    variants: [
      { id: "women-4-s", name: "Small", price: 350 },
      { id: "women-4-m", name: "Medium", price: 350 },
      { id: "women-4-l", name: "Large", price: 370 },
      { id: "women-4-xl", name: "XL", price: 390 }
    ],
    inStock: true
  },
  {
    id: "women-5",
    name: "Cotton Panty Pack",
    price: 299,
    image: "https://images.unsplash.com/photo-1617331140180-e8262094733a?w=400&h=300&fit=crop",
    description: "Comfortable cotton panties pack",
    rating: 4.5,
    isVeg: true,
    category: "Women's Care",
    unit: "3 pcs",
    variants: [
      { id: "women-5-s", name: "Small", price: 299 },
      { id: "women-5-m", name: "Medium", price: 299 },
      { id: "women-5-l", name: "Large", price: 319 },
      { id: "women-5-xl", name: "XL", price: 339 }
    ],
    inStock: true
  },
  {
    id: "women-6",
    name: "Panty Liner",
    price: 85,
    image: "https://images.unsplash.com/photo-1628526707662-e927c49b7b2c?w=400&h=300&fit=crop",
    description: "Daily panty liners for everyday freshness",
    rating: 4.4,
    isVeg: true,
    category: "Women's Care",
    unit: "30 pcs",
    inStock: true
  },
  {
    id: "women-7",
    name: "Intimate Wash",
    price: 180,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
    description: "pH balanced intimate hygiene wash",
    rating: 4.6,
    isVeg: true,
    category: "Women's Care",
    unit: "100 ml",
    inStock: true
  },
  {
    id: "women-8",
    name: "Hair Removal Cream",
    price: 120,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
    description: "Gentle hair removal cream for sensitive skin",
    rating: 4.3,
    isVeg: true,
    category: "Women's Care",
    unit: "50 gm",
    inStock: true
  }
];

// ==================== GROCERY ====================
const grocery: Product[] = [
  {
    id: "groc-1",
    name: "Basmati Rice",
    price: 180,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    description: "Premium long grain basmati rice",
    rating: 4.7,
    isVeg: true,
    category: "Grocery",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "groc-2",
    name: "Toor Dal",
    price: 140,
    image: "https://images.unsplash.com/photo-1585996746427-dbf7d1ba85f4?w=400&h=300&fit=crop",
    description: "Premium quality arhar/toor dal",
    rating: 4.6,
    isVeg: true,
    category: "Grocery",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "groc-3",
    name: "Chana Dal",
    price: 110,
    image: "https://images.unsplash.com/photo-1585996746427-dbf7d1ba85f4?w=400&h=300&fit=crop",
    description: "Split chickpeas for delicious dal",
    rating: 4.5,
    isVeg: true,
    category: "Grocery",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "groc-4",
    name: "Wheat Flour (Atta)",
    price: 55,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    description: "Fresh chakki ground wheat flour",
    rating: 4.8,
    isVeg: true,
    category: "Grocery",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "groc-5",
    name: "Sugar",
    price: 48,
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop",
    description: "Refined white sugar",
    rating: 4.4,
    isVeg: true,
    category: "Grocery",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "groc-6",
    name: "Salt",
    price: 25,
    image: "https://images.unsplash.com/photo-1518110925495-5fe2f8e2f5ee?w=400&h=300&fit=crop",
    description: "Iodized table salt",
    rating: 4.5,
    isVeg: true,
    category: "Grocery",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "groc-7",
    name: "Mustard Oil",
    price: 180,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    description: "Pure kachi ghani mustard oil",
    rating: 4.7,
    isVeg: true,
    category: "Grocery",
    unit: "1 litre",
    inStock: true
  },
  {
    id: "groc-8",
    name: "Sunflower Oil",
    price: 160,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    description: "Refined sunflower cooking oil",
    rating: 4.5,
    isVeg: true,
    category: "Grocery",
    unit: "1 litre",
    inStock: true
  },
  {
    id: "groc-9",
    name: "Turmeric Powder",
    price: 45,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop",
    description: "Pure haldi powder",
    rating: 4.6,
    isVeg: true,
    category: "Grocery",
    unit: "100 gm",
    inStock: true
  },
  {
    id: "groc-10",
    name: "Red Chilli Powder",
    price: 55,
    image: "https://images.unsplash.com/photo-1599909533681-74d7d5f96cc5?w=400&h=300&fit=crop",
    description: "Spicy red chilli powder",
    rating: 4.5,
    isVeg: true,
    category: "Grocery",
    unit: "100 gm",
    inStock: true
  },
  {
    id: "groc-11",
    name: "Coriander Powder",
    price: 40,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    description: "Fresh ground dhania powder",
    rating: 4.4,
    isVeg: true,
    category: "Grocery",
    unit: "100 gm",
    inStock: true
  },
  {
    id: "groc-12",
    name: "Garam Masala",
    price: 65,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    description: "Aromatic blend of spices",
    rating: 4.7,
    isVeg: true,
    category: "Grocery",
    unit: "100 gm",
    inStock: true
  },
  {
    id: "groc-13",
    name: "Moong Dal",
    price: 130,
    image: "https://images.unsplash.com/photo-1585996746427-dbf7d1ba85f4?w=400&h=300&fit=crop",
    description: "Yellow split moong dal",
    rating: 4.6,
    isVeg: true,
    category: "Grocery",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "groc-14",
    name: "Rajma",
    price: 150,
    image: "https://images.unsplash.com/photo-1585996746427-dbf7d1ba85f4?w=400&h=300&fit=crop",
    description: "Red kidney beans",
    rating: 4.5,
    isVeg: true,
    category: "Grocery",
    unit: "1 kg",
    inStock: true
  },
  {
    id: "groc-15",
    name: "Tea (Chai)",
    price: 120,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    description: "Premium CTC tea leaves",
    rating: 4.6,
    isVeg: true,
    category: "Grocery",
    unit: "250 gm",
    inStock: true
  }
];

// ==================== FAST FOOD ====================
const fastFood: Product[] = [
  {
    id: "fast-1",
    name: "Classic Burger",
    price: 60,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    description: "Juicy chicken patty with fresh veggies, cheese, and our special sauce",
    rating: 4.5,
    isVeg: false,
    category: "Fast Food",
    variants: [
      { id: "fast-1-small", name: "Regular", price: 60 },
      { id: "fast-1-medium", name: "Medium", price: 80 },
      { id: "fast-1-large", name: "Large (Double Patty)", price: 120 }
    ],
    inStock: true
  },
  {
    id: "fast-2",
    name: "Gol Gappe",
    price: 30,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    description: "Crispy puris filled with tangy tamarind water and spiced potatoes",
    rating: 4.8,
    isVeg: true,
    category: "Snacks",
    variants: [
      { id: "fast-2-6pcs", name: "6 Pieces", price: 30 },
      { id: "fast-2-12pcs", name: "12 Pieces", price: 50 },
      { id: "fast-2-plate", name: "Full Plate (20 pcs)", price: 80 }
    ],
    inStock: true
  },
  {
    id: "fast-3",
    name: "Chilli Potato",
    price: 60,
    image: "https://images.unsplash.com/photo-1623238912680-26fc5ffb57e4?w=400&h=300&fit=crop",
    description: "Crispy fried potatoes tossed in spicy Indo-Chinese sauce",
    rating: 4.4,
    isVeg: true,
    category: "Snacks",
    variants: [
      { id: "fast-3-half", name: "Half Plate", price: 60 },
      { id: "fast-3-full", name: "Full Plate", price: 100 }
    ],
    inStock: true
  },
  {
    id: "fast-4",
    name: "Samosa",
    price: 15,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    description: "Crispy fried pastry with spiced potato filling",
    rating: 4.6,
    isVeg: true,
    category: "Snacks",
    unit: "1 pc",
    inStock: true
  },
  {
    id: "fast-5",
    name: "Aloo Tikki",
    price: 20,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    description: "Spiced potato patty served with chutney",
    rating: 4.5,
    isVeg: true,
    category: "Snacks",
    unit: "1 pc",
    inStock: true
  }
];

// ==================== CHINESE ====================
const chinese: Product[] = [
  {
    id: "chinese-1",
    name: "Veg Chowmin",
    price: 60,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    description: "Stir-fried noodles with fresh vegetables and Indo-Chinese spices",
    rating: 4.3,
    isVeg: true,
    category: "Chinese",
    variants: [
      { id: "chinese-1-half", name: "Half Plate", price: 60 },
      { id: "chinese-1-full", name: "Full Plate", price: 100 }
    ],
    inStock: true
  },
  {
    id: "chinese-2",
    name: "Chicken Chowmin",
    price: 80,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop",
    description: "Stir-fried noodles with tender chicken and vegetables",
    rating: 4.5,
    isVeg: false,
    category: "Chinese",
    variants: [
      { id: "chinese-2-half", name: "Half Plate", price: 80 },
      { id: "chinese-2-full", name: "Full Plate", price: 140 }
    ],
    inStock: true
  },
  {
    id: "chinese-3",
    name: "Steamed Momos",
    price: 50,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop",
    description: "Soft dumplings stuffed with spiced vegetables",
    rating: 4.6,
    isVeg: true,
    category: "Chinese",
    variants: [
      { id: "chinese-3-half", name: "Half (5 pcs)", price: 50 },
      { id: "chinese-3-full", name: "Full (10 pcs)", price: 90 }
    ],
    inStock: true
  },
  {
    id: "chinese-4",
    name: "Chicken Momos",
    price: 60,
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&h=300&fit=crop",
    description: "Juicy chicken-filled dumplings with spicy red chutney",
    rating: 4.7,
    isVeg: false,
    category: "Chinese",
    variants: [
      { id: "chinese-4-half", name: "Half (5 pcs)", price: 60 },
      { id: "chinese-4-full", name: "Full (10 pcs)", price: 110 }
    ],
    inStock: true
  },
  {
    id: "chinese-5",
    name: "Veg Fried Rice",
    price: 70,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    description: "Wok-tossed rice with fresh vegetables and soy sauce",
    rating: 4.2,
    isVeg: true,
    category: "Chinese",
    variants: [
      { id: "chinese-5-half", name: "Half Plate", price: 70 },
      { id: "chinese-5-full", name: "Full Plate", price: 120 }
    ],
    inStock: true
  },
  {
    id: "chinese-6",
    name: "Manchurian",
    price: 70,
    image: "https://images.unsplash.com/photo-1645696301019-35adcc18fc93?w=400&h=300&fit=crop",
    description: "Crispy veg balls in tangy Indo-Chinese manchurian sauce",
    rating: 4.5,
    isVeg: true,
    category: "Chinese",
    variants: [
      { id: "chinese-6-dry", name: "Dry (Half)", price: 70 },
      { id: "chinese-6-dry-full", name: "Dry (Full)", price: 120 },
      { id: "chinese-6-gravy", name: "Gravy (Half)", price: 80 },
      { id: "chinese-6-gravy-full", name: "Gravy (Full)", price: 140 }
    ],
    inStock: true
  }
];

// ==================== INDIAN ====================
const indian: Product[] = [
  {
    id: "indian-1",
    name: "Chicken Biryani",
    price: 100,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    description: "Aromatic basmati rice layered with spiced chicken and dum-cooked",
    rating: 4.9,
    isVeg: false,
    category: "Indian",
    variants: [
      { id: "indian-1-half", name: "Half Plate", price: 100 },
      { id: "indian-1-full", name: "Full Plate", price: 180 },
      { id: "indian-1-family", name: "Family Pack", price: 350 }
    ],
    inStock: true
  },
  {
    id: "indian-2",
    name: "Veg Biryani",
    price: 80,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
    description: "Aromatic basmati rice with mixed vegetables and spices",
    rating: 4.3,
    isVeg: true,
    category: "Indian",
    variants: [
      { id: "indian-2-half", name: "Half Plate", price: 80 },
      { id: "indian-2-full", name: "Full Plate", price: 140 },
      { id: "indian-2-family", name: "Family Pack", price: 280 }
    ],
    inStock: true
  },
  {
    id: "indian-3",
    name: "Paneer Tikka",
    price: 100,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
    description: "Marinated cottage cheese grilled to perfection with spices",
    rating: 4.4,
    isVeg: true,
    category: "Indian",
    variants: [
      { id: "indian-3-half", name: "Half Plate (6 pcs)", price: 100 },
      { id: "indian-3-full", name: "Full Plate (12 pcs)", price: 180 }
    ],
    inStock: true
  },
  {
    id: "indian-4",
    name: "Dal Makhani",
    price: 120,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    description: "Creamy black lentils slow-cooked with butter",
    rating: 4.6,
    isVeg: true,
    category: "Indian",
    unit: "1 bowl",
    inStock: true
  },
  {
    id: "indian-5",
    name: "Butter Chicken",
    price: 180,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    description: "Tender chicken in rich tomato and butter gravy",
    rating: 4.8,
    isVeg: false,
    category: "Indian",
    unit: "1 bowl",
    inStock: true
  }
];

// ==================== ROLLS ====================
const rolls: Product[] = [
  {
    id: "roll-1",
    name: "Anda Roll",
    price: 40,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    description: "Egg-wrapped paratha roll with onions, chutney, and spices",
    rating: 4.5,
    isVeg: false,
    category: "Rolls",
    variants: [
      { id: "roll-1-single", name: "Single Egg", price: 40 },
      { id: "roll-1-double", name: "Double Egg", price: 60 }
    ],
    inStock: true
  },
  {
    id: "roll-2",
    name: "Chicken Roll",
    price: 70,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
    description: "Tender chicken pieces wrapped in flaky paratha with sauces",
    rating: 4.6,
    isVeg: false,
    category: "Rolls",
    variants: [
      { id: "roll-2-regular", name: "Regular", price: 70 },
      { id: "roll-2-large", name: "Large", price: 100 }
    ],
    inStock: true
  },
  {
    id: "roll-3",
    name: "Paneer Roll",
    price: 60,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    description: "Spiced paneer wrapped in soft paratha with mint chutney",
    rating: 4.4,
    isVeg: true,
    category: "Rolls",
    variants: [
      { id: "roll-3-regular", name: "Regular", price: 60 },
      { id: "roll-3-large", name: "Large", price: 90 }
    ],
    inStock: true
  }
];

// ==================== BEVERAGES ====================
const beverages: Product[] = [
  {
    id: "bev-1",
    name: "Masala Chai",
    price: 15,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    description: "Hot Indian spiced tea",
    rating: 4.7,
    isVeg: true,
    category: "Beverages",
    unit: "1 cup",
    inStock: true
  },
  {
    id: "bev-2",
    name: "Fresh Lime Soda",
    price: 35,
    image: "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=400&h=300&fit=crop",
    description: "Refreshing lime soda, sweet or salty",
    rating: 4.5,
    isVeg: true,
    category: "Beverages",
    unit: "1 glass",
    inStock: true
  },
  {
    id: "bev-3",
    name: "Lassi",
    price: 40,
    image: "https://images.unsplash.com/photo-1626707144291-0d064b66a97a?w=400&h=300&fit=crop",
    description: "Creamy yogurt drink, sweet or salted",
    rating: 4.6,
    isVeg: true,
    category: "Beverages",
    unit: "1 glass",
    inStock: true
  },
  {
    id: "bev-4",
    name: "Cold Coffee",
    price: 60,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    description: "Creamy iced coffee with ice cream",
    rating: 4.5,
    isVeg: true,
    category: "Beverages",
    unit: "1 glass",
    inStock: true
  },
  {
    id: "bev-5",
    name: "Coconut Water",
    price: 45,
    image: "https://images.unsplash.com/photo-1544252890-c84f3eb86e21?w=400&h=300&fit=crop",
    description: "Fresh tender coconut water",
    rating: 4.8,
    isVeg: true,
    category: "Beverages",
    unit: "1 pc",
    inStock: true
  }
];

// ==================== PERSONAL CARE ====================
const personalCare: Product[] = [
  {
    id: "care-1",
    name: "Soap Bar",
    price: 40,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
    description: "Moisturizing bath soap",
    rating: 4.4,
    isVeg: true,
    category: "Personal Care",
    unit: "75 gm",
    inStock: true
  },
  {
    id: "care-2",
    name: "Shampoo",
    price: 180,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
    description: "Anti-dandruff shampoo",
    rating: 4.5,
    isVeg: true,
    category: "Personal Care",
    unit: "180 ml",
    inStock: true
  },
  {
    id: "care-3",
    name: "Toothpaste",
    price: 65,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
    description: "Cavity protection toothpaste",
    rating: 4.6,
    isVeg: true,
    category: "Personal Care",
    unit: "100 gm",
    inStock: true
  },
  {
    id: "care-4",
    name: "Hair Oil",
    price: 95,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
    description: "Coconut hair oil for strong hair",
    rating: 4.5,
    isVeg: true,
    category: "Personal Care",
    unit: "100 ml",
    inStock: true
  }
];

// ==================== COMBINE ALL PRODUCTS ====================
export const products: Product[] = [
  ...vegetables,
  ...fruits,
  ...dairy,
  ...meatFish,
  ...womensEssentials,
  ...grocery,
  ...fastFood,
  ...chinese,
  ...indian,
  ...rolls,
  ...beverages,
  ...personalCare
];

export const categories = [
  "All",
  "Vegetables",
  "Fruits", 
  "Dairy",
  "Meat & Fish",
  "Women's Care",
  "Grocery",
  "Fast Food",
  "Snacks",
  "Chinese",
  "Indian",
  "Rolls",
  "Beverages",
  "Personal Care"
];

export const areas = [
  "North Village",
  "East Village", 
  "West Village",
  "South Village",
  "Central Area",
  "Market Area"
];
