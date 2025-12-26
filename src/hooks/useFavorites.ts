// src/hooks/useFavorites.ts
"use client"

import { useEffect, useSyncExternalStore } from "react"
import { toast } from "sonner"

const API_BASE = "http://localhost:9001"

type Listener = () => void

let favoriteIds: string[] = []
let tokenCached: string | null = null
let loadedForToken = false
const listeners = new Set<Listener>()

const subscribe = (listener: Listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const emit = () => {
  for (const l of listeners) l()
}

const getSnapshot = () => favoriteIds

const loadFavoritesOnce = async (token: string | null) => {
  if (!token) {
    favoriteIds = []
    tokenCached = null
    loadedForToken = true
    emit()
    return
  }
  if (loadedForToken && tokenCached === token) return

  tokenCached = token
  loadedForToken = true
  try {
    const res = await fetch(`${API_BASE}/api/users/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return
    const data = await res.json()
    favoriteIds = (data || []).map((p: any) => p.id || p._id)
    emit()
  } catch {
    // silent
  }
}

export const useFavorites = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  const ids = useSyncExternalStore(subscribe, getSnapshot)

  useEffect(() => {
    loadFavoritesOnce(token)
  }, [token])

  const isFavorite = (productId: string) => ids.includes(productId)

  const toggleFavorite = async (productId: string) => {
    if (!token) {
      toast.error("Login to save favourites")
      return
    }
    const already = ids.includes(productId)
    try {
      if (already) {
        favoriteIds = favoriteIds.filter(id => id !== productId)
        emit()
        await fetch(
          `${API_BASE}/api/users/favorites/${productId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
      } else {
        favoriteIds = [...favoriteIds, productId]
        emit()
        await fetch(
          `${API_BASE}/api/users/favorites/${productId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
      }
    } catch {
      toast.error("Network error for favourite")
    }
  }

  return { favoriteIds: ids, isFavorite, toggleFavorite }
}
