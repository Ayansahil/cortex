import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen,
  Loader2
} from "lucide-react";
import { cn } from "../../utils/cn";

const SmartInsights = ({ item }) => {
  // Fix 6: Show loading instead of empty if processing
  if (item.processingStatus === 'pending' || item.processingStatus === 'processing') {
    return (
      <div className="p-8 rounded-[2rem] border border-white/10 bg-indigo/5 flex flex-col items-center justify-center text-center animate-pulse">
        <Loader2 size={24} className="text-indigo animate-spin mb-4" />
        <h4 className="text-indigo-light font-medium mb-1 capitalize">{item.processingStatus}...</h4>
        <p className="text-gray-500 text-xs max-w-[200px]">Our Intelligent Knowledge System is analyzing the content.</p>
      </div>
    );
  }

  // Fix 2: Check both summary and analysisDescription
  if (!item.summary && !item.analysisDescription && !item.insight && (!item.keyPoints || item.keyPoints.length === 0)) {
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
    <div className="space-y-6">
      {/* Summary & Insight Header */}
      <section className="relative p-6 rounded-[2rem] bg-gradient-to-br from-indigo/10 via-transparent to-purple-500/5 border border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Sparkles size={80} className="text-indigo" />
        </div>
        
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo/20 flex items-center justify-center text-indigo shadow-[0_0_15px_rgba(129,140,248,0.2)]">
            <Sparkles size={16} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo/80 font-bold">Analysis</span>
        </div>

        <div className="space-y-5 relative z-10">
          <div>
            <h3 className="text-xl font-bold font-heading mb-3 text-white/90 leading-tight">
              {item.summary || "Executive Summary"}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {/* Fix 5: Ensure analysisDescription is used */}
              {item.analysisDescription || item.excerpt}
            </p>
          </div>

          {item.insight && (
            <div className="pt-5 border-t border-white/5">
              <div className="flex gap-3 items-start">
                <div className="mt-0.5 p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <Lightbulb size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500/60 block mb-1">Core Insight</span>
                  <p className="text-amber-200/90 font-medium leading-relaxed italic text-sm">
                    "{item.insight}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Key Takeaways - Single column for sidebar */}
      {item.keyPoints && item.keyPoints.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 ml-2">
            <BookOpen size={14} className="text-indigo" />
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Key Points</h4>
          </div>
          <div className="space-y-3">
            {item.keyPoints.map((point, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl glass border border-white/5 flex gap-3 hover:bg-white/[0.03] transition-colors group"
              >
                <div className="mt-0.5 text-indigo/40 group-hover:text-indigo transition-colors shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SmartInsights;
