import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onCustomize: (product: Product) => void;
}

const ProductCard = ({ product, onCustomize }: ProductCardProps) => {
  const { name, price, image, description, rating, isVeg, variants } = product;
  
  // Show starting price if variants exist
  const displayPrice = variants && variants.length > 0 
    ? Math.min(...variants.map(v => v.price))
    : price;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center ${isVeg ? 'border-success bg-background' : 'border-destructive bg-background'}`}>
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
          <div>
            <span className="text-xl font-bold text-foreground">₹{displayPrice}</span>
            {variants && variants.length > 1 && (
              <span className="text-xs text-muted-foreground ml-1">onwards</span>
            )}
          </div>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onCustomize(product)}
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
