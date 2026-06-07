import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { customSelectStyles } from "@/lib/utils";

const CreateTaskDrawer = ({ closeModal }) => {
  const animatedComponents = makeAnimated();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
    taskDate: "",
    assignedTo: "",
    selectedProperties: [],
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropertyChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      selectedProperties: selectedOptions.map((opt) => opt.value),
    }));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      closeModal();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-start gap-6 py-6 relative h-full">
      <h3 className="font-Raleway font-medium text-base text-primary-10 leading-normal">
        Create task list for user(s) facility managers to be carried out on reports
      </h3>

      <form onSubmit={handleCreateTask} className="w-full flex flex-col gap-6 items-start justify-center" autoComplete="off">
        {/* Task Name* */}
        <div className="flex flex-col gap-2 w-full">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Task Name</label>
          <input
            type="text"
            name="taskName"
            value={formData.taskName}
            onChange={handleInputChange}
            placeholder="Enter task name"
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 pr-10 text-opacityClr-100 text-base leading-[150%] outline-none bg-transparent placeholder:text-opacityClr-10"
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
            placeholder="Enter manager's name"
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 pr-10 bg-transparent text-base"
          />
        </div>

        {/* Date For Task* */}
        <div className="flex flex-col gap-2 w-full">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Date For Task*</label>
          <div className="relative w-full">
            <input
              type="date"
              name="taskDate"
              value={formData.taskDate}
              onChange={handleInputChange}
              className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 pr-10 text-opacityClr-100 text-base leading-[150%] outline-none bg-transparent placeholder:text-opacityClr-10"
            />
            <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-opacityClr-40 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Select Facility Managers */}
        <div className="flex flex-col gap-2 w-full">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">
            Assigned Properties (Click to add multiple items)
          </label>
          <Select
            styles={customSelectStyles}
            className="w-full"
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            placeholder="Select properties"
            onChange={handlePropertyChange}
            value={options.filter((opt) => formData.selectedProperties.includes(opt.value))}
          />
        </div>
      </form>

      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 border-t border-opacityClr-20">
        <button
          type="submit"
          className="flex items-center justify-center w-full rounded-md border border-transparent py-3 px-5 bg-opacityClr-100 text-base text-white font-semibold leading-[150%] transition-all duration-300 ease-in-out hover:bg-opacityClr-100 cursor-pointer"
          onClick={handleCreateTask}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <span className="spinner mr-2"></span>
              Processing...
            </div>
          ) : (
            "Create Task"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateTaskDrawer;
