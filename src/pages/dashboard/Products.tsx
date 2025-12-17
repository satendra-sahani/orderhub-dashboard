import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import StatCard from "@/components/dashboard/StatCard";
import { 
  Package, 
  Store, 
  Percent, 
  Search, 
  Star,
  MapPin,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { products as initialProducts, Product, areas } from "@/data/products";

const mockShops = [
  { id: "SHP001", name: "Krishna Foods", area: "North Village" },
  { id: "SHP002", name: "Sharma Kitchen", area: "East Village" },
  { id: "SHP003", name: "Village Snacks", area: "West Village" },
  { id: "SHP004", name: "Gupta Corner", area: "South Village" },
  { id: "SHP005", name: "Desi Delights", area: "Central Area" },
];

const Products = () => {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({
    shopId: "",
    discountPercent: "10",
    area: ""
  });

  const handleAssignSponsor = () => {
    if (!selectedProduct || !sponsorForm.shopId) {
      toast.error("Please select a shop");
      return;
    }

    const shop = mockShops.find(s => s.id === sponsorForm.shopId);
    if (!shop) return;

    setProductsList(productsList.map(p => 
      p.id === selectedProduct.id 
        ? { 
            ...p, 
            sponsor: {
              shopId: shop.id,
              shopName: shop.name,
              discountPercent: parseInt(sponsorForm.discountPercent),
              area: sponsorForm.area || shop.area
            }
          }
        : p
    ));

    toast.success(`${shop.name} is now sponsoring ${selectedProduct.name}`);
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setSponsorForm({ shopId: "", discountPercent: "10", area: "" });
  };

  const handleRemoveSponsor = (productId: string) => {
    setProductsList(productsList.map(p => 
      p.id === productId 
        ? { ...p, sponsor: undefined }
        : p
    ));
    toast.success("Sponsor removed");
  };

  const openSponsorDialog = (product: Product) => {
    setSelectedProduct(product);
    if (product.sponsor) {
      setSponsorForm({
        shopId: product.sponsor.shopId,
        discountPercent: product.sponsor.discountPercent.toString(),
        area: product.sponsor.area
      });
    }
    setIsDialogOpen(true);
  };

  const filteredProducts = productsList.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: productsList.length,
    sponsored: productsList.filter(p => p.sponsor).length,
    notSponsored: productsList.filter(p => !p.sponsor).length,
    avgDiscount: Math.round(
      productsList.filter(p => p.sponsor).reduce((sum, p) => sum + (p.sponsor?.discountPercent || 0), 0) / 
      (productsList.filter(p => p.sponsor).length || 1)
    ),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Product Promotions</h1>
        <p className="text-muted-foreground">Assign shops to sponsor products with discounted pricing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.total} icon={Package} />
        <StatCard title="Sponsored" value={stats.sponsored} icon={Store} change="With shop branding" changeType="positive" />
        <StatCard title="Not Sponsored" value={stats.notSponsored} icon={Package} />
        <StatCard title="Avg Discount" value={`${stats.avgDiscount}%`} icon={Percent} changeType="positive" />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all duration-200"
          >
            {/* Sponsor Banner */}
            {product.sponsor && (
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{product.sponsor.shopName}</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-primary-foreground/20 text-primary-foreground border-0">
                  {product.sponsor.discountPercent}% OFF
                </Badge>
              </div>
            )}

            <div className="relative h-32">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${product.isVeg ? 'border-success bg-background' : 'border-destructive bg-background'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.isVeg ? 'bg-success' : 'bg-destructive'}`} />
                </span>
              </div>
              <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                <span className="text-xs font-semibold text-foreground">{product.rating}</span>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <span className="text-sm font-bold text-foreground">₹{product.price}</span>
              </div>

              {product.sponsor && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" />
                  {product.sponsor.area}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={product.sponsor ? "outline" : "default"}
                  onClick={() => openSponsorDialog(product)}
                  className="flex-1 text-xs"
                >
                  {product.sponsor ? "Edit Sponsor" : "Add Sponsor"}
                </Button>
                {product.sponsor && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleRemoveSponsor(product.id)}
                    className="text-xs"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProduct?.sponsor ? "Edit Sponsor" : "Assign Shop Sponsor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedProduct && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium text-foreground">{selectedProduct.name}</h4>
                  <p className="text-sm text-muted-foreground">₹{selectedProduct.price}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Select Shop</Label>
              <Select 
                value={sponsorForm.shopId} 
                onValueChange={(value) => {
                  const shop = mockShops.find(s => s.id === value);
                  setSponsorForm({ 
                    ...sponsorForm, 
                    shopId: value,
                    area: shop?.area || ""
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a shop" />
                </SelectTrigger>
                <SelectContent>
                  {mockShops.map(shop => (
                    <SelectItem key={shop.id} value={shop.id}>
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>{shop.name}</span>
                        <span className="text-muted-foreground text-xs">• {shop.area}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount Percentage</Label>
              <Select 
                value={sponsorForm.discountPercent} 
                onValueChange={(value) => setSponsorForm({ ...sponsorForm, discountPercent: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 12, 15, 18, 20, 25, 30].map(percent => (
                    <SelectItem key={percent} value={percent.toString()}>
                      {percent}% OFF
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Area (Hybrid Pricing)</Label>
              <Select 
                value={sponsorForm.area} 
                onValueChange={(value) => setSponsorForm({ ...sponsorForm, area: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area for pricing" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {area}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Discount will apply for orders from this area
              </p>
            </div>

            <Button onClick={handleAssignSponsor} className="w-full" variant="hero">
              <CheckCircle className="w-4 h-4" />
              {selectedProduct?.sponsor ? "Update Sponsor" : "Assign Sponsor"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
