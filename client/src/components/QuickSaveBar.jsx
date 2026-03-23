import React, { useState, useRef } from "react";
import { Link2, Plus, Loader2, UploadCloud } from "lucide-react";
import { useItemsStore } from "../stores/itemsStore";
import { toast } from "react-hot-toast";
import { cn } from "../utils/cn";

const QuickSaveBar = ({ className }) => {
  const [url, setUrl] = useState("");
  const { saveItem, isLoading } = useItemsStore();
  const fileInputRef = useRef(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!url) return;
    try {
      await saveItem({ url });
      toast.success("Item saved to your brain!");
      setUrl("");
    } catch (error) {
      toast.error("Failed to save item. Check the URL.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      await saveItem(formData);
      toast.success("File uploaded to your brain!");
    } catch (error) {
      toast.error("Failed to upload file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <form onSubmit={handleSave} className="relative">

        {/* FIX: Mobile — show only Link2 icon on left, hide UploadCloud inside input */}
        {/* Desktop — both icons visible */}
        <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center gap-1 sm:gap-0">
          {/* UploadCloud — icon only on mobile, with text tooltip hidden */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-white transition-colors cursor-pointer z-10 p-1 rounded-md hover:bg-white/10"
            title="Upload File"
          >
            <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
          />
          {/* Link2 — hidden on mobile to save space */}
          <Link2 className="hidden sm:block w-4 h-4 text-gray-600 group-focus-within:text-indigo transition-colors pointer-events-none" />
        </div>

        {/* Input — pl adjusted so text never overlaps button */}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste any link..."
          className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 sm:py-4 pl-14 sm:pl-20 pr-24 sm:pr-36 text-white focus:outline-none focus:border-indigo/50 focus:ring-4 focus:ring-indigo/5 transition-all font-mono text-sm placeholder:text-gray-600 shadow-2xl"
        />

        {/* Save button — icon only on mobile, icon+text on desktop */}
        <div className="absolute inset-y-2 right-2 flex items-center">
          <button
            type="submit"
            disabled={isLoading || !url}
            className="bg-indigo hover:bg-indigo-dark text-white px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold text-sm disabled:opacity-50 active:scale-95 shadow-lg shadow-indigo/20 h-full"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Plus className="w-4 h-4 shrink-0" />
            )}
            <span className="hidden sm:inline whitespace-nowrap">Quick Save</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default QuickSaveBar;