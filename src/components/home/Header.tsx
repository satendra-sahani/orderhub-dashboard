import { MapPin, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartSheet from "@/components/cart/CartSheet";
import UserLoginSheet from "@/components/auth/UserLoginSheet";
import { Link } from "react-router-dom";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewOrders: () => void;
}

const Header = ({ searchTerm, onSearchChange, onViewOrders }: HeaderProps) => {
  return (
    <>
      {/* Delivery Banner */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          ⚡ Delivery in <strong>10-15 minutes</strong> • Free delivery on orders above ₹199
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo & Location */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">O</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-foreground">orderhai</span>
              </div>
            </Link>

            {/* Location Picker */}
            <button className="hidden md:flex items-center gap-1 text-foreground hover:text-primary transition-colors">
              <MapPin className="w-4 h-4 text-primary" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Delivery to</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  North Village
                  <ChevronDown className="w-3 h-3" />
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-10 bg-secondary border-0 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <UserLoginSheet onViewOrders={onViewOrders} />
            <CartSheet />
            <Link to="/login" className="hidden md:block">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
