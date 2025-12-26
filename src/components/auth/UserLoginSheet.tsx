// src/components/auth/UserLoginSheet.tsx
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useUserAuth } from "./UserAuthContext"
import {
  User,
  LogOut,
  Package,
  Phone,
  UserCircle,
  MapPin,
} from "lucide-react"
import { toast } from "sonner"

interface UserLoginSheetProps {
  onViewOrders: () => void
}

type Step = "PHONE" | "OTP" | "DETAILS"

const DEMO_OTP = "1234"

const UserLoginSheet = ({ onViewOrders }: UserLoginSheetProps) => {
  const { user, isLoggedIn, login, logout } = useUserAuth()

  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>("PHONE")

  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  const resetState = () => {
    setStep("PHONE")
    setPhone("")
    setOtp("")
    setName("")
    setAddress("")
  }

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number")
      return
    }
    // In real app: call backend to send OTP
    toast.success(`OTP sent to ${phone}. Use ${DEMO_OTP} for demo.`)
    setStep("OTP")
  }

  const handleVerifyOtp = () => {
    if (otp !== DEMO_OTP) {
      toast.error("Invalid OTP")
      return
    }
    setStep("DETAILS")
  }

  const handleCompleteLogin = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name")
      return
    }
    if (!address.trim()) {
      toast.error("Please provide your delivery address")
      return
    }

    let lat: number | undefined
    let lng: number | undefined

    // Try browser GPS once (no blocking)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat = pos.coords.latitude
          lng = pos.coords.longitude
          login({ phone, name: name.trim(), address: address.trim(), lat, lng })
        },
        () => {
          login({ phone, name: name.trim(), address: address.trim() })
        },
        { enableHighAccuracy: true, timeout: 5000 },
      )
    } else {
      login({ phone, name: name.trim(), address: address.trim() })
    }

    toast.success(`Welcome, ${name.trim()}!`)
    resetState()
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    setIsOpen(false)
    resetState()
  }

  const handleViewOrders = () => {
    setIsOpen(false)
    onViewOrders()
  }

  const renderContent = () => {
    if (isLoggedIn && user) {
      return (
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserCircle className="h-6 w-6" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.phone}</p>
              {user.address && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {user.address}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 text-sm">
            <Button
              variant="outline"
              className="flex w-full items-center justify-between"
              onClick={handleViewOrders}
            >
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                My Orders
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex w-full items-center justify-between"
              onClick={handleLogout}
            >
              <span className="flex items-center gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                Logout
              </span>
            </Button>
          </div>
        </div>
      )
    }

    // Not logged in: show multi-step flow like mobile app
    return (
      <div className="space-y-4 text-sm">
        <p className="text-xs text-muted-foreground">
          Login to track your orders and checkout faster.
        </p>

        {step === "PHONE" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone Number
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  +91
                </span>
                <Input
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="Enter your phone"
                  className="h-10 pl-10 text-sm"
                />
              </div>
            </div>

            <Button className="w-full" onClick={handleSendOtp}>
              Continue
            </Button>
          </div>
        )}

        {step === "OTP" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Enter OTP</Label>
              <Input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="4-digit OTP"
                className="h-10 text-center tracking-[0.3em]"
              />
              <p className="text-[11px] text-muted-foreground">
                Demo mode: use <span className="font-semibold">{DEMO_OTP}</span>.
              </p>
            </div>
            <Button className="w-full" onClick={handleVerifyOtp}>
              Verify OTP
            </Button>
          </div>
        )}

        {step === "DETAILS" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3" /> Delivery Address
              </Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Use GPS or type your address"
                className="h-10 text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 text-[11px]"
                onClick={() => {
                  if (!("geolocation" in navigator)) {
                    toast.error("GPS not available in this browser")
                    return
                  }
                  navigator.geolocation.getCurrentPosition(
                    () => {
                      toast.success("Location captured via GPS")
                    },
                    () => {
                      toast.error("Unable to get GPS location")
                    },
                    { enableHighAccuracy: true, timeout: 5000 },
                  )
                }}
              >
                Use current location
              </Button>
            </div>

            <Button className="w-full" onClick={handleCompleteLogin}>
              Save & Continue
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open && !isLoggedIn) resetState()
    }}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
          <User className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{isLoggedIn ? "My Account" : "Login"}</SheetTitle>
        </SheetHeader>
        <div className="mt-4">{renderContent()}</div>
      </SheetContent>
    </Sheet>
  )
}

export default UserLoginSheet
