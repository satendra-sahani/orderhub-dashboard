// src/components/home/CategoryBar.tsx
"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface CategoryBarProps {
  categories: string[]            // ["All","Personal Care",...]
  activeCategory: string          // current active name, e.g. "All"
  onCategoryChange: (name: string) => void
}

const CategoryBar = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryBarProps) => {
  return (
    <div className="mt-2">
      <ScrollArea className="w-full whitespace-nowrap pb-1">
        <div className="flex gap-2 px-2">
          {categories.map(name => {
            const isActive = activeCategory === name
            const showIcon = name !== "All"
            return (
              <button
                key={name}
                type="button"
                onClick={() => onCategoryChange(name)}
                className={`flex min-w-[96px] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
                }`}
              >
                {showIcon && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[11px]">
                    {/* simple emoji based on name; optional */}
                    {name.includes("Meat")
                      ? "🍗"
                      : name.includes("Fish")
                      ? "🐟"
                      : name.includes("Veg")
                      ? "🥦"
                      : name.includes("Fruit")
                      ? "🍎"
                      : "🍱"}
                  </span>
                )}
                <span className="truncate">{name}</span>
              </button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

export default CategoryBar
