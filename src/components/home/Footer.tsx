// src/components/home/Footer.tsx
"use client"

import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-3 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:text-[13px]">
        {/* Brand + line */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
            <span className="text-primary">orderhai</span>
            <span className="text-amber-400">FEAST</span>
          </div>
          <p>Fast delivery of groceries and food in your area.</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/help" className="hover:text-foreground">
            Help & Support
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
