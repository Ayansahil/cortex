import React, { useEffect, useState } from "react";
import { useHighlightsStore } from "../stores/dataStore";
import { Highlighter, Calendar, Link2, MessageSquare, Trash2, Filter } from "lucide-react";
import { format } from "date-fns";
import EmptyState from "../components/EmptyState";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { useNavigate } from "react-router-dom";
import * as hApi from "../api/search-highlights.api";
import { toast } from "react-hot-toast";

const Highlights = () => {
  const { highlights, fetchHighlights, isLoading } = useHighlightsStore();
  const [filterColor, setFilterColor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHighlights();
  }, []);

  const filteredHighlights = highlights.filter(h => !filterColor || h.color === filterColor);

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-24 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">Highlights</h1>
          <p className="text-gray-400 font-mono text-[10px] md:text-xs mt-1 md:mt-2 uppercase tracking-widest">
            {highlights.length} thoughts captured across time
          </p>
        </div>
        
        <div className="flex items-center gap-2 glass p-1.5 rounded-2xl">
           {["indigo", "amber", "emerald"].map(color => (
             <button
               key={color}
               onClick={() => setFilterColor(filterColor === color ? null : color)}
               className={cn(
                 "w-10 h-10 rounded-xl transition-all flex items-center justify-center",
                 color === "indigo" ? "bg-indigo/20 text-indigo" : color === "amber" ? "bg-amber/20 text-amber" : "bg-emerald-500/20 text-emerald-500",
                 filterColor === color && "ring-2 ring-white/20 scale-110",
                 filterColor && filterColor !== color && "opacity-30 grayscale"
               )}
             >
               <Highlighter size={16} />
             </button>
           ))}
        </div>
      </header>

      <div className="space-y-12">
        {filteredHighlights.length > 0 ? (
          filteredHighlights.map((h, i) => (
            <motion.div
              key={h._id || h.id || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative pl-12"
            >
              {/* Timeline Connector */}
              <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/5" />
              <div className={cn(
                "absolute left-2.5 top-0 w-4 h-4 rounded-full border-4 border-obsidian z-10",
                h.color === "indigo" ? "bg-indigo" : h.color === "amber" ? "bg-amber" : "bg-emerald-500"
              )} />

              <div className="glass p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-gray-600" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      {format(new Date(h.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <button 
                    onClick={async () => {
                      if (window.confirm("Delete this highlight?")) {
                        try {
                          await hApi.deleteHighlight(h._id || h.id);
                          toast.success("Highlight deleted");
                          fetchHighlights();
                        } catch (err) {
                          toast.error("Failed to delete highlight");
                        }
                      }
                    }}
                    className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <blockquote className="text-lg md:text-2xl font-heading font-bold text-white/90 leading-tight border-l-4 border-white/5 pl-4 md:pl-6 italic mb-6 md:mb-8">
                  "{h.text}"
                </blockquote>

                {h.note && (
                  <div className="bg-white/5 rounded-2xl p-4 flex gap-4 items-start mb-8">
                    <MessageSquare size={18} className="text-indigo shrink-0 mt-1" />
                    <p className="text-sm text-gray-400 font-mono leading-relaxed">{h.note}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-indigo/10 flex items-center justify-center text-indigo shrink-0">
                      <Link2 size={16} />
                    </div>
                    <span className="text-xs md:text-sm font-bold truncate max-w-[200px] md:max-w-xs">{h.item?.title || "Source Item"}</span>
                  </div>
                  <button 
                    onClick={() => {
                      const itemId = h.item?._id || h.item;
                      if (itemId) navigate(`/item/${itemId}`);
                    }}
                    className="text-indigo hover:text-indigo-light text-xs font-bold font-mono border border-indigo/20 px-4 py-2 rounded-xl hover:bg-indigo/10 transition-all"
                  >
                    Open Thread
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <EmptyState 
            title="No snippets here" 
            message="Filter result was empty or you haven't captured any highlights yet." 
            icon={Highlighter}
          />
        )}
      </div>
    </div>
  );
};

export default Highlights;
