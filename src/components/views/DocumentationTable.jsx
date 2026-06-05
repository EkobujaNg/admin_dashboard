"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaCheck, FaTimes, FaEdit } from "react-icons/fa";

// Document Row Component
const DocumentRow = ({ doc, onUpdate, onStartEdit, onCancelEdit, onDelete }) => {
  const [editName, setEditName] = useState(doc.name);

  useEffect(() => {
    setEditName(doc.name);
  }, [doc.name]);

  if (doc.isEditing) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border border-primary-10 bg-opacityClr-10">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="e.g., Certificate of Occupancy"
          className="flex-1 px-4 py-3 rounded-lg border border-opacityClr-30 bg-white text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10 transition-colors"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && editName.trim()) {
              onUpdate(doc.id, editName);
            } else if (e.key === "Escape") {
              onCancelEdit(doc.id);
              setEditName(doc.name);
            }
          }}
        />
        <button
          onClick={() => {
            if (editName.trim()) {
              onUpdate(doc.id, editName);
            }
          }}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-10 text-white hover:bg-primary-10/90 transition-colors"
        >
          <FaCheck size={14} />
        </button>
        <button
          onClick={() => {
            onCancelEdit(doc.id);
            setEditName(doc.name);
          }}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-opacityClr-30 text-primary-10 hover:bg-opacityClr-10 transition-colors"
        >
          <FaTimes size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-opacityClr-30 bg-opacityClr-10">
      <span className="flex-1 text-primary-10 font-Raleway text-sm">{doc.name}</span>
      <button
        onClick={() => {
          setEditName(doc.name);
          onStartEdit(doc.id);
        }}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-opacityClr-30 bg-transparent hover:bg-opacityClr-10 transition-colors"
      >
        <FaEdit className="text-primary-10" size={14} />
      </button>
      <button
        onClick={() => onDelete(doc.id)}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-200 bg-transparent hover:bg-red-50 transition-colors"
      >
        <FaTrash className="text-red-500" size={14} />
      </button>
    </div>
  );
};

const DocumentationTable = ({ documents = [], onChange }) => {
  const [documentItems, setDocumentItems] = useState(documents || []);

  // Sync with parent when documents prop changes
  useEffect(() => {
    setDocumentItems(documents || []);
  }, [documents]);

  const handleAddDocument = () => {
    const newDocument = {
      id: Date.now(),
      name: "",
      isEditing: true,
    };
    const updatedDocuments = [...documentItems, newDocument];
    setDocumentItems(updatedDocuments);
    onChange(updatedDocuments);
  };

  const handleUpdateDocument = (id, name) => {
    const updatedDocuments = documentItems.map((doc) => {
      if (doc.id === id) {
        return { ...doc, name: name.trim(), isEditing: false };
      }
      return doc;
    });
    setDocumentItems(updatedDocuments);
    onChange(updatedDocuments);
  };

  const handleStartEdit = (id) => {
    const updatedDocuments = documentItems.map((doc) => {
      if (doc.id === id) {
        return { ...doc, isEditing: true };
      }
      return { ...doc, isEditing: false };
    });
    setDocumentItems(updatedDocuments);
  };

  const handleCancelEdit = (id) => {
    const updatedDocuments = documentItems.map((doc) => {
      if (doc.id === id) {
        return { ...doc, isEditing: false };
      }
      return doc;
    });
    setDocumentItems(updatedDocuments);
  };

  const handleDeleteDocument = (id) => {
    const updatedDocuments = documentItems.filter((doc) => doc.id !== id);
    setDocumentItems(updatedDocuments);
    onChange(updatedDocuments);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-primary-10 font-Raleway font-bold text-lg">Documentation</h3>
      
      {documentItems.length > 0 && (
        <div className="flex flex-col gap-3 w-full">
          {documentItems.map((doc) => (
            <DocumentRow
              key={doc.id}
              doc={doc}
              onUpdate={handleUpdateDocument}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onDelete={handleDeleteDocument}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleAddDocument}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-10 text-white font-Raleway font-semibold text-sm rounded-lg hover:bg-primary-10/90 transition-colors w-fit"
      >
        <FaPlus size={16} />
        <span>Add Document</span>
      </button>
    </div>
  );
};

export default DocumentationTable;

