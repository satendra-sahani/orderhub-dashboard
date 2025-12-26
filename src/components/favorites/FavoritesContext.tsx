"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { API_BASE_URL } from "@/components/config"
import { toast } from "sonner"

const API_BASE = API_BASE_URL || "https://orderhai-be.vercel.app"

type FavoritesContextType = {
  favoriteIds: string[]
  isFavorite: (productId: string) => boolean
  toggleFavorite: (productId: string) => Promise<void> | void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
)

export const FavoritesProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  // single hydration
  useEffect(() => {
    const load = async () => {
      if (!token) {
        setFavoriteIds([])
        setLoaded(true)
        return
      }
      try {
        const res = await fetch(
          `${API_BASE}/api/users/favorites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!res.ok) {
          setLoaded(true)
          return
        }
        const data = await res.json()
        const ids = (data || []).map(
          (p: any) => p.id || p._id,
        )
        setFavoriteIds(ids)
      } catch {
        // silent
      } finally {
        setLoaded(true)
      }
    }
    if (!loaded) load()
  }, [token, loaded])

  const isFavorite = (productId: string) =>
    favoriteIds.includes(productId)

  const toggleFavorite = async (productId: string) => {
    if (!token) {
      toast.error("Login to save favourites")
      return
    }
    const already = favoriteIds.includes(productId)
    try {
      if (already) {
        setFavoriteIds(prev =>
          prev.filter(id => id !== productId),
        )
        const res = await fetch(
          `${API_BASE}/api/users/favorites/${productId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!res.ok) {
          const data = await res.json()
          toast.error(
            data.message || "Failed to remove favourite",
          )
        }
      } else {
        setFavoriteIds(prev => [...prev, productId])
        const res = await fetch(
          `${API_BASE}/api/users/favorites/${productId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!res.ok) {
          const data = await res.json()
          toast.error(
            data.message || "Failed to save favourite",
          )
        } else {
          toast.success("Saved to favourites")
        }
      }
    } catch {
      toast.error("Network error for favourite")
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error(
      "useFavorites must be used within FavoritesProvider",
    )
  }
  return ctx
}
