import React from "react";
import { cn } from "../utils/cn";

export const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-white/5 rounded-lg", className)} />
);

export const ItemSkeleton = () => (
  <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
    <Skeleton className="w-10 h-10 rounded-xl" />
    <Skeleton className="w-full h-6" />
    <div className="flex gap-2">
      <Skeleton className="w-12 h-4 rounded-full" />
      <Skeleton className="w-16 h-4 rounded-full" />
    </div>
    <div className="pt-4 border-t border-white/5 flex justify-between">
      <Skeleton className="w-16 h-3" />
      <Skeleton className="w-12 h-3" />
    </div>
  </div>
);

export const DetailSkeleton = () => (
  <div className="space-y-10">
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-1/2 h-8" />
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-full h-4" />
    </div>
  </div>
);
