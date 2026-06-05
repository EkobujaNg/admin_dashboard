import React, { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { customSelectStyles } from "@/lib/utils";

const options = [
  { value: "oak_villa", label: "Oak Villa" },
  { value: "maple_residence", label: "Maple Residence" },
  { value: "pine_heights", label: "Pine Heights" },
  { value: "cedar_court", label: "Cedar Court" },
  { value: "willow_gardens", label: "Willow Gardens" },
  { value: "elm_towers", label: "Elm Towers" },
  { value: "birch_apartments", label: "Birch Apartments" },
  { value: "spruce_estate", label: "Spruce Estate" },
];

const EditTaskDrawerContent = ({ task, handleDelete }) => {
  if (!task) return null;

  const animatedComponents = makeAnimated();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
    taskDate: "",
    assignedTo: "",
    assignedProperties: [],
  });

  useEffect(() => {
    setFormData({
      taskName: task.taskName || "",
      taskDate: task.date ? task.date.split("T")[0] : "",
      assignedTo: task.assignedTo || "null",
      assignedProperties: task.assignedProperties || [],
    });
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropertyChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      assignedProperties: selectedOptions.map((opt) => opt.value),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // optionally close modal or show success
    }, 1500);
  };

  return (
    <div className="flex flex-col items-start gap-6 py-6 relative h-full">
      <form onSubmit={handleSave} className="w-full flex flex-col gap-6 items-start justify-center" autoComplete="off">
        {/* Task Name */}
        <div className="flex flex-col gap-2 w-full">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base">Task Name</label>
          <input
            type="text"
            name="taskName"
            value={formData.taskName}
            onChange={handleInputChange}
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 pr-10 bg-transparent text-base"
          />
        </div>

        {/* Manager assigned to */}
        <div className="flex flex-col gap-2 w-full">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base">Manager assigned to</label>
          <input
            type="text"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange}
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 pr-10 bg-transparent text-base"
          />
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2 w-full">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base">Date For Task*</label>
          <div className="relative w-full">
            <input
              type="date"
              name="taskDate"
              value={formData.taskDate}
              onChange={handleInputChange}
              className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 pr-10 bg-transparent text-base"
            />
            <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-opacityClr-40 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Properties */}
        <div className="flex flex-col gap-2 w-full">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base">Assigned Properties</label>
          <Select
            styles={customSelectStyles}
            className="w-full"
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            onChange={handlePropertyChange}
            value={options.filter((opt) => formData.assignedProperties.includes(opt.value))}
          />
        </div>
      </form>

      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 border-t border-opacityClr-20">
        <div className="flex items-center gap-4 w-full">
          <button
            type="submit"
            className="flex items-center justify-center w-full rounded-md border border-transparent py-3 px-5 bg-opacityClr-100 text-white font-semibold"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="spinner mr-2"></span> Processing...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-full rounded-md border border-[#9F1B1B] py-3 px-5 bg-white text-[#9F1B1B] font-semibold"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskDrawerContent;
