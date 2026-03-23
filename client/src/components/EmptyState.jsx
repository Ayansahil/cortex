import React from "react";
import { Box } from "lucide-react";

const EmptyState = ({ title, message, icon: Icon = Box }) => (
  <div className="flex flex-col items-center justify-center text-center p-12 glass rounded-3xl border border-dashed border-white/10">
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
      <Icon className="text-gray-500 w-8 h-8" />
    </div>
    <h3 className="text-xl font-bold font-heading mb-2">{title}</h3>
    <p className="text-gray-400 font-mono text-sm max-w-md">{message}</p>
  </div>
);

export default EmptyState;
