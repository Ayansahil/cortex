import React, { useEffect, useState } from "react";
import { useItemsStore } from "../stores/itemsStore";
import { useUIStore } from "../stores/uiStore";
import ItemCard from "../components/ItemCard";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "../utils/cn";

const Library = () => {
  const { items, fetchItems, isLoading } = useItemsStore();
  const { activeFilters, setFilters } = useUIStore();
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchItems(activeFilters);
  }, [activeFilters]);

  const filteredItems = [...(items || [])].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-heading">Your Library</h1>
          <p className="text-gray-400 font-mono text-xs mt-2 uppercase tracking-widest">
            {items.length} total items curated
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none glass px-4 py-2.5 pr-10 rounded-xl text-sm font-mono focus:outline-none focus:border-indigo/50 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_highlights">Most Highlights</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-indigo" />
          </div>
        </div>
      </header>

      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredItems.map((item, i) => (
          <ItemCard key={item._id || item.id || i} item={item} index={i} />
        ))}

        {!isLoading && items.length === 0 && (
          <div className="col-span-full py-32">
            <EmptyState
              title="Nothing found"
              message="We couldn't find any items matching those filters. Try broading your search."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
