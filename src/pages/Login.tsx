// Login.tsx - Complete with Backend OTP + Token Storage
"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChefHat, ArrowLeft, Eye, EyeOff, Phone } from "lucide-react"
import { toast } from "sonner"

const API_BASE =  "http://localhost:9001"

const Login = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<"phone" | "otp">("phone") // ✅ 2-step OTP flow
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  // ✅ Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !/^\d{10}$/.test(phone)) {
      toast.error("Enter valid 10-digit phone number")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success(data.message || "OTP sent successfully!")
        setStep("otp")
        setOtpSent(true)
        // Auto-focus OTP input
        setTimeout(() => {
          const otpInput = document.getElementById("otp") as HTMLInputElement
          otpInput?.focus()
        }, 100)
      } else {
        toast.error(data.message || "Failed to send OTP")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Step 2: Verify OTP & Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      })

      const data = await response.json()
      
      if (response.ok) {
        // ✅ Save token to localStorage
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        toast.success(`Welcome back, ${data.user.name || data.user.phone}!`)
        navigate("/dashboard")
      } else {
        toast.error(data.message || "Invalid OTP")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Resend OTP
  const handleResendOtp = () => {
    setOtp("")
    setOtpSent(false)
    setStep("phone")
    toast.info("Enter phone number again")
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <ChefHat className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Orderhai</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {step === "phone" ? "Sign in" : "Enter OTP"}
            </h2>
            <p className="text-muted-foreground">
              {step === "phone" 
                ? "Enter your phone number to receive OTP"
                : `OTP sent to +91 ${phone.slice(-4)}****`
              }
            </p>
          </div>

          {/* ✅ Step 1: Phone Number */}
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  className="h-12 text-lg"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full h-12 text-lg"
                disabled={isLoading || phone.length !== 10}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          )}

          {/* ✅ Step 2: OTP Verification */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="h-12 text-lg text-center tracking-widest"
                  autoFocus
                  required
                />
                <p className="text-xs text-muted-foreground text-center">
                  Didn't receive?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-primary hover:underline font-medium"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full h-12 text-lg"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Verify & Login"
                )}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            For demo: Use any 10-digit phone → any 6-digit OTP
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-center text-primary-foreground">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8 animate-float">
            <ChefHat className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Manage Your Orders Efficiently
          </h2>
          <p className="text-primary-foreground/80">
            Track orders, manage inventory, coordinate with delivery partners, 
            and grow your food delivery business.
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
            {["Orders", "Stocks", "Revenue"].map((item) => (
              <div key={item} className="bg-primary-foreground/10 rounded-xl py-3 px-4">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
