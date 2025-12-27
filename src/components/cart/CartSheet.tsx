// src/components/cart/CartSheet.tsx
"use client";

import { useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCart } from "./CartContext";

import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Zap,
} from "lucide-react";

import { toast } from "sonner";

const API_BASE = "https://orderhai-be.vercel.app";

interface Address {
  _id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

interface MeResponse {
  id: string;
  phone: string;
  name?: string;
  addresses: Address[];
}

const CartSheet = () => {
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    updateQty,
    removeItem,
    clear,
    applyCoupon,
    appliedCoupon,
    placeOrder,
  } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  const [me, setMe] = useState<MeResponse | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string | "other">(
    ""
  );

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [location, setLocation] = useState<{
    lat?: number;
    lng?: number;
  }>({});

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const loadMe = async () => {
      if (!isOpen || !token) return;
      setIsUserLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
          setMe(null);
          return;
        }
        const data: MeResponse = await res.json();
        setMe(data);

        const defaultAddr =
          data.addresses.find((a) => a.isDefault) || data.addresses[0];

        setCustomerDetails((prev) => ({
          ...prev,
          name: prev.name || data.name || "",
          phone: prev.phone || data.phone || "",
          address:
            prev.address ||
            (defaultAddr ? `${defaultAddr.line1}, ${defaultAddr.city}` : ""),
        }));

        setSelectedAddressId(
          defaultAddr
            ? defaultAddr._id
            : data.addresses.length
              ? "other"
              : "other"
        );

