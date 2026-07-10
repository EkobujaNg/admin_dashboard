"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { useDrawerModal } from "@/context/DrawerModalContext";

const Drawer = () => {
  const { drawerStack, closeDrawer, resetDrawer } = useDrawerModal();
  const isOpen = drawerStack.length > 0;
  const current = drawerStack[drawerStack.length - 1] || {};
  const canGoBack = drawerStack.length > 1;
  const [side, setSide] = useState("right");

  useEffect(() => {
    const handleResize = () => setSide(window.innerWidth < 768 ? "bottom" : "right");
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Animation based on side
  const variants =
    side === "bottom"
      ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
      : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={resetDrawer}></div>

      {/* Drawer */}
      <motion.div
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
        className={`fixed bg-white shadow-lg z-[100] flex flex-col 
          ${side === "bottom" ? "bottom-0 left-0 w-full h-[85vh] rounded-t-2xl" : "right-0 top-0 h-full w-[30%]"}
        `}
      >
        {/* Drag handle for mobile */}
        {side === "bottom" && (
          <div className="flex justify-center items-center py-3">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            {canGoBack && <ArrowLeft className="cursor-pointer text-gray-600 hover:text-black" onClick={closeDrawer} />}
            <h2 className="text-lg font-bold text-primary-10">{current.title}</h2>
          </div>
          <X className="cursor-pointer text-gray-600 hover:text-black" onClick={resetDrawer} />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-0 flex flex-col">{current.content}</div>
      </motion.div>
    </>
  );
};

export default Drawer;
