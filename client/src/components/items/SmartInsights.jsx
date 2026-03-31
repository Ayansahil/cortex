import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen,
  Quote
} from "lucide-react";
import { cn } from "../../utils/cn";

const SmartInsights = ({ item }) => {
  if (!item.summary && !item.insight && (!item.keyPoints || item.keyPoints.length === 0)) {
    return (
      <div className="p-8 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center group hover:border-indigo/30 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-indigo transition-colors mb-4">
          <Sparkles size={24} />
        </div>
        <h4 className="text-gray-400 font-medium mb-1">No AI Analysis Yet</h4>
        <p className="text-gray-500 text-xs max-w-[200px]">Analysis happens automatically when items are saved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary & Insight Header */}
      <section className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo/10 via-transparent to-purple-500/5 border border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Sparkles size={120} className="text-indigo" />
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo/20 flex items-center justify-center text-indigo shadow-[0_0_20px_rgba(129,140,248,0.2)]">
            <Sparkles size={20} />
          </div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-indigo/80 font-bold">Intelligent Analysis</span>
        </div>

        <div className="space-y-6 relative z-10">
          <div>
            <h3 className="text-2xl font-bold font-heading mb-4 text-white/90 leading-tight">
              {item.summary || "Executive Summary"}
            </h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              {item.analysisDescription || item.excerpt}
            </p>
          </div>

          {item.insight && (
            <div className="pt-6 border-t border-white/5">
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Lightbulb size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/60 block mb-1">Core Insight</span>
                  <p className="text-amber-200/90 font-medium leading-relaxed italic text-lg">
                    "{item.insight}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Key Takeaways */}
      {item.keyPoints && item.keyPoints.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 ml-2">
            <BookOpen size={16} className="text-indigo" />
            <h4 className="text-sm font-mono uppercase tracking-widest text-gray-400">Key Takeaways</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.keyPoints.map((point, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-2xl glass border border-white/5 flex gap-4 hover:bg-white/[0.03] transition-colors group"
              >
                <div className="mt-0.5 text-indigo/40 group-hover:text-indigo transition-colors shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SmartInsights;
