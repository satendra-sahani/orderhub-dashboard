import { useState } from "react";
import { Product, products, categories } from "@/data/products";
import Header from "@/components/home/Header";
import CategoryBar from "@/components/home/CategoryBar";
import ProductGrid from "@/components/home/ProductGrid";
import ProductCustomizationDialog from "@/components/products/ProductCustomizationDialog";
import MyOrdersSheet from "@/components/auth/MyOrdersSheet";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onViewOrders={() => setIsOrdersOpen(true)}
      />
      
      <CategoryBar 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Section Title */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {activeCategory === "All" ? "All Items" : activeCategory}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} items available
          </p>
        </div>

        <ProductGrid 
          products={filteredProducts}
          onAddProduct={handleAddProduct}
        />
      </main>

      {/* Product Customization Dialog */}
      {selectedProduct && (
        <ProductCustomizationDialog
          product={selectedProduct}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}

      {/* My Orders Sheet */}
      <MyOrdersSheet 
        open={isOrdersOpen}
        onOpenChange={setIsOrdersOpen}
      />
    </div>
  );
};

export default Index;
