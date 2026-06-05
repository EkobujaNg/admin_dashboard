"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const RequirementItem = ({ requirement, categoryId, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(requirement.text);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStartEdit = () => {
    setEditText(requirement.text);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(categoryId, requirement.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(requirement.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(categoryId, requirement.id);
    setShowDeleteModal(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg border border-primary-10 bg-opacityClr-10">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 bg-transparent outline-none text-primary-10 font-Raleway text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSaveEdit();
            } else if (e.key === "Escape") {
              handleCancelEdit();
            }
          }}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveEdit}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-10 text-white hover:bg-primary-10/90 transition-colors"
          >
            <FaCheck size={12} />
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-opacityClr-30 text-primary-10 hover:bg-opacityClr-10 transition-colors"
          >
            <FaTimes size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-opacityClr-30 bg-opacityClr-10">
        <p className="flex-1 text-primary-10 font-Raleway text-sm">{requirement.text}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartEdit}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-opacityClr-30 bg-transparent hover:bg-opacityClr-10 transition-colors"
          >
            <FaEdit className="text-primary-10" size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 bg-transparent hover:bg-red-50 transition-colors"
          >
            <FaTrash className="text-red-500" size={12} />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete this requirement?`}
        confirmMsg="Yes, Delete"
        cancelMsg="No, Cancel"
      />
    </>
  );
};

export default RequirementItem;

