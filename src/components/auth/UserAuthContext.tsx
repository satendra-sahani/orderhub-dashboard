"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  // address can be plain string; matches how CartSheet saves it
  address?: string
}

interface UserAuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (phone: string, name: string) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(
  undefined,
)

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null
    const saved = localStorage.getItem("orderhai_user")
    return saved ? JSON.parse(saved) : null
  })

  const login = (phone: string, name: string) => {
    const newUser: User = {
      id: `USR${Date.now()}`,
      name,
      phone,
    }
    setUser(newUser)
    localStorage.setItem("orderhai_user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("orderhai_user")
    }
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("orderhai_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = () => {
  const context = useContext(UserAuthContext)
  if (!context) {
    throw new Error("useUserAuth must be used within UserAuthProvider")
  }
  return context
}
