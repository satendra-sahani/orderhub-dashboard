import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "./CartContext";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, MapPin, Phone, User, Zap } from "lucide-react";
import { toast } from "sonner";

const CartSheet = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    if (!customerDetails.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!customerDetails.phone.trim() || customerDetails.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!customerDetails.address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    toast.success("Order placed successfully! Delivery in 10-15 mins");
    clearCart();
    setShowCheckout(false);
    setCustomerDetails({ name: "", phone: "", address: "", notes: "" });
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="default" 
          size="default" 
          className="relative gap-2 bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="w-4 h-4" />
          {totalItems > 0 ? (
            <>
              <span className="hidden sm:inline font-medium">{totalItems} items</span>
              <span className="font-bold">₹{totalPrice}</span>
            </>
          ) : (
            <span className="hidden sm:inline">Cart</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            {showCheckout && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowCheckout(false)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {showCheckout ? "Checkout" : "Your Cart"}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col overflow-hidden mt-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">Add items to get started</p>
            </div>
          ) : showCheckout ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-5 pr-2">
                {/* Delivery Time Banner */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Delivery in 10-15 mins</p>
                    <p className="text-xs text-muted-foreground">Free delivery on orders above ₹199</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground text-sm">Order Summary</h3>
                  <div className="bg-secondary rounded-lg p-3 space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-muted-foreground"> × {item.quantity}</span>
                        </div>
                        <span className="font-medium text-foreground">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="font-bold text-primary">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Details Form */}
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground text-sm">Delivery Details</h3>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs flex items-center gap-1">
                      <User className="w-3 h-3" /> Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Address *
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Complete address with landmark"
                      value={customerDetails.address}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                      rows={2}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs">Instructions (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="e.g., Less spicy"
                      value={customerDetails.notes}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handlePlaceOrder}
                >
                  Place Order • ₹{totalPrice}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-secondary rounded-lg p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.variantName}</p>
                      <p className="text-sm text-primary font-semibold mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <div className="flex items-center gap-1 bg-primary rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-primary-foreground hover:bg-primary/80"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center font-medium text-primary-foreground text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-primary-foreground hover:bg-primary/80"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-foreground">₹{totalPrice}</span>
                </div>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleCheckout}
                >
                  Proceed • ₹{totalPrice}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
