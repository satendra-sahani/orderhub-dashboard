import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Store, Percent } from "lucide-react";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onCustomize: (product: Product) => void;
}

const ProductCard = ({ product, onCustomize }: ProductCardProps) => {
  const { name, price, image, description, rating, isVeg, variants, sponsor } = product;
  
  // Calculate base price (minimum variant price or regular price)
  const basePrice = variants && variants.length > 0 
    ? Math.min(...variants.map(v => v.price))
    : price;
  
  // Calculate discounted price if sponsored
  const discountedPrice = sponsor 
    ? Math.round(basePrice * (1 - sponsor.discountPercent / 100))
    : basePrice;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
      {/* Sponsor Badge */}
      {sponsor && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{sponsor.shopName}</span>
          </div>
          <div className="flex items-center gap-1 bg-primary-foreground/20 rounded-full px-2 py-0.5">
            <Percent className="w-3 h-3" />
            <span className="text-xs font-bold">{sponsor.discountPercent}% OFF</span>
          </div>
        </div>
      )}

      <div className={`relative h-40 overflow-hidden ${sponsor ? 'mt-8' : ''}`}>
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
        
        {/* Area badge for sponsored products */}
        {sponsor && (
          <Badge variant="secondary" className="mt-2 text-xs">
            📍 {sponsor.area}
          </Badge>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div>
            {sponsor ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">₹{discountedPrice}</span>
                <span className="text-sm text-muted-foreground line-through">₹{basePrice}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-foreground">₹{basePrice}</span>
            )}
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
