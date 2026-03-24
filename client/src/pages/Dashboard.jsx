import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useItemsStore } from "../stores/itemsStore";
import { useCollectionsStore, useHighlightsStore } from "../stores/dataStore";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";
import { motion } from "framer-motion";
import { 
  FileText, 
  Layers, 
  Highlighter, 
  Search, 
  ArrowUpRight,
  Plus
} from "lucide-react";
import QuickSaveBar from "../components/QuickSaveBar";
import ResurfaceCard from "../components/ResurfaceCard";
import ItemCard from "../components/ItemCard";
import { cn } from "../utils/cn";

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="glass p-6 rounded-2xl flex items-center gap-5 border border-white/5 hover:border-white/10 transition-colors">
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110", colorClass)}>
      <Icon className="text-white w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold font-heading mt-1">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items, fetchItems, isLoading } = useItemsStore();
  const { collections, fetchCollections } = useCollectionsStore();
  const { highlights, fetchHighlights } = useHighlightsStore();
  const searchCount = useUIStore((state) => state.searchCount);

  useEffect(() => {
    fetchItems();
    fetchCollections();
    fetchHighlights();
  }, []);

  const resurfacedItems = (items || []).filter(item => {
    if (!item?.createdAt) return false;
    const saveDate = new Date(item.createdAt);
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
    return saveDate < oneMinuteAgo;
  }).slice(0, 3);

  const stats = [
    { icon: FileText, label: "Total Items", value: items?.length || 0, colorClass: "bg-indigo/20 text-indigo" },
    { icon: Layers, label: "Collections", value: collections?.length || 0, colorClass: "bg-amber/20 text-amber" },
    { icon: Highlighter, label: "Highlights", value: highlights?.items?.length ?? highlights?.length ?? 0, colorClass: "bg-sky-500/20 text-sky-500" },
    { icon: Search, label: "Searches", value: searchCount, colorClass: "bg-emerald-500/20 text-emerald-500" },
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-24 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight">Welcome, {user?.name || "Curator"}</h1>
          <p className="text-gray-400 font-mono text-[10px] md:text-sm mt-1 md:mt-2 uppercase tracking-wide">
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <QuickSaveBar className="flex-1 max-w-xl" />
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Resurfaced Today */}
      {resurfacedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold font-heading">Resurfaced Today</h2>
            <div className="px-2 py-0.5 rounded bg-amber/10 border border-amber/20 text-amber text-[10px] uppercase font-bold tracking-widest animate-pulse">
              Memories
            </div>
          </div>
          {/* Up to 3 resurfaced cards in a responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resurfacedItems.map((item, i) => (
              <ResurfaceCard key={item?._id || i} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-heading">Recently Saved</h2>
          {/* FIX: View All navigates to /library */}
          <button 
            onClick={() => navigate("/library")}
            className="text-indigo hover:text-indigo-light text-sm font-bold flex items-center gap-1 group"
          >
            View All <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(items || []).slice(0, 8).map((item, i) => (
            <ItemCard key={item?._id || i} item={item} index={i} />
          ))}
          {(!items || items.length === 0) && !isLoading && (
             <div className="col-span-full py-20 text-center glass rounded-2xl border border-dashed border-white/10">
               <p className="text-gray-500 font-mono">No items found. Start by pasting a URL above.</p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;