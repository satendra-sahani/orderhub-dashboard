import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserAuth } from "./UserAuthContext";
import { User, LogOut, Package, Phone, UserCircle } from "lucide-react";
import { toast } from "sonner";

interface UserLoginSheetProps {
  onViewOrders: () => void;
}

const UserLoginSheet = ({ onViewOrders }: UserLoginSheetProps) => {
  const { user, isLoggedIn, login, logout } = useUserAuth();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    if (!phone || !name) {
      toast.error("Please enter your name and phone number");
      return;
    }
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    login(phone, name);
    toast.success(`Welcome, ${name}!`);
    setPhone("");
    setName("");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setIsOpen(false);
  };

  const handleViewOrders = () => {
    setIsOpen(false);
    onViewOrders();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {isLoggedIn ? (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
          ) : (
            <User className="w-5 h-5 text-foreground" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-lg font-bold">
            {isLoggedIn ? "My Account" : "Login"}
          </SheetTitle>
        </SheetHeader>

        {isLoggedIn && user ? (
          <div className="mt-6 space-y-5">
            {/* User Info */}
            <div className="bg-secondary rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
                onClick={handleViewOrders}
              >
                <Package className="w-5 h-5 text-primary" />
                My Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:border-destructive/50"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <p className="text-sm text-muted-foreground">
              Login to track your orders and checkout faster
            </p>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="userName" className="text-sm">Name</Label>
                <Input
                  id="userName"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="userPhone" className="text-sm">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="userPhone"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleLogin} className="w-full h-11 bg-primary hover:bg-primary/90">
              Continue
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserLoginSheet;
