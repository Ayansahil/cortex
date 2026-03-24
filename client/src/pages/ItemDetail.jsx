import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ExternalLink, 
  Share2, 
  Trash2,
  Highlighter,
  MessageSquare,
  Clock,
  Twitter,
  Plus
} from "lucide-react";
import * as itemsApi from "../api/items.api";
import * as hApi from "../api/search-highlights.api";
import { applyHighlights } from "../utils/highlight.util";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import HighlightPopover from "../components/items/HighlightPopover";
import ItemCard from "../components/ItemCard";
import { cn } from "../utils/cn";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedText, setSelectedText] = useState("");
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });
  const contentRef = useRef(null);

  const { data: item, isLoading, error } = useQuery({
    queryKey: ["item", id],
    queryFn: () => itemsApi.getItem(id),
  });
  const queryClient = useQueryClient();

  const { data: relatedItems } = useQuery({
    queryKey: ["related", item?.title],
    queryFn: () => hApi.searchItems(item?.title),
    enabled: !!item?.title,
  });

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setPopoverPos({ 
        x: rect.left + rect.width / 2 + window.scrollX, 
        y: rect.top + window.scrollY 
      });
    } else {
      setSelectedText("");
    }
  };

  if (isLoading) return <div className="h-96 flex items-center justify-center font-mono text-gray-500 animate-pulse">Retrieving item memory...</div>;
  if (error) return <div className="text-red-400">Error loading item.</div>;

  let domain = "note";
  try {
    if (item.url && item.url.startsWith('http')) {
      domain = new URL(item.url).hostname.replace("www.", "");
    }
  } catch (err) {
    console.warn("Invalid URL for item:", item.url);
  }
  const faviconDomain = (domain === "youtu.be" || domain === "youtube.com") ? "youtube.com" : domain;

  // detect types
  const isYouTube = item.type === "video";
  const isImage = item.type === "image";

  return (
    <div className="flex flex-col xl:flex-row gap-12 relative" onMouseUp={handleMouseUp}>
      <div className="flex-1 max-w-4xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 font-mono text-xs uppercase tracking-widest group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
        </button>

        <header className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo/20 flex items-center justify-center text-indigo">
              {item.url && item.url.startsWith('http') ? (
                <img 
                  src={`https://www.google.com/s2/favicons?sz=64&domain=${faviconDomain}`}
                  alt="" 
                  className="w-6 h-6 rounded-sm"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="w-6 h-6 rounded-sm bg-white/5 flex items-center justify-center">
                  <span className="text-[10px] text-gray-500 font-bold">?</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-tighter flex items-center gap-2">
                {domain} <span className="w-1 h-1 rounded-full bg-white/10" /> {item.type}
              </p>
              <h1 className="text-4xl font-bold font-heading mt-1">{item.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-y border-white/5 py-6">
            <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
              <Clock size={14} /> {format(new Date(item.createdAt), "MMMM d, yyyy")}
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
              {item.tags?.map((tag, i) => (
                <span key={`${tag}-${i}`} className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-mono border border-white/5">#{tag}</span>
              ))}
              <button className="w-6 h-6 rounded-full border border-dashed border-white/20 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/40 transition-all">
                <Plus size={12} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-3 glass hover:bg-white/5 rounded-xl transition-colors"><ExternalLink size={18} /></a>
              <button 
                onClick={() => {
                  if (item.url) {
                    navigator.clipboard.writeText(item.url);
                    toast.success("Link copied!");
                  }
                }}
                className="p-3 glass hover:bg-white/5 rounded-xl transition-colors"
              >
                <Share2 size={18} />
              </button>
              <button 
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this item?")) {
                    try {
                      await itemsApi.deleteItem(item._id);
                      toast.success("Item deleted");
                      navigate("/");
                    } catch (error) {
                      toast.error("Failed to delete item");
                    }
                  }
                }}
                className="p-3 glass hover:bg-white/5 text-red-400 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* ── FIX: YouTube embed (if embedUrl exists) ── */}
        {isYouTube && item.embedUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-black/30" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={item.embedUrl}
              title={item.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* ── FIX: YouTube thumbnail (if no embedUrl but has thumbnail) ── */}
        {isYouTube && !item.embedUrl && item.thumbnail && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-black/20 relative group" style={{ aspectRatio: "16/9" }}>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-white text-2xl ml-1">▶</span>
              </div>
            </a>
          </div>
        )}

        {/* ── FIX: Image display ── */}
        {isImage && (item.thumbnail || item.filePath) && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-black/20">
            <img
              src={item.thumbnail || `http://localhost:3000/${item.filePath}`}
              alt={item.title}
              className="w-full max-h-[600px] object-contain"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}

        {/* ── FIX: Tweet Card ── */}
        {item.type === 'tweet' && (
          <div className="mb-8 p-8 glass rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo/5 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Twitter size={80} className="text-indigo" />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo/20 flex items-center justify-center text-indigo">
                <Twitter size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg">X / Twitter Post</h4>
                <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Captured from social stream</p>
              </div>
            </div>
            <div className="prose prose-invert max-w-none text-gray-300 italic mb-8 text-xl leading-relaxed">
               "{item.content || item.excerpt || 'No tweet content available'}"
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <span className="text-gray-500 text-xs font-mono">SAVED {format(new Date(item.createdAt), "MMM d, yyyy")}</span>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo hover:text-indigo-light font-bold text-sm transition-colors"
              >
                View original tweet <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        <div className="relative">
          <div 
            ref={contentRef}
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg font-sans"
            dangerouslySetInnerHTML={{ 
              __html: applyHighlights(item.content, item.highlights) || 
                (isYouTube 
                  ? `<p style="color:#9ca3af">YouTube video saved. <a href="${item.url}" target="_blank" style="color:#f87171">Watch on YouTube →</a></p>`
                  : "No content available.")
            }}
          />
          
          <HighlightPopover 
            text={selectedText} 
            position={popoverPos} 
            itemId={item._id}
            onComplete={() => setSelectedText("")}
          />
        </div>

        {/* Related Items */}
        <section className="mt-20 pt-10 border-t border-white/5">
          <h2 className="text-2xl font-bold font-heading mb-8">Related Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedItems?.items?.filter(i => (i._id || i.id) !== item._id).slice(0, 4).map((rItem, i) => (
              <ItemCard key={rItem._id || rItem.id || i} item={rItem} index={i} />
            ))}
          </div>
        </section>
      </div>

      {/* Highlights Sidebar */}
      <aside className="w-full xl:w-80 space-y-8 sticky top-8 h-fit">
        <div>
          <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
            <Highlighter size={14} className="text-indigo" /> Highlights ({item.highlights?.length || 0})
          </h3>
          <div className="space-y-6">
            {item.highlights?.map((h, i) => (
              <motion.div 
                key={h._id || h.id || `highlight-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-4 rounded-xl border-l-4 glass relative group",
                  h.color === "indigo" ? "border-indigo" : h.color === "amber" ? "border-amber" : "border-emerald-500"
                )}
              >
                <button 
                  onClick={async () => {
                    if (window.confirm("Delete this highlight?")) {
                      try {
                        await hApi.deleteHighlight(h._id || h.id);
                        queryClient.invalidateQueries({ queryKey: ["item", item._id] });
                        toast.success("Highlight deleted");
                      } catch (err) {
                        toast.error("Failed to delete highlight");
                      }
                    }
                  }}
                  className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
                <p className="text-sm italic text-gray-300 leading-snug">"{h.text}"</p>
                {h.note && (
                   <div className="flex gap-2 items-start pt-3 mt-3 border-t border-white/5 text-xs text-gray-400">
                    <MessageSquare size={12} className="shrink-0 mt-0.5" />
                    <p>{h.note}</p>
                   </div>
                )}
              </motion.div>
            ))}
            {(!item.highlights || item.highlights.length === 0) && (
              <p className="text-gray-600 font-mono text-[10px] text-center italic py-2">Select text on the left to create highlights.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ItemDetail;