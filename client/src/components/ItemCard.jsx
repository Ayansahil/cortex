import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, Twitter, Youtube, FileJson, 
  Image as ImageIcon, Layers, Trash2, Share2, Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as itemsApi from "../api/items.api";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "../utils/cn";

const typeIcons = {
  article: FileText,
  tweet: Twitter,
  video: Youtube,
  pdf: FileJson,
  image: ImageIcon,
};

const ItemCard = ({ item, index, isResurface = false }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const Icon = typeIcons[item.type] || FileText;

  let domain = "note";
  try {
    if (item.url && item.url.startsWith('http')) {
      domain = new URL(item.url).hostname.replace("www.", "");
    }
  } catch (err) {
    console.warn("Invalid URL for item:", item.url);
  }

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await itemsApi.deleteItem(item._id);
      queryClient.invalidateQueries(["items"]);
      toast.success("Item deleted");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (item.url) {
      navigator.clipboard.writeText(item.url);
      toast.success("Link copied!");
    }
  };

  const hasThumbnail = !!(item.thumbnail || (item.type === "image" && item.filePath));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        // overflow-hidden HERE so shadow stays inside card boundary
        "glass group rounded-2xl overflow-hidden flex flex-col h-[280px] border border-white/5 cursor-pointer",
        isResurface && "border-amber/20"
      )}
      onClick={() => navigate(`/items/${item._id}`)}
    >
      {/* Thumbnail strip — fixed 120px height, only shown when image exists */}
      {hasThumbnail && (
        <div className="w-full h-[120px] flex-shrink-0 bg-black/20">
          <img
            src={item.thumbnail || `http://localhost:3000/${item.filePath}`}
            alt={item.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            onError={(e) => { e.target.parentElement.style.display = "none"; }}
          />
        </div>
      )}

      {/* Body — flex-1 so it fills the remaining fixed height */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Content area — resurfaced: icon+title pinned to bottom; normal: top-aligned */}
        <div className={cn("px-5 pt-5 flex-1 flex flex-col", isResurface ? "justify-end pb-4" : "justify-start")}>
          {/* Icon row */}
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              isResurface
                ? "bg-amber/20 text-amber"
                : "bg-white/5 text-gray-400 group-hover:bg-indigo/10 group-hover:text-indigo transition-colors"
            )}>
              <Icon size={20} />
            </div>

            {/* Action buttons — visible on hover, hidden on resurfaced */}
            {!isResurface && (
              <div
                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={handleShare} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white">
                  <Share2 size={16} />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white">
                  <Layers size={16} />
                </button>
                <button onClick={handleDelete} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          <h3 className="font-heading font-bold text-lg leading-tight text-white/90 group-hover:text-white transition-colors overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {item.title || "Untitled Item"}
          </h3>

          {/* Tags — only on non-resurfaced cards */}
          {!isResurface && (
            <div className="flex flex-wrap gap-2 mt-3">
              {(item.tags || []).map((tag, i) => (
                <span key={`${tag}-${i}`} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-gray-400 group-hover:border-white/10 transition-colors uppercase">
                  #{tag}
                </span>
              ))}
              {(item.autoTags || []).map((at, i) => (
                <span key={`${at.tag}-${i}`} className="px-2 py-0.5 rounded-md bg-indigo/5 border border-indigo/10 text-[9px] font-mono text-indigo-light/70 group-hover:border-indigo/20 transition-colors uppercase flex items-center gap-1">
                  <Sparkles size={8} /> {at.tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-5 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between flex-shrink-0 gap-4">
          <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap shrink-0">
            {(() => {
              try {
                return item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : "recently";
              } catch (e) {
                return "recently";
              }
            })()}
          </span>
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
            {item.url && item.url.startsWith('http') && (
              <img
                src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
                alt=""
                className="w-4 h-4 rounded-sm shrink-0"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter truncate max-w-[80px] sm:max-w-none">
              {domain}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;