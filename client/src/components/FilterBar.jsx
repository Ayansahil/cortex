import React from "react";
import { useUIStore } from "../stores/uiStore";
import { 
  FileText, 
  Twitter, 
  Youtube, 
  FileJson, 
  Image as ImageIcon,
  X
} from "lucide-react";
import { cn } from "../utils/cn";

const types = [
  { id: "article", label: "Articles", icon: FileText },
  { id: "tweet", label: "Tweets", icon: Twitter },
  { id: "video", label: "Videos", icon: Youtube },
  { id: "pdf", label: "PDFs", icon: FileJson },
  { id: "image", label: "Images", icon: ImageIcon },
];

const FilterBar = () => {
  const { activeFilters, setFilters, resetFilters } = useUIStore();

  const toggleType = (typeId) => {
    setFilters({ type: activeFilters.type === typeId ? null : typeId });
  };

  const hasFilters = activeFilters.type || activeFilters.tags.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => toggleType(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono transition-all whitespace-nowrap border",
              activeFilters.type === t.id 
                ? "bg-indigo/20 border-indigo text-indigo" 
                : "glass border-white/5 text-gray-400 hover:text-white hover:border-white/10"
            )}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <X size={14} />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
