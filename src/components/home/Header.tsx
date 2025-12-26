// src/components/home/Header.tsx
"use client"

import { useEffect, useState } from "react"
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingCart,
  Heart,
  ListChecks,
  Phone,
  User2,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CartSheet from "@/components/cart/CartSheet"
import { useCart } from "@/components/cart/CartContext"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useFavorites } from "@/hooks/useFavorites"

interface HeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onViewOrders: () => void
}

const API_BASE = "http://localhost:9001"

interface Address {
  _id: string
  label: string
  line1: string
  line2?: string
  city: string
  state?: string
  pincode?: string
  latitude?: number
  longitude?: number
  isDefault: boolean
}

interface MeResponse {
  id: string
  phone: string
  name?: string
  lastLoginAt?: string
  addresses: Address[]
}

const Header = ({ searchTerm, onSearchChange, onViewOrders }: HeaderProps) => {
  const { items } = useCart()
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)

  // favourites: same style as cart
  const { favoriteIds } = useFavorites()
  const favouritesCount = favoriteIds.length

  // login + account sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [step, setStep] = useState<"phone" | "otp" | "account">("phone")

  // OTP login state
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // profile state
  const [me, setMe] = useState<MeResponse | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [isSavingName, setIsSavingName] = useState(false)

  // change-phone state
  const [isChangingPhone, setIsChangingPhone] = useState(false)
  const [newPhone, setNewPhone] = useState("")
  const [newPhoneOtp, setNewPhoneOtp] = useState("")
  const [phoneStep, setPhoneStep] = useState<"enter" | "otp">("enter")
  const [isPhoneUpdating, setIsPhoneUpdating] = useState(false)

  // address state
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressLabel, setAddressLabel] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressCity, setAddressCity] = useState("")
  const [addressIsDefault, setAddressIsDefault] = useState(false)
  const [addressLat, setAddressLat] = useState<number | null>(null)
  const [addressLng, setAddressLng] = useState<number | null>(null)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  const openCart = () => {
    const btn =
      document.querySelector<HTMLButtonElement>("[data-cart-trigger]")
    btn?.click()
  }

  const resetLoginState = () => {
    setStep(token ? "account" : "phone")
    setPhone("")
    setOtp("")
    setIsLoading(false)
  }

  const resetAddressForm = () => {
    setEditingAddress(null)
    setAddressLabel("")
    setAddressLine1("")
    setAddressCity("")
    setAddressIsDefault(false)
    setAddressLat(null)
    setAddressLng(null)
    setIsSavingAddress(false)
    setIsLocating(false)
  }

  const resetChangePhone = () => {
    setIsChangingPhone(false)
    setNewPhone("")
    setNewPhoneOtp("")
    setPhoneStep("enter")
    setIsPhoneUpdating(false)
  }

  const handleSheetChange = (open: boolean) => {
    if (!open) {
      resetLoginState()
      setMe(null)
      resetAddressForm()
      resetChangePhone()
    }
    setIsSheetOpen(open)
  }

  // load /me ONCE on mount if token exists
  useEffect(() => {
    const loadMeOnMount = async () => {
      if (!token) return
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
          }
          return
        }
        const data: MeResponse = await res.json()
        setMe(data)
        setNameInput(data.name || "")
        setStep("account")
      } catch {
        // silent
      }
    }

    loadMeOnMount()
  }, [token])

  // keep: load /me when account sheet is opened / step changes
  useEffect(() => {
    const loadMe = async () => {
      if (!token || step !== "account") return
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            setStep("phone")
            toast.error("Session expired, login again")
            return
          }
          throw new Error(await res.text())
        }
        const data: MeResponse = await res.json()
        setMe(data)
        setNameInput(data.name || "")
      } catch {
        toast.error("Failed to load profile")
      }
    }

    loadMe()
  }, [step, token])

  const handleOpenSheet = () => {
    if (token) setStep("account")
    else setStep("phone")
    setIsSheetOpen(true)
  }

  // ===== OTP LOGIN =====
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !/^\d{10}$/.test(phone)) {
      toast.error("Enter valid 10-digit phone number")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || "OTP sent successfully!")
        setStep("otp")
        setTimeout(() => {
          const otpInput = document.getElementById(
            "header-otp",
          ) as HTMLInputElement | null
          otpInput?.focus()
        }, 100)
      } else {
        toast.error(data.message || "Failed to send OTP")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        toast.success(
          `Welcome back, ${data.user.name || data.user.phone}!`,
        )
        setStep("account")
      } else {
        toast.error(data.message || "Invalid OTP")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = () => {
    setOtp("")
    setStep("phone")
    toast.info("Enter phone number again")
  }

  // ===== PROFILE & ADDRESS =====
  const handleSaveName = async () => {
    if (!token || !nameInput.trim()) return
    setIsSavingName(true)
    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nameInput.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to update name")
        return
      }
      toast.success("Name updated")
      setMe(prev =>
        prev ? { ...prev, name: nameInput.trim() } : prev,
      )
    } catch {
      toast.error("Network error while updating name")
    } finally {
      setIsSavingName(false)
    }
  }

  const openAddAddress = () => {
    resetAddressForm()
  }

  const openEditAddress = (addr: Address) => {
    setEditingAddress(addr)
    setAddressLabel(addr.label)
    setAddressLine1(addr.line1)
    setAddressCity(addr.city)
    setAddressIsDefault(addr.isDefault)
    setAddressLat(addr.latitude ?? null)
    setAddressLng(addr.longitude ?? null)
  }

  const handleUseGps = () => {
    if (typeof window === "undefined") {
      toast.error("Location only works in browser")
      return
    }
    if (!("geolocation" in navigator)) {
      toast.error("Location not supported in this browser")
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setAddressLat(pos.coords.latitude)
        setAddressLng(pos.coords.longitude)
        setIsLocating(false)
        toast.success("Location captured")
      },
      err => {
        setIsLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Please allow location permission in browser")
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          toast.error("Location unavailable. Check GPS / network")
        } else if (err.code === err.TIMEOUT) {
          toast.error("Location request timed out")
        } else {
          toast.error("Unable to get location")
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    )
  }

  const handleSaveAddress = async () => {
    if (!token) return
    if (
      !addressLabel.trim() ||
      !addressLine1.trim() ||
      !addressCity.trim()
    ) {
      toast.error("Fill label, line1 and city")
      return
    }
    setIsSavingAddress(true)
    const payload: any = {
      label: addressLabel.trim(),
      line1: addressLine1.trim(),
      city: addressCity.trim(),
      isDefault: addressIsDefault,
    }

    if (addressLat != null && addressLng != null) {
      payload.latitude = addressLat
      payload.longitude = addressLng
    }

    try {
      const url = editingAddress
        ? `${API_BASE}/api/users/addresses/${editingAddress._id}`
        : `${API_BASE}/api/users/addresses`
      const method = editingAddress ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to save address")
        return
      }
      toast.success(
        editingAddress ? "Address updated" : "Address added",
      )
      const meRes = await fetch(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const meData: MeResponse = await meRes.json()
      setMe(meData)
      resetAddressForm()
    } catch {
      toast.error("Network error while saving address")
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (addr: Address) => {
    if (!token) return
    if (!confirm("Delete this address?")) return
    try {
      const res = await fetch(
        `${API_BASE}/api/users/addresses/${addr._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.message || "Failed to delete address")
        return
      }
      toast.success("Address deleted")
      setMe(prev =>
        prev
          ? {
              ...prev,
              addresses: prev.addresses.filter(
                a => a._id !== addr._id,
              ),
            }
          : prev,
      )
    } catch {
      toast.error("Network error while deleting address")
    }
  }

  // ===== CHANGE PHONE =====
  const handleSendChangePhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPhone || !/^\d{10}$/.test(newPhone)) {
      toast.error("Enter valid 10-digit new phone")
      return
    }
    if (!me) {
      toast.error("Profile not loaded. Try again.")
      return
    }
    setIsPhoneUpdating(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: newPhone,
          oldPhone: me.phone,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || "OTP sent to new phone")
        setPhoneStep("otp")
        setTimeout(() => {
          const el = document.getElementById(
            "change-phone-otp",
          ) as HTMLInputElement | null
          el?.focus()
        }, 100)
      } else {
        toast.error(data.message || "Failed to send OTP")
      }
    } catch {
      toast.error("Network error while sending OTP")
    } finally {
      setIsPhoneUpdating(false)
    }
  }

  const handleVerifyChangePhoneOtp = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()
    if (!newPhoneOtp || newPhoneOtp.length !== 6) {
      toast.error("Enter valid 6-digit OTP")
      return
    }
    if (!token || !me) {
      toast.error("Login again to update phone")
      return
    }
    setIsPhoneUpdating(true)
    try {
      const verifyRes = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: newPhone,
          otp: newPhoneOtp,
          oldPhone: me.phone,
        }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) {
        toast.error(
          verifyData.message || "Invalid OTP for new phone",
        )
        setIsPhoneUpdating(false)
        return
      }

      const updateRes = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: newPhone }),
      })
      const updateData = await updateRes.json()
      if (!updateRes.ok) {
        toast.error(
          updateData.message || "Failed to update phone",
        )
        setIsPhoneUpdating(false)
        return
      }

      const meRes = await fetch(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const meData: MeResponse = await meRes.json()
      setMe(meData)
      resetChangePhone()
      toast.success("Mobile number updated")
    } catch {
      toast.error("Network error while updating phone")
    } finally {
      setIsPhoneUpdating(false)
    }
  }

  // Derived UI helpers
  const displayName =
    me?.name?.trim() ||
    (me?.phone
      ? `+91 ${me.phone.slice(-4).padStart(10, "•")}`
      : "")

  const defaultAddress =
    me?.addresses.find(a => a.isDefault) || me?.addresses[0]

  const displayAddress = defaultAddress
    ? `${defaultAddress.label} • ${defaultAddress.line1}, ${defaultAddress.city}`
    : "Deliver to Home"

  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-0 z-40 w-full bg-white">
        <div className="mx-auto max-w-5xl px-3 pt-2 pb-3 space-y-3 sm:px-4">
          {/* Top row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-1"
              >
                <span className="text-base font-extrabold text-primary sm:text-lg">
                  order
                </span>
                <span className="text-base font-extrabold text-amber-400 sm:text-lg">
                  hai
                </span>
              </Link>

              {/* Location pill */}
              <button
                type="button"
                className="hidden max-w-[220px] items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm sm:flex"
              >
                <MapPin className="h-3 w-3 text-primary" />
                <span className="truncate text-left">
                  {displayAddress}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            {/* right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="hidden max-w-[120px] truncate text-right text-[11px] text-muted-foreground sm:inline-block">
                  {displayName ? `Hi, ${displayName}` : ""}
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                {/* Favourites with realtime count */}
                <Link to="/favourites">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 rounded-full border sm:h-9 sm:w-9"
                    title="Favourites"
                  >
                    <Heart className="h-4 w-4" />
                    {favouritesCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                        {favouritesCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* My orders */}
                <Link to="/my-orders">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full border sm:h-9 sm:w-9"
                  // onClick={()=>{
                  //   navigate("/my-orders")
                  // }}
                  title="My orders"
                >
                  <ListChecks className="h-4 w-4" />
                </Button>
</Link>
                {/* Cart */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full border sm:h-9 sm:w-9"
                  onClick={openCart}
                  title="Cart"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {totalItems}
                    </span>
                  )}
                </Button>

                {/* Account */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full border sm:h-9 sm:w-9"
                  onClick={handleOpenSheet}
                  title="Account"
                >
                  <User2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className="flex items-center justify-between rounded-xl bg-primary px-3 py-2 text-[11px] text-primary-foreground shadow-sm sm:text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base leading-none sm:text-lg">
                ⚡
              </span>
              <div className="leading-tight">
                <p className="font-semibold">
                  Delivery in 10–15 minutes
                </p>
                <p className="text-[10px] text-primary-foreground/90 sm:text-[11px]">
                  Free delivery on orders above ₹199
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search for food or groceries"
                className="h-9 w-full rounded-full pl-9 text-sm sm:h-10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Cart sheet at root */}
      <CartSheet />

      {/* Account / login sheet */}
      <Sheet open={isSheetOpen} onOpenChange={handleSheetChange}>
        <SheetContent side="right" className="w-full max-w-sm">
          <SheetHeader>
            <SheetTitle className="text-base">
              {step === "phone"
                ? "Sign in"
                : step === "otp"
                ? "Enter OTP"
                : "My Account"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {step === "phone"
                ? "Enter your phone number to receive OTP"
                : step === "otp"
                ? `OTP sent to +91 ${phone.slice(-4)}****`
                : me
                ? `Logged in as +91 ${me.phone}`
                : ""}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-6">
            {/* PHONE STEP */}
            {step === "phone" && (
              <form
                onSubmit={handleSendOtp}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="header-phone"
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="header-phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={e =>
                      setPhone(
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    maxLength={10}
                    className="h-11 text-base"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="h-11 w-full text-sm"
                  disabled={isLoading || phone.length !== 10}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            )}

            {/* OTP STEP */}
            {step === "otp" && (
              <form
                onSubmit={handleVerifyOtp}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="header-otp"
                    className="text-sm"
                  >
                    Enter OTP
                  </Label>
                  <Input
                    id="header-otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={e =>
                      setOtp(
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    maxLength={6}
                    className="h-11 text-lg text-center tracking-[0.3em]"
                    required
                  />
                  <p className="text-center text-[11px] text-muted-foreground">
                    Did not receive?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="font-medium text-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="h-11 w-full text-sm"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  ) : (
                    "Verify & Login"
                  )}
                </Button>
              </form>
            )}

            {/* ACCOUNT STEP */}
            {step === "account" && me && (
              <div className="space-y-5">
                {/* Profile */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Profile
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={nameInput}
                      onChange={e =>
                        setNameInput(e.target.value)
                      }
                      placeholder="Your name"
                      className="h-9 text-sm"
                    />
                    <Button
                      size="sm"
                      className="h-9 px-3 text-xs"
                      onClick={handleSaveName}
                      disabled={
                        isSavingName || !nameInput.trim()
                      }
                    >
                      {isSavingName ? "Saving..." : "Save"}
                    </Button>
                  </div>

                  {!isChangingPhone ? (
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Phone: +91 {me.phone}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPhone(true)
                          setPhoneStep("enter")
                          setNewPhone("")
                          setNewPhoneOtp("")
                        }}
                        className="font-medium text-primary hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 rounded-md border px-2.5 py-2 text-[11px]">
                      {phoneStep === "enter" && (
                        <form
                          onSubmit={handleSendChangePhoneOtp}
                          className="space-y-2"
                        >
                          <Label
                            htmlFor="change-phone"
                            className="text-[11px] text-muted-foreground"
                          >
                            New mobile number
                          </Label>
                          <Input
                            id="change-phone"
                            type="tel"
                            placeholder="New 10-digit mobile"
                            value={newPhone}
                            onChange={e =>
                              setNewPhone(
                                e.target.value.replace(
                                  /\D/g,
                                  "",
                                ),
                              )
                            }
                            maxLength={10}
                            className="h-8 text-xs"
                          />
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              size="sm"
                              className="h-8 flex-1 text-[11px]"
                              disabled={
                                isPhoneUpdating ||
                                newPhone.length !== 10
                              }
                            >
                              {isPhoneUpdating
                                ? "Sending..."
                                : "Send OTP"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 flex-1 text-[11px]"
                              onClick={resetChangePhone}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}

                      {phoneStep === "otp" && (
                        <form
                          onSubmit={handleVerifyChangePhoneOtp}
                          className="space-y-2"
                        >
                          <Label
                            htmlFor="change-phone-otp"
                            className="text-[11px] text-muted-foreground"
                          >
                            OTP sent to +91 {newPhone}
                          </Label>
                          <Input
                            id="change-phone-otp"
                            type="text"
                            placeholder="123456"
                            value={newPhoneOtp}
                            onChange={e =>
                              setNewPhoneOtp(
                                e.target.value.replace(
                                  /\D/g,
                                  "",
                                ),
                              )
                            }
                            maxLength={6}
                            className="h-8 text-sm text-center tracking-[0.3em]"
                          />
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              size="sm"
                              className="h-8 flex-1 text-[11px]"
                              disabled={
                                isPhoneUpdating ||
                                newPhoneOtp.length !== 6
                              }
                            >
                              {isPhoneUpdating
                                ? "Verifying..."
                                : "Verify & Update"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 flex-1 text-[11px]"
                              onClick={resetChangePhone}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                {/* Addresses */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase text-muted-foreground">
                      Addresses
                    </Label>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={openAddAddress}
                      title="Add address"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {me.addresses.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      No addresses yet. Add one to get faster
                      checkout.
                    </p>
                  )}

                  <div className="space-y-2">
                    {me.addresses.map(addr => (
                      <div
                        key={addr._id}
                        className="flex items-start justify-between gap-2 rounded-md border px-3 py-2 text-xs"
                      >
                        <div>
                          <p className="font-medium">
                            {addr.label}
                            {addr.isDefault && (
                              <span className="ml-1 text-[10px] text-emerald-600">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="text-muted-foreground">
                            {addr.line1}
                          </p>
                          <p className="text-muted-foreground">
                            {addr.city}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              openEditAddress(addr)
                            }
                            title="Edit"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() =>
                              handleDeleteAddress(addr)
                            }
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add / Edit + GPS */}
                <div className="space-y-2 border-t pt-3">
                  <Label className="text-xs uppercase text-muted-foreground">
                    {editingAddress
                      ? "Edit address"
                      : "Add new address"}
                  </Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Label (Home, Office)"
                      value={addressLabel}
                      onChange={e =>
                        setAddressLabel(e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                    <Input
                      placeholder="Line 1"
                      value={addressLine1}
                      onChange={e =>
                        setAddressLine1(e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                    <Input
                      placeholder="City"
                      value={addressCity}
                      onChange={e =>
                        setAddressCity(e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex flex-col">
                        <span>
                          {addressLat != null &&
                          addressLng != null
                            ? `Lat: ${addressLat.toFixed(
                                4,
                              )}, Lng: ${addressLng.toFixed(4)}`
                            : "No GPS location set"}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-[11px]"
                        onClick={handleUseGps}
                        disabled={isLocating}
                      >
                        {isLocating ? "Locating..." : "Use GPS"}
                      </Button>
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={addressIsDefault}
                        onChange={e =>
                          setAddressIsDefault(e.target.checked)
                        }
                        className="h-3 w-3"
                      />
                      Set as default address
                    </label>
                    <div className="flex gap-2">
                      <Button
                        className="h-9 flex-1 text-xs"
                        onClick={handleSaveAddress}
                        disabled={isSavingAddress}
                      >
                        {isSavingAddress
                          ? "Saving..."
                          : editingAddress
                          ? "Update"
                          : "Add"}
                      </Button>
                      {editingAddress && (
                        <Button
                          variant="outline"
                          className="h-9 flex-1 text-xs"
                          onClick={resetAddressForm}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-center text-[11px] text-muted-foreground">
                  For demo: use any 10-digit phone → any 6-digit
                  OTP
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Header
