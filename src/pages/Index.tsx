import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/products/ProductCard";
import ProductCustomizationDialog from "@/components/products/ProductCustomizationDialog";
import CartSheet from "@/components/cart/CartSheet";
import UserLoginSheet from "@/components/auth/UserLoginSheet";
import MyOrdersSheet from "@/components/auth/MyOrdersSheet";
import { products, categories, Product } from "@/data/products";
import { ChefHat, Search, MapPin, Clock } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCustomize = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Orderhai</span>
          </div>

          <div className="flex items-center gap-2">
            <UserLoginSheet onViewOrders={() => setIsOrdersOpen(true)} />
            <CartSheet />
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="gradient-primary py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Delicious Food, Delivered Fresh
              </h1>
              <div className="flex items-center gap-4 text-primary-foreground/80 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Serving Your Village
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  30-45 min delivery
                </span>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/95 border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 px-4 border-b border-border sticky top-16 bg-background z-40">
        <div className="container mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {activeCategory === "All" ? "All Items" : activeCategory}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} items
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onCustomize={handleCustomize}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border mt-8">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Orderhai. Fresh food for your village.</p>
        </div>
      </footer>

      {/* Product Customization Dialog */}
      <ProductCustomizationDialog
        product={selectedProduct}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      {/* My Orders Sheet */}
      <MyOrdersSheet open={isOrdersOpen} onOpenChange={setIsOrdersOpen} />
    </div>
  );
};

export default Index;
