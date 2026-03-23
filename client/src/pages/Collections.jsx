import React, { useState, useEffect } from "react";
import { useCollectionsStore } from "../stores/dataStore";
import { Plus, Layers, MoreVertical, Folder, ArrowRight, Edit2, Trash2 } from "lucide-react";
import CollectionModal from "../components/collections/CollectionModal";
import EmptyState from "../components/EmptyState";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
import { toast } from "react-hot-toast";

const colorMap = {
  indigo:  { hex: "#6366f1", glowHex: "rgba(99,102,241,0.25)",  bgHex: "rgba(99,102,241,0.08)"  },
  amber:   { hex: "#f59e0b", glowHex: "rgba(245,158,11,0.25)",  bgHex: "rgba(245,158,11,0.08)"  },
  emerald: { hex: "#10b981", glowHex: "rgba(16,185,129,0.25)",  bgHex: "rgba(16,185,129,0.08)"  },
  rose:    { hex: "#f43f5e", glowHex: "rgba(244,63,94,0.25)",   bgHex: "rgba(244,63,94,0.08)"   },
  sky:     { hex: "#0ea5e9", glowHex: "rgba(14,165,233,0.25)",  bgHex: "rgba(14,165,233,0.08)"  },
};

const getColor = (colorId) => colorMap[colorId] || colorMap.indigo;

const Collections = () => {
  const { collections, fetchCollections, deleteCollection, isLoading } = useCollectionsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setActiveDropdown(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="space-y-8 md:space-y-12 pb-24 md:pb-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">Collections</h1>
          <p className="text-gray-400 font-mono text-[10px] md:text-xs mt-1 md:mt-2 uppercase tracking-widest">
            {collections.length} clusters of knowledge
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCollection(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo hover:bg-indigo-dark text-white px-5 sm:px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo/20 text-sm sm:text-base"
        >
          <Plus size={18} /> New Collection
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {collections.map((col, i) => {
          const color = getColor(col.color);
          return (
            <motion.div
              key={col._id || col.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div
                className="glass rounded-[2.5rem] p-8 h-full border border-white/5 relative overflow-hidden transition-all"
                style={{
                  "--hover-border": color.hex,
                }}
              >
                {/* Background Glow */}
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                  style={{ backgroundColor: color.hex }}
                />

                <div className="relative z-10">
                 
                  <div className="flex items-start justify-between mb-6">
                    {/* Emoji Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner flex-shrink-0"
                      style={{ backgroundColor: color.bgHex }}
                    >
                      {col.emoji || "📁"}
                    </div>

                   
                    <div className="relative flex-shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === (col._id || col.id) ? null : (col._id || col.id));
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === (col._id || col.id) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            className="absolute right-0 top-full mt-1 w-36 bg-[#111118] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCollection(col);
                                setIsModalOpen(true);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-white/5 text-sm font-mono text-gray-300 hover:text-white transition-colors"
                            >
                              <Edit2 size={14} /> Edit
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm("Delete this collection?")) {
                                  try {
                                    await deleteCollection(col._id || col.id);
                                    toast.success("Collection deleted");
                                  } catch {
                                    toast.error("Failed to delete");
                                  }
                                }
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-red-500/10 text-sm font-mono text-red-400 transition-colors"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Collection Name — always below icon, never overlapping 3-dot */}
                  <h3
                    className="text-xl font-bold font-heading mb-2 transition-colors leading-tight"
                    style={{ color: "white" }}
                  >
                    {col.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-mono leading-relaxed">
                    {col.description || "No description provided."}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-widest">
                      <Layers size={14} style={{ color: color.hex }} />
                      {col.items?.length || 0} items
                    </div>
                    <div
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-all"
                      style={{ "--hover-bg": color.hex }}
                    >
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {collections.length === 0 && !isLoading && (
          <div className="col-span-full">
            <EmptyState
              title="No collections yet"
              message="Start clustering your items into thematic collections to organize your brain."
              icon={Folder}
            />
          </div>
        )}
      </div>

      <CollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collection={selectedCollection}
      />
    </div>
  );
};

export default Collections;