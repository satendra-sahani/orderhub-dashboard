import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartContext";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  isVeg: boolean;
  category: string;
}

const ProductCard = ({ id, name, price, image, description, rating, isVeg }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
    toast.success(`${name} added to cart!`);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center ${isVeg ? 'border-success' : 'border-destructive'}`}>
            <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-success' : 'bg-destructive'}`} />
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-3 h-3 text-warning fill-warning" />
          <span className="text-xs font-semibold text-foreground">{rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-foreground">₹{price}</span>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleAddToCart}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
