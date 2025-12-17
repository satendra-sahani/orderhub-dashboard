export interface ProductVariant {
  id: string;
  name: string;
  price: number;
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
  variants?: ProductVariant[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Burger",
    price: 60,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    description: "Juicy chicken patty with fresh veggies, cheese, and our special sauce",
    rating: 4.5,
    isVeg: false,
    category: "Fast Food",
    variants: [
      { id: "1-small", name: "Regular", price: 60 },
      { id: "1-medium", name: "Medium", price: 80 },
      { id: "1-large", name: "Large (Double Patty)", price: 120 }
    ]
  },
  {
    id: "2",
    name: "Veg Chowmin",
    price: 60,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    description: "Stir-fried noodles with fresh vegetables and Indo-Chinese spices",
    rating: 4.3,
    isVeg: true,
    category: "Chinese",
    variants: [
      { id: "2-half", name: "Half Plate", price: 60 },
      { id: "2-full", name: "Full Plate", price: 100 }
    ]
  },
  {
    id: "3",
    name: "Gol Gappe",
    price: 30,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    description: "Crispy puris filled with tangy tamarind water and spiced potatoes",
    rating: 4.8,
    isVeg: true,
    category: "Snacks",
    variants: [
      { id: "3-6pcs", name: "6 Pieces", price: 30 },
      { id: "3-12pcs", name: "12 Pieces", price: 50 },
      { id: "3-plate", name: "Full Plate (20 pcs)", price: 80 }
    ]
  },
  {
    id: "4",
    name: "Steamed Momos",
    price: 50,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop",
    description: "Soft dumplings stuffed with spiced vegetables, served with chutney",
    rating: 4.6,
    isVeg: true,
    category: "Chinese",
    variants: [
      { id: "4-half", name: "Half (5 pcs)", price: 50 },
      { id: "4-full", name: "Full (10 pcs)", price: 90 }
    ]
  },
  {
    id: "5",
    name: "Chicken Momos",
    price: 60,
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&h=300&fit=crop",
    description: "Juicy chicken-filled dumplings with spicy red chutney",
    rating: 4.7,
    isVeg: false,
    category: "Chinese",
    variants: [
      { id: "5-half", name: "Half (5 pcs)", price: 60 },
      { id: "5-full", name: "Full (10 pcs)", price: 110 }
    ]
  },
  {
    id: "6",
    name: "Chilli Potato",
    price: 60,
    image: "https://images.unsplash.com/photo-1623238912680-26fc5ffb57e4?w=400&h=300&fit=crop",
    description: "Crispy fried potatoes tossed in spicy Indo-Chinese sauce",
    rating: 4.4,
    isVeg: true,
    category: "Snacks",
    variants: [
      { id: "6-half", name: "Half Plate", price: 60 },
      { id: "6-full", name: "Full Plate", price: 100 }
    ]
  },
  {
    id: "7",
    name: "Chicken Biryani",
    price: 100,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    description: "Aromatic basmati rice layered with spiced chicken and dum-cooked",
    rating: 4.9,
    isVeg: false,
    category: "Indian",
    variants: [
      { id: "7-half", name: "Half Plate", price: 100 },
      { id: "7-full", name: "Full Plate", price: 180 },
      { id: "7-family", name: "Family Pack", price: 350 }
    ]
  },
  {
    id: "8",
    name: "Veg Fried Rice",
    price: 70,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    description: "Wok-tossed rice with fresh vegetables and soy sauce",
    rating: 4.2,
    isVeg: true,
    category: "Chinese",
    variants: [
      { id: "8-half", name: "Half Plate", price: 70 },
      { id: "8-full", name: "Full Plate", price: 120 }
    ]
  },
  {
    id: "9",
    name: "Anda Roll",
    price: 40,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    description: "Egg-wrapped paratha roll with onions, chutney, and spices",
    rating: 4.5,
    isVeg: false,
    category: "Rolls",
    variants: [
      { id: "9-single", name: "Single Egg", price: 40 },
      { id: "9-double", name: "Double Egg", price: 60 }
    ]
  },
  {
    id: "10",
    name: "Chicken Roll",
    price: 70,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
    description: "Tender chicken pieces wrapped in flaky paratha with sauces",
    rating: 4.6,
    isVeg: false,
    category: "Rolls",
    variants: [
      { id: "10-regular", name: "Regular", price: 70 },
      { id: "10-large", name: "Large", price: 100 }
    ]
  },
  {
    id: "11",
    name: "Paneer Tikka",
    price: 100,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
    description: "Marinated cottage cheese grilled to perfection with spices",
    rating: 4.4,
    isVeg: true,
    category: "Indian",
    variants: [
      { id: "11-half", name: "Half Plate (6 pcs)", price: 100 },
      { id: "11-full", name: "Full Plate (12 pcs)", price: 180 }
    ]
  },
  {
    id: "12",
    name: "Chicken Chowmin",
    price: 80,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop",
    description: "Stir-fried noodles with tender chicken and vegetables",
    rating: 4.5,
    isVeg: false,
    category: "Chinese",
    variants: [
      { id: "12-half", name: "Half Plate", price: 80 },
      { id: "12-full", name: "Full Plate", price: 140 }
    ]
  },
  {
    id: "13",
    name: "Veg Biryani",
    price: 80,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
    description: "Aromatic basmati rice with mixed vegetables and spices",
    rating: 4.3,
    isVeg: true,
    category: "Indian",
    variants: [
      { id: "13-half", name: "Half Plate", price: 80 },
      { id: "13-full", name: "Full Plate", price: 140 },
      { id: "13-family", name: "Family Pack", price: 280 }
    ]
  },
  {
    id: "14",
    name: "Paneer Roll",
    price: 60,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    description: "Spiced paneer wrapped in soft paratha with mint chutney",
    rating: 4.4,
    isVeg: true,
    category: "Rolls",
    variants: [
      { id: "14-regular", name: "Regular", price: 60 },
      { id: "14-large", name: "Large", price: 90 }
    ]
  },
  {
    id: "15",
    name: "Manchurian",
    price: 70,
    image: "https://images.unsplash.com/photo-1645696301019-35adcc18fc93?w=400&h=300&fit=crop",
    description: "Crispy veg balls in tangy Indo-Chinese manchurian sauce",
    rating: 4.5,
    isVeg: true,
    category: "Chinese",
    variants: [
      { id: "15-dry", name: "Dry (Half)", price: 70 },
      { id: "15-dry-full", name: "Dry (Full)", price: 120 },
      { id: "15-gravy", name: "Gravy (Half)", price: 80 },
      { id: "15-gravy-full", name: "Gravy (Full)", price: 140 }
    ]
  }
];

export const categories = ["All", "Fast Food", "Chinese", "Indian", "Snacks", "Rolls"];
