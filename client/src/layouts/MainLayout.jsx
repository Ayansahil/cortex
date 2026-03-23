import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-obsidian text-white selection:bg-indigo/30 selection:text-indigo-light">
      <Navbar />
      <main className="flex-1 overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="px-4 md:px-8 py-6 md:py-8 max-w-[1600px] mx-auto pb-24 md:pb-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainLayout;
