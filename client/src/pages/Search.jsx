import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Loader2, FileText, Youtube, Twitter, FileJson, Image as ImageIcon } from "lucide-react";
import * as searchApi from "../api/search-highlights.api";
import SearchBar from "../components/SearchBar";
import ItemCard from "../components/ItemCard";
import EmptyState from "../components/EmptyState";
import { useUIStore } from "../stores/uiStore";
import { cn } from "../utils/cn";

const typeIcons = {
  article: FileText,
  video: Youtube,
  tweet: Twitter,
  pdf: FileJson,
  image: ImageIcon,
};

const Search = () => {
  const incrementSearchCount = useUIStore((state) => state.incrementSearchCount);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading, isSuccess } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => query ? searchApi.searchItems(debouncedQuery) : Promise.resolve([]),
    enabled: !!debouncedQuery,
  });

  useEffect(() => {
    if (isSuccess && debouncedQuery) {
      incrementSearchCount();
    }
  }, [isSuccess, debouncedQuery, incrementSearchCount]);

  const searchItems = results?.items || (Array.isArray(results) ? results : []);

  const groupedResults = searchItems.reduce((acc, item) => {
    const type = item.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-10 md:space-y-16 py-8 md:py-12 pb-24 md:pb-12">
      <section className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8 px-4">
        <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">Search Your Memory</h1>
        <SearchBar value={query} onChange={setQuery} />
      </section>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-indigo animate-spin" />
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Scanning network...</p>
        </div>
      )}

      {!isLoading && searchItems.length > 0 && (
        <div className="space-y-16">
          {Object.entries(groupedResults).map(([type, items]) => {
            const Icon = typeIcons[type] || FileText;
            return (
              <section key={type}>
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                    <Icon size={16} />
                  </div>
                  <h2 className="text-sm font-mono uppercase tracking-widest text-gray-400">
                    {type}s <span className="text-gray-600 ml-2">({items.length})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item, i) => (
                    <ItemCard key={item._id || item.id || i} item={item} index={i} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {!isLoading && debouncedQuery && searchItems.length === 0 && (
        <EmptyState 
          title="No fragments found" 
          message={`We couldn't find anything matching "${debouncedQuery}" in your brain.`} 
          icon={SearchIcon}
        />
      )}

      {!query && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass h-48 rounded-3xl border border-dashed border-white/10" />
            ))}
         </div>
      )}
    </div>
  );
};

export default Search;
