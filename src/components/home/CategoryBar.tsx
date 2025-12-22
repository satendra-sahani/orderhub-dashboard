import { categories } from "@/data/products";

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  "All": "🍽️",
  "Fast Food": "🍔",
  "Chinese": "🥡",
  "Indian": "🍛",
  "Snacks": "🍿",
  "Rolls": "🌯",
};

const CategoryBar = ({ activeCategory, onCategoryChange }: CategoryBarProps) => {
  return (
    <section className="sticky top-16 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                whitespace-nowrap transition-all
                ${activeCategory === category 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-secondary text-foreground hover:bg-secondary/80"
                }
              `}
            >
              <span>{categoryIcons[category] || "🍴"}</span>
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBar;
