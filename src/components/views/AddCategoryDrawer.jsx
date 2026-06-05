"use client";

import React, { useState, useEffect } from "react";
import { useDrawerModal } from "@/context/DrawerModalContext";

const AddCategoryDrawer = ({ category, onAdd }) => {
  const { closeModal } = useDrawerModal();
  const [title, setTitle] = useState(category?.title || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setTitle(category.title);
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        if (category) {
          // Edit mode - pass categoryId and newTitle
          onAdd(category.id, title);
        } else {
          // Add mode - pass title only
          onAdd(title);
        }
        setIsLoading(false);
        closeModal();
      }, 500);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-6 relative h-full">
      <div className="flex flex-col gap-2">
        <h3 className="text-primary-10 font-Raleway font-bold text-xl">
          {category ? "Edit Category" : "Add Category"}
        </h3>
        <p className="text-opacityClr-50 font-Raleway text-sm">
          {category ? "Update the category title" : "Enter a title for the new requirement category"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="categoryTitle" className="text-primary-10 font-Raleway font-semibold text-base">
            Category Title
          </label>
          <input
            type="text"
            id="categoryTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Documentation, Property Details"
            className="w-full p-4 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
            required
            autoFocus
          />
        </div>

        <div className="flex items-center gap-4 w-full">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 px-6 py-3 border border-opacityClr-30 text-primary-10 font-Raleway font-semibold text-base rounded-lg hover:bg-opacityClr-10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className={`flex-1 px-6 py-3 bg-primary-10 text-white font-Raleway font-semibold text-base rounded-lg hover:bg-primary-10/90 transition-colors ${
              isLoading || !title.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Saving..." : category ? "Update" : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryDrawer;

