import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useItemsStore } from "../stores/itemsStore";
import { useUIStore } from "../stores/uiStore";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Filter, Info } from "lucide-react";
import ItemCard from "../components/ItemCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

const KnowledgeGraph = () => {
  const { items, fetchItems } = useItemsStore();
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    fetchItems();
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!items.length || !dimensions.width) return;

    // Data Preparation
    const nodes = items.map(item => ({ ...item }));
    const links = [];

    // Create links between items that share tags
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const tags1 = [
          ...(nodes[i].tags || []),
          ...(nodes[i].autoTags?.map(at => at.tag) || [])
        ];
        const tags2 = [
          ...(nodes[j].tags || []),
          ...(nodes[j].autoTags?.map(at => at.tag) || [])
        ];
        
        const sharedTags = tags1.filter(tag => tags2.includes(tag));
        
        if (sharedTags?.length > 0) {
          links.push({
            source: nodes[i]._id,
            target: nodes[j]._id,
            value: sharedTags.length
          });
        }
      }
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Zoom setup
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d._id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Links
    const link = g.append("g")
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 1.5);

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(drag(simulation))
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Node Circles
    node.append("circle")
      .attr("r", d => 12 + (d.highlights?.length || 0) * 2)
      .attr("fill", d => {
        if (d.type === "article") return "#6366f1";
        if (d.type === "video") return "#f59e0b";
        if (d.type === "tweet") return "#0ea5e9";
        if (d.type === "pdf") return "#f43f5e";
        return "#10b981";
      })
      .attr("stroke", "#0a0a0f")
      .attr("stroke-width", 2)
      .attr("class", "transition-all duration-300 hover:scale-125 hover:stroke-white");

    // Node Labels
    node.append("text")
      .text(d => d.title)
      .attr("x", 16)
      .attr("y", 4)
      .attr("fill", "#9ca3af")
      .attr("font-size", "10px")
      .attr("font-family", "DM Mono")
      .style("pointer-events", "none")
      .attr("class", "opacity-0 group-hover:opacity-100 transition-opacity");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, [items, dimensions]);

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6 pb-24 md:pb-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">Knowledge Graph</h1>
          <p className="text-gray-400 font-mono text-[10px] md:text-xs mt-1 md:mt-2 uppercase tracking-widest">
            Visualizing semantic overlaps
          </p>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          <div className="glass px-4 md:px-6 py-2 md:py-3 rounded-2xl flex items-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-gray-500 shrink-0">
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo" /> Article</div>
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber" /> Video</div>
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-sky-500" /> Tweet</div>
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> PDF</div>
          </div>
        </div>
      </header>

      <div 
        ref={containerRef}
        className="flex-1 glass rounded-[2.5rem] border border-white/5 relative bg-black/20 overflow-hidden cursor-move shadow-inner"
        onClick={() => setSelectedNode(null)}
      >
        <svg ref={svgRef} width="100%" height="100%" />

        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2">
          <button className="p-2.5 md:p-3 glass hover:bg-white/5 rounded-xl transition-colors"><ZoomIn size={16} className="md:w-[18px] md:h-[18px]" /></button>
          <button className="p-2.5 md:p-3 glass hover:bg-white/5 rounded-xl transition-colors"><ZoomOut size={16} className="md:w-[18px] md:h-[18px]" /></button>
          <button className="p-2.5 md:p-3 glass hover:bg-white/5 rounded-xl transition-colors"><Maximize2 size={16} className="md:w-[18px] md:h-[18px]" /></button>
        </div>

        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-[calc(100%-2rem)] sm:w-80 z-[100]"
              onClick={(e) => e.stopPropagation()}
            >
              <ItemCard item={selectedNode} index={0} />
            </motion.div>
          )}
        </AnimatePresence>

        {items.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center bg-obsidian/40 backdrop-blur-sm">
             <div className="text-center p-12 glass rounded-3xl max-w-sm border border-white/10">
               <Info className="w-10 h-10 text-indigo mx-auto mb-6" />
               <h3 className="text-lg font-bold font-heading mb-2">No Data Points</h3>
               <p className="text-gray-400 font-mono text-xs">Your knowledge graph is currently empty. Save some items to begin visualizing your second brain.</p>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraph;
