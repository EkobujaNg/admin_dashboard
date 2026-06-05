"use client";

import React, { useState } from "react";
import { useDrawerModal } from "@/context/DrawerModalContext";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AddCategoryDrawer from "@/components/views/AddCategoryDrawer";
import RequirementItem from "@/components/views/RequirementItem";

const RequirementCategory = ({ category, onEditCategory, onDeleteCategory, onAddRequirement, onEditRequirement, onDeleteRequirement }) => {
  const { openModal } = useDrawerModal();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAddingRequirement, setIsAddingRequirement] = useState(false);
  const [newRequirementText, setNewRequirementText] = useState("");

  const handleEditCategory = () => {
    openModal("Edit Category", <AddCategoryDrawer category={category} onAdd={onEditCategory} />);
  };

  const handleDeleteCategory = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDeleteCategory(category.id);
    setShowDeleteModal(false);
  };

  const handleAddRequirement = () => {
    if (newRequirementText.trim()) {
      onAddRequirement(category.id, newRequirementText);
      setNewRequirementText("");
      setIsAddingRequirement(false);
    }
  };

  const handleCancelAdd = () => {
    setNewRequirementText("");
    setIsAddingRequirement(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-6 rounded-2xl border border-opacityClr-30 bg-white">
        {/* Category Header */}
        <div className="flex items-center justify-between w-full">
          <h3 className="text-primary-10 font-Raleway font-bold text-xl">{category.title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditCategory}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-opacityClr-30 bg-transparent hover:bg-opacityClr-10 transition-colors"
            >
              <FaEdit className="text-primary-10" size={16} />
            </button>
            <button
              onClick={handleDeleteCategory}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-200 bg-transparent hover:bg-red-50 transition-colors"
            >
              <FaTrash className="text-red-500" size={16} />
            </button>
          </div>
        </div>

        {/* Requirements List */}
        <div className="flex flex-col gap-3 w-full">
          {category.requirements.map((requirement) => (
            <RequirementItem
              key={requirement.id}
              requirement={requirement}
              categoryId={category.id}
              onEdit={onEditRequirement}
              onDelete={onDeleteRequirement}
            />
          ))}

          {/* Add Requirement Input */}
          {isAddingRequirement ? (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-opacityClr-30 bg-opacityClr-10">
              <input
                type="text"
                value={newRequirementText}
                onChange={(e) => setNewRequirementText(e.target.value)}
                placeholder="Enter requirement..."
                className="flex-1 bg-transparent outline-none text-primary-10 font-Raleway text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddRequirement();
                  } else if (e.key === "Escape") {
                    handleCancelAdd();
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddRequirement}
                  className="px-3 py-1.5 bg-primary-10 text-white font-Raleway font-semibold text-sm rounded-lg hover:bg-primary-10/90 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="px-3 py-1.5 border border-opacityClr-30 text-primary-10 font-Raleway font-semibold text-sm rounded-lg hover:bg-opacityClr-10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingRequirement(true)}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-opacityClr-50 rounded-lg bg-transparent hover:bg-opacityClr-10 transition-colors text-primary-10 font-Raleway font-medium text-sm"
            >
              <FaPlus size={14} />
              <span>Add Requirement</span>
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete "${category.title}" category? This will also delete all requirements under it.`}
        confirmMsg="Yes, Delete"
        cancelMsg="No, Cancel"
      />
    </>
  );
};

export default RequirementCategory;
