import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartContext";
import { Product, ProductVariant } from "@/data/products";
import { Star, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCustomizationDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductCustomizationDialog = ({
  product,
  open,
  onOpenChange,
}: ProductCustomizationDialogProps) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  if (!product) return null;

  const variants = product.variants || [
    { id: product.id, name: "Regular", price: product.price }
  ];

  const handleAddToCart = () => {
    const variant = selectedVariant || variants[0];
    
    addToCart({
      id: `${product.id}-${variant.id}`,
      productId: product.id,
      name: product.name,
      variantName: variant.name,
      price: variant.price,
      image: product.image,
    });
    
    toast.success(`${product.name} (${variant.name}) added to cart!`);
    onOpenChange(false);
    setSelectedVariant(null);
  };

  const currentVariant = selectedVariant || variants[0];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) setSelectedVariant(null);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Customize Your Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Image & Info */}
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 left-1">
                <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${product.isVeg ? 'border-success bg-background' : 'border-destructive bg-background'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.isVeg ? 'bg-success' : 'bg-destructive'}`} />
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
              </div>
            </div>
          </div>

          {/* Variant Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Select Size / Quantity</h4>
            <div className="space-y-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200",
                    (selectedVariant?.id === variant.id || (!selectedVariant && variant.id === variants[0].id))
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      (selectedVariant?.id === variant.id || (!selectedVariant && variant.id === variants[0].id))
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {(selectedVariant?.id === variant.id || (!selectedVariant && variant.id === variants[0].id)) && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="font-medium text-foreground">{variant.name}</span>
                  </div>
                  <span className="font-bold text-primary">₹{variant.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
          >
            Add to Cart • ₹{currentVariant.price}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizationDialog;
