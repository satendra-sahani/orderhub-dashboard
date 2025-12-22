import { Product } from "@/data/products";
import ProductCardCompact from "./ProductCardCompact";

interface ProductGridProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

const ProductGrid = ({ products, onAddProduct }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-6xl mb-4">🍽️</span>
        <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
        <p className="text-muted-foreground">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {products.map((product) => (
        <ProductCardCompact 
          key={product.id} 
          product={product} 
          onAdd={() => onAddProduct(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