        if (defaultAddr?.latitude && defaultAddr?.longitude) {
          setLocation({
            lat: defaultAddr.latitude,
            lng: defaultAddr.longitude,
          });
        } else {
          setLocation({});
        }
      } catch {
        setMe(null);
      } finally {
        setIsUserLoading(false);
      }
    };
    loadMe();
  }, [isOpen, token]);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setShowCheckout(true);
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (!ok) {
      setCouponError("Invalid coupon code");
      toast.error("Invalid coupon code");
    } else {
      setCouponError(null);
      toast.success("Coupon applied");
    }
  };

  const captureGpsLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("GPS not available in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        toast.success("Location captured");
      },
      (err) => {
        console.error("Geolocation error", err);
        toast.error("Please enable GPS / location permission");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handlePlaceOrder = async () => {
    if (!customerDetails.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (
      !customerDetails.phone.trim() ||
      customerDetails.phone.length < 10
    ) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!customerDetails.address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    let addressToUse = customerDetails.address.trim();

    if (token && me) {
      try {
        if (selectedAddressId === "other") {
          const payload: any = {
            label: "Cart Address",
            line1: customerDetails.address.trim(),
            city: "Your city",
            isDefault: !me.addresses.length,
          };

          if (location.lat && location.lng) {
            payload.latitude = location.lat;
            payload.longitude = location.lng;
          }

          const res = await fetch(`${API_BASE}/api/users/addresses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const data = await res.json();
            toast.error(data.message || "Failed to save address");
          } else {
            const meRes = await fetch(`${API_BASE}/api/users/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const meData: MeResponse = await meRes.json();
            setMe(meData);
          }
        } else if (selectedAddressId) {
          const addr = me.addresses.find(
            (a) => a._id === selectedAddressId
          );
          if (addr) {
            addressToUse = `${addr.line1}, ${addr.city}`;
            if (addr.latitude && addr.longitude) {
              setLocation({
                lat: addr.latitude,
                lng: addr.longitude,
              });
            }
          }
        }
      } catch {
        toast.error("Network error while saving address");
        return;
      }
    }

    const order = await placeOrder({
      paymentMethod,
      address: addressToUse,
      phone: customerDetails.phone.trim(),
      name: customerDetails.name.trim(),
      notes: customerDetails.notes.trim(),
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    });

    if (!order) {
      toast.error("Unable to place order");
      return;
    }

    toast.success(
      `Order placed successfully! Delivery in 10-15 mins (ID: ${order.id})`
    );

    await clear();
    setShowCheckout(false);
    setCustomerDetails({
      name: "",
      phone: "",
      address: "",
      notes: "",
    });
    setCouponInput("");
    setCouponError(null);
    setLocation({});
    setIsOpen(false);
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          data-cart-trigger
          variant="default"
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full px-4 py-2 shadow-lg"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 ? (
            <>
              <span>{totalItems} items</span>
              <span className="h-4 w-px bg-white/40" />
              <span>₹{total.toFixed(2)}</span>
            </>
          ) : (
            <span>Cart</span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center gap-2">
          {showCheckout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCheckout(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <SheetTitle>
            {showCheckout ? "Checkout" : "Your Cart"}
          </SheetTitle>
        </SheetHeader>

        {/* Outer container: fixed height, inner scroll */}
        <div className="mt-4 flex h-[calc(100vh-6rem)] flex-col gap-4">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/70" />
                <p className="font-medium">Your cart is empty</p>
                <p className="text-xs">Add items to get started</p>
              </div>
            ) : showCheckout ? (
              <>
                {/* Delivery Time Banner */}
                <div className="rounded-lg bg-primary/5 p-3 text-xs text-primary">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <div>
                      <p className="font-semibold">
                        Delivery in 10-15 mins
                      </p>
                      <p className="text-[11px] text-primary/80">
                        Free delivery on orders above ₹199
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-3 rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold">Order Summary</p>
                    <p className="text-xs text-muted-foreground">
                      {totalItems} items
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            × {item.qty}
                          </span>
                        </div>
                        <span className="font-medium">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 space-y-1 border-t pt-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Subtotal
                      </span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Delivery fee
                      </span>
                      <span>
                        {deliveryFee > 0
                          ? `₹${deliveryFee.toFixed(2)}`
                          : "Free"}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>Coupon ({appliedCoupon})</span>
                        <span>Applied</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon */}
                <div className="space-y-2 rounded-lg border bg-card p-3">
                  <p className="text-xs font-semibold">
                    Offers & Coupons
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter coupon code"
                      className="h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-destructive">
                      {couponError}
                    </p>
                  )}
                  {!appliedCoupon && !couponError && (
                    <p className="text-[11px] text-muted-foreground">
                      Try{" "}
                      <span className="font-semibold">
                        ORDERHAI50
                      </span>{" "}
                      for ₹50 off.
                    </p>
                  )}
                </div>

                {/* Delivery Details Form */}
                <div className="space-y-3 rounded-lg border bg-card p-3">
                  <p className="text-sm font-semibold">
                    Delivery Details
                  </p>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-xs">
                      <User className="h-3 w-3" /> Name *
                    </Label>
                    <Input
                      value={customerDetails.name}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          name: e.target.value,
                        })
                      }
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-xs">
                      <Phone className="h-3 w-3" /> Phone *
                    </Label>
                    <Input
                      value={customerDetails.phone}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          phone: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10),
                        })
                      }
                      className="h-9 text-sm"
                    />
                  </div>

                  {me && me.addresses.length > 0 && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-xs">
                        <MapPin className="h-3 w-3" /> Saved addresses
                      </Label>
                      <div className="space-y-1 text-xs">
                        {me.addresses.map((addr) => (
                          <button
                            key={addr._id}
                            type="button"
                            onClick={() => {
                              setSelectedAddressId(addr._id);
                              setCustomerDetails((prev) => ({
                                ...prev,
                                address: `${addr.line1}, ${addr.city}`,
                              }));
                              if (
                                addr.latitude &&
                                addr.longitude
                              ) {
                                setLocation({
                                  lat: addr.latitude,
                                  lng: addr.longitude,
                                });
                              } else {
                                setLocation({});
                              }
                            }}
                            className={`w-full rounded-md border px-2 py-1 text-left ${selectedAddressId === addr._id
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/20"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-emerald-600">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {addr.line1}, {addr.city}
                            </div>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAddressId("other");
                            setLocation({});
                          }}
                          className={`w-full rounded-md border px-2 py-1 text-left ${selectedAddressId === "other"
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/20"
                            }`}
                        >
                          <span className="text-xs font-medium">
                            Other address
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" /> Address *
                    </Label>
                    <Textarea
                      value={customerDetails.address}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          address: e.target.value,
                        })
                      }
                      rows={2}
                      className="resize-none text-xs"
                    />
                    {selectedAddressId === "other" && (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[11px] text-muted-foreground">
                          Enable GPS for accurate delivery location.
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px]"
                          onClick={captureGpsLocation}
                        >
                          Use GPS location
                        </Button>
                      </div>
                    )}
                    {isUserLoading && (
                      <p className="text-[11px] text-muted-foreground">
                        Loading saved addresses...
                      </p>
                    )}
                    {location.lat && location.lng && (
                      <p className="text-[11px] text-emerald-600">
                        Location set: {location.lat.toFixed(5)},{" "}
                        {location.lng.toFixed(5)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">
                      Instructions (Optional)
                    </Label>
                    <Input
                      value={customerDetails.notes}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          notes: e.target.value,
                        })
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2 rounded-lg border bg-card p-3 text-xs">
                  <p className="text-sm font-semibold">
                    Payment Method
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={
                        paymentMethod === "COD"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() => setPaymentMethod("COD")}
                    >
                      Cash on Delivery
                    </Button>
                    <Button
                      type="button"
                      variant={
                        paymentMethod === "ONLINE"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() => setPaymentMethod("ONLINE")}
                    >
                      Online Payment
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Cart view */}
                <div className="flex-1 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {item.name}
                        </span>
                        {item.variantName && (
                          <span className="text-[11px] text-muted-foreground">
                            {item.variantName}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-primary">
                          ₹{item.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>

                        <div className="flex items-center gap-1 rounded-full border px-2 py-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQty(item.id, item.qty - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs font-medium">
                            {item.qty}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQty(item.id, item.qty + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 rounded-lg border bg-card p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Subtotal
                    </span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Delivery fee
                    </span>
                    <span>
                      {deliveryFee > 0
                        ? `₹${deliveryFee.toFixed(2)}`
                        : "Free"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Fixed footer buttons */}
          {items.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background pt-2 px-4 pb-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              {showCheckout ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                >
                  Place Order • ₹{total.toFixed(2)}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed • ₹{total.toFixed(2)}
                </Button>
              )}
            </div>
          )}

        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
