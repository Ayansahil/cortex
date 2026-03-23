import React from "react";
import ItemCard from "./ItemCard";
import { formatDistanceToNow } from "date-fns";

const ResurfaceCard = ({ item, index }) => {
  const timeStr = formatDistanceToNow(new Date(item.createdAt), { addSuffix: false });

  return (
    <div className="relative group">
      {/* Amber glow — stays behind the card */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber to-amber-dark rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 pointer-events-none" />
      {/* Card */}
      <ItemCard item={item} index={index} isResurface={true} />
      {/* Single badge — absolutely positioned top-left over the card */}
      <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-amber/20 border border-amber/30 text-amber text-[9px] font-mono font-bold uppercase tracking-widest z-20 pointer-events-none">
        Saved {timeStr} ago
      </div>
    </div>
  );
};

export default ResurfaceCard;