"use client";
import { createContext, useContext, useState, useMemo } from "react";

const DrawerModalContext = createContext();

export const DrawerModalProvider = ({ children }) => {
  const [drawerStack, setDrawerStack] = useState([]);

  // Push a new drawer onto the stack
  const openDrawer = (title, content) => {
    setDrawerStack((stack) => [...stack, { title, content }]);
  };

  // Pop the top drawer off the stack
  const closeDrawer = () => {
    setDrawerStack((stack) => stack.slice(0, -1));
  };

  // Clear all drawers
  const resetDrawer = () => {
    setDrawerStack([]);
  };

  // For compatibility: openModal opens the first drawer, openNestedModal pushes another
  const openModal = openDrawer;
  const openNestedModal = openDrawer;

  // For compatibility: closeModal closes all, closeNestedModal pops one
  const closeModal = resetDrawer;
  const closeNestedModal = closeDrawer;

  // Current drawer (top of stack)
  const current = drawerStack[drawerStack.length - 1] || {};

  const contextValue = useMemo(
    () => ({
      drawerStack,
      openDrawer,
      closeDrawer,
      resetDrawer,
      openModal,
      openNestedModal,
      closeModal,
      closeNestedModal,
      mainModalTitle: current.title,
      mainModalContent: current.content,
      isOpen: drawerStack.length > 0,
      isNestedOpen: false,
      nestedModalTitle: "",
      nestedModalContent: null,
    }),
    [drawerStack, current.title, current.content]
  );

  return (
    <DrawerModalContext.Provider value={contextValue}>
      {children}
    </DrawerModalContext.Provider>
  );
};

export const useDrawerModal = () => useContext(DrawerModalContext);
