import { categories } from "@/data/products";

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  "All": "🛒",
  "Vegetables": "🥬",
  "Fruits": "🍎",
  "Dairy": "🥛",
  "Meat & Fish": "🍖",
  "Women's Care": "💜",
  "Grocery": "🛍️",
  "Fast Food": "🍔",
  "Snacks": "🍿",
  "Chinese": "🥡",
  "Indian": "🍛",
  "Rolls": "🌯",
  "Beverages": "🥤",
  "Personal Care": "🧴",
};

const CategoryBar = ({ activeCategory, onCategoryChange }: CategoryBarProps) => {
  return (
    <section className="sticky top-16 z-40 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium
                whitespace-nowrap transition-all min-w-[72px]
                ${activeCategory === category 
                  ? "bg-primary text-primary-foreground shadow-md scale-105" 
                  : "bg-secondary text-foreground hover:bg-primary/10 hover:text-primary"
                }
              `}
            >
              <span className="text-xl">{categoryIcons[category] || "🍴"}</span>
              <span className="truncate max-w-[60px]">{category}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBar;
