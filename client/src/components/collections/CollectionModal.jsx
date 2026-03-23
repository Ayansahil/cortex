import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useCollectionsStore } from "../../stores/dataStore";
import { toast } from "react-hot-toast";
import { cn } from "../../utils/cn";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().default("indigo"),
  emoji: z.string().default("📁"),
});

const colors = [
  { id: "indigo",   hex: "#6366f1", label: "Indigo"  },
  { id: "amber",    hex: "#f59e0b", label: "Amber"   },
  { id: "emerald",  hex: "#10b981", label: "Green"   },
  { id: "rose",     hex: "#f43f5e", label: "Red"     },
  { id: "sky",      hex: "#0ea5e9", label: "Sky Blue" },
];

const emojis = ["📁", "🧠", "📚", "💡", "🎬", "🎨", "🔗", "🐦", "🎥", "🗞️"];

const CollectionModal = ({ isOpen, onClose, collection }) => {
  const { createCollection, updateCollection } = useCollectionsStore();
  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: collection || { color: "indigo", emoji: "📁" }
  });

  const selectedColor = watch("color");
  const selectedEmoji = watch("emoji");

  useEffect(() => {
    if (isOpen) {
      if (collection) {
        reset({
          name: collection.name,
          description: collection.description || "",
          color: collection.color || "indigo",
          emoji: collection.emoji || "📁"
        });
      } else {
        reset({ name: "", description: "", color: "indigo", emoji: "📁" });
      }
    }
  }, [isOpen, collection, reset]);

  const onSubmit = async (data) => {
    try {
      if (collection) {
        await updateCollection(collection.id || collection._id, data);
        toast.success("Collection updated!");
      } else {
        await createCollection(data);
        toast.success("Collection created!");
      }
      reset();
      onClose();
    } catch (error) {
      toast.error(collection ? "Failed to update collection." : "Failed to create collection.");
    }
  };

  if (!isOpen) return null;

  const activeColor = colors.find(c => c.id === selectedColor)?.hex || "#6366f1";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-indigo p-8 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">
              {collection ? "Edit Collection" : "New Collection"}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Emoji & Name */}
            <div className="flex gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Icon</label>
                <div className="grid grid-cols-5 gap-2 w-40">
                  {emojis.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setValue("emoji", e)}
                      className={cn(
                        "w-7 h-7 flex items-center justify-center rounded-lg transition-all",
                        selectedEmoji === e ? "bg-white/10 scale-110" : "hover:bg-white/5"
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Collection Name</label>
                <input
                  {...register("name")}
                  autoFocus
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-heading text-lg"
                  placeholder="e.g. Brain Fuel"
                />
                {errors.name && <p className="text-red-400 text-xs font-mono">{errors.name.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 font-mono text-sm resize-none"
                placeholder="What's this collection about?"
              />
            </div>

            {/* FIX 1: Colors using inline style — works with ALL colors */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Theme Color</label>
              <div className="flex gap-4">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setValue("color", c.id)}
                    title={c.label}
                    style={{ backgroundColor: c.hex }}
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all flex items-center justify-center",
                      selectedColor === c.id
                        ? "ring-2 ring-white scale-110 shadow-lg opacity-100"
                        : "opacity-40 hover:opacity-80"
                    )}
                  >
                    {selectedColor === c.id && <Check size={18} className="text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit — color matches selected theme */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: activeColor }}
              className="w-full text-white font-bold py-4 rounded-2xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 hover:opacity-90"
            >
              {isSubmitting ? "Processing..." : collection ? "Save Changes" : "Create Collection"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CollectionModal;