import React, { useState, useEffect } from "react";
import { Search as SearchIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

const placeholders = [
  "Find that article about LLMs...",
  "Search your saved videos...",
  "What was that tweet about SpaceX?",
  "Locate the PDF from last month...",
  "Search for 'Design Patterns'...",
];

// Fix #4: Accept isSemanticSearch and onToggleSemantic from parent
const SearchBar = ({ value, onChange, className, isSemanticSearch = false, onToggleSemantic }) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSemantic = () => {
    if (typeof onToggleSemantic === "function") {
      onToggleSemantic();
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Search icon */}
      <div className="absolute inset-y-0 left-4 md:left-6 flex items-center pointer-events-none z-10">
        <SearchIcon className={cn(
          "w-5 h-5 md:w-6 md:h-6 transition-colors",
          value ? "text-indigo" : "text-gray-600 group-focus-within:text-indigo"
        )} />
      </div>

      {/* Animated placeholder */}
      <div className="absolute inset-y-0 left-10 md:left-16 flex items-center pointer-events-none z-10 overflow-hidden pr-28 md:pr-36">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.span
              key={placeholderIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gray-600 font-mono text-sm md:text-lg whitespace-nowrap"
            >
              {placeholders[placeholderIndex]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded-[2rem] py-4 md:py-6 pl-10 md:pl-16 pr-28 md:pr-36 text-base md:text-xl text-white focus:outline-none focus:border-indigo/50 focus:ring-4 md:focus:ring-8 focus:ring-indigo/5 transition-all font-heading font-bold shadow-2xl relative z-0"
      />

      {/* Semantic Search toggle button — Fix #4 */}
      <div className="absolute inset-y-2 md:inset-y-3 right-2 md:right-3 flex items-center z-10">
        <button
          type="button"
          onClick={handleToggleSemantic}
          className={cn(
            "flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl border text-[10px] md:text-xs font-mono group-focus-within:border-indigo/50 hover:bg-indigo/20 transition-all whitespace-nowrap active:scale-95",
            isSemanticSearch
              ? "bg-indigo/25 border-indigo/60 text-indigo"      // active: highlighted
              : "bg-indigo/10 border-indigo/20 text-indigo-light" // inactive: subtle
          )}
          title={isSemanticSearch ? "Semantic search ON — click to switch to normal" : "Click to enable AI semantic search"}
        >
          <Sparkles size={12} className={cn("shrink-0", isSemanticSearch ? "text-amber animate-pulse" : "text-amber/50")} />
          <span className="hidden sm:inline">{isSemanticSearch ? "Semantic ON" : "Semantic Search"}</span>
          <span className="sm:hidden">AI</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;