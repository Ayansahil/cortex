import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlighter, Check, X, MessageSquare } from "lucide-react";
import { useHighlightsStore } from "../../stores/dataStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { cn } from "../../utils/cn";

const colors = [
  { id: "indigo", bg: "bg-indigo" },
  { id: "amber", bg: "bg-amber" },
  { id: "emerald", bg: "bg-emerald-500" },
];

const HighlightPopover = ({ text, position, itemId, onComplete }) => {
  const [selectedColor, setSelectedColor] = useState("indigo");
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const { createHighlight } = useHighlightsStore();
  const queryClient = useQueryClient();

  if (!text) return null;

  const handleSave = async () => {
    try {
      await createHighlight({
        itemId,
        text,
        color: selectedColor,
        note
      });
      queryClient.invalidateQueries(["item", itemId]);
      toast.success("Highlight saved!");
      onComplete();
    } catch (error) {
      toast.error("Failed to save highlight.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: -60 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        style={{ left: position.x, top: position.y }}
        className="fixed z-[100] -translate-x-1/2"
      >
        <div className="glass border-white/10 p-3 rounded-2xl shadow-2xl flex flex-col gap-3 min-w-[240px]">
          <div className="flex items-center justify-between gap-4">
             <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.id)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center",
                    c.bg,
                    selectedColor === c.id && "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                  )}
                >
                  {selectedColor === c.id && <Check size={12} className="text-white" />}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-1 border-l border-white/10 pl-3">
              <button 
                onClick={() => setShowNote(!showNote)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showNote ? "text-indigo bg-indigo/10" : "text-gray-400 hover:text-white"
                )}
              >
                <MessageSquare size={16} />
              </button>
              <button 
                onClick={handleSave}
                className="p-2 bg-indigo hover:bg-indigo-dark text-white rounded-lg transition-all active:scale-95"
              >
                <Check size={16} />
              </button>
              <button 
                onClick={onComplete}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {showNote && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="px-1"
            >
              <textarea
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note to this highlight..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo/50 font-mono resize-none min-h-[80px]"
              />
            </motion.div>
          )}
        </div>
        <div className="w-3 h-3 glass border-b border-r border-white/10 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
      </motion.div>
    </AnimatePresence>
  );
};

export default HighlightPopover;
