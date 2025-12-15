export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  isVeg: boolean;
  category: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Burger",
    price: 99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    description: "Juicy chicken patty with fresh veggies, cheese, and our special sauce",
    rating: 4.5,
    isVeg: false,
    category: "Fast Food"
  },
  {
    id: "2",
    name: "Veg Chowmin",
    price: 80,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
    description: "Stir-fried noodles with fresh vegetables and Indo-Chinese spices",
    rating: 4.3,
    isVeg: true,
    category: "Chinese"
  },
  {
    id: "3",
    name: "Gol Gappe",
    price: 40,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    description: "Crispy puris filled with tangy tamarind water and spiced potatoes",
    rating: 4.8,
    isVeg: true,
    category: "Snacks"
  },
  {
    id: "4",
    name: "Steamed Momos",
    price: 60,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop",
    description: "Soft dumplings stuffed with spiced vegetables, served with chutney",
    rating: 4.6,
    isVeg: true,
    category: "Chinese"
  },
  {
    id: "5",
    name: "Chicken Momos",
    price: 80,
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&h=300&fit=crop",
    description: "Juicy chicken-filled dumplings with spicy red chutney",
    rating: 4.7,
    isVeg: false,
    category: "Chinese"
  },
  {
    id: "6",
    name: "Chilli Potato",
    price: 70,
    image: "https://images.unsplash.com/photo-1623238912680-26fc5ffb57e4?w=400&h=300&fit=crop",
    description: "Crispy fried potatoes tossed in spicy Indo-Chinese sauce",
    rating: 4.4,
    isVeg: true,
    category: "Snacks"
  },
  {
    id: "7",
    name: "Chicken Biryani",
    price: 150,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    description: "Aromatic basmati rice layered with spiced chicken and dum-cooked",
    rating: 4.9,
    isVeg: false,
    category: "Indian"
  },
  {
    id: "8",
    name: "Veg Fried Rice",
    price: 90,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    description: "Wok-tossed rice with fresh vegetables and soy sauce",
    rating: 4.2,
    isVeg: true,
    category: "Chinese"
  },
  {
    id: "9",
    name: "Anda Roll",
    price: 50,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    description: "Egg-wrapped paratha roll with onions, chutney, and spices",
    rating: 4.5,
    isVeg: false,
    category: "Rolls"
  },
  {
    id: "10",
    name: "Chicken Roll",
    price: 80,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
    description: "Tender chicken pieces wrapped in flaky paratha with sauces",
    rating: 4.6,
    isVeg: false,
    category: "Rolls"
  },
  {
    id: "11",
    name: "Paneer Tikka",
    price: 120,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
    description: "Marinated cottage cheese grilled to perfection with spices",
    rating: 4.4,
    isVeg: true,
    category: "Indian"
  },
  {
    id: "12",
    name: "Chicken Chowmin",
    price: 100,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop",
    description: "Stir-fried noodles with tender chicken and vegetables",
    rating: 4.5,
    isVeg: false,
    category: "Chinese"
  }
];

export const categories = ["All", "Fast Food", "Chinese", "Indian", "Snacks", "Rolls"];
