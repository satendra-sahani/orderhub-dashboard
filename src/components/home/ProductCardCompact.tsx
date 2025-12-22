import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";

interface ProductCardCompactProps {
  product: Product;
  onAdd: () => void;
}

const ProductCardCompact = ({ product, onAdd }: ProductCardCompactProps) => {
  const { name, image, rating, isVeg, variants, sponsor, price } = product;

  // Calculate prices
  const basePrice = variants && variants.length > 0 
    ? Math.min(...variants.map(v => v.price))
    : price;
  
  const discountedPrice = sponsor 
    ? Math.round(basePrice * (1 - sponsor.discountPercent / 100))
    : basePrice;

  return (
    <div className="product-card group relative animate-fade-in">
      {/* Discount Badge */}
      {sponsor && (
        <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">
          {sponsor.discountPercent}% OFF
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Veg/Non-veg indicator */}
        <div className="absolute top-2 right-2">
          <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-background ${isVeg ? 'border-success' : 'border-destructive'}`}>
            <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-success' : 'bg-destructive'}`} />
          </span>
        </div>

        {/* Rating */}
        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
          <Star className="w-3 h-3 text-warning fill-warning" />
          <span className="text-xs font-semibold">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Shop name if sponsored */}
        {sponsor && (
          <p className="text-[10px] text-primary font-medium mb-0.5 truncate">
            {sponsor.shopName}
          </p>
        )}
        
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight mb-1 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Unit display */}
        {product.unit && (
          <p className="text-[10px] text-muted-foreground mb-1">{product.unit}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            {sponsor ? (
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-foreground">₹{discountedPrice}</span>
                <span className="text-xs text-muted-foreground line-through">₹{basePrice}</span>
              </div>
            ) : (
              <span className="text-sm font-bold text-foreground">₹{basePrice}</span>
            )}
            {variants && variants.length > 1 && (
              <p className="text-[10px] text-muted-foreground">onwards</p>
            )}
          </div>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="h-8 px-3 quick-add text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-0.5" />
            ADD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardCompact;
