import React from "react";
import { BrainCircuit } from "lucide-react";

export const Logo = ({ className }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="w-10 h-10 rounded-xl bg-indigo flex items-center justify-center">
      <BrainCircuit className="text-white w-6 h-6" />
    </div>
    <span className="text-2xl font-bold font-heading italic">Cortex</span>
  </div>
);
