import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#E8EBEB",
    borderColor: "#BBC3C3", // border-opacityClr-30
    borderRadius: "0.5rem", // rounded-lg
    minHeight: "48px",
    boxShadow: state.isFocused ? "none" : "none",
    paddingTop: "0.75rem", // pt-3
    paddingBottom: "0.75rem", // pb-3
    paddingLeft: "1rem", // px-4
    paddingRight: "2.5rem", // pr-10
    fontSize: "1rem", // text-base
    color: "#1F2937", // text-opacityClr-100
    outline: "none",
    "&:hover": {
      borderColor: "none",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF", // placeholder:text-opacityClr-10
    fontSize: "1rem",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#F3F4F6",
    borderRadius: "0.375rem",
    padding: "2px 6px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#1F2937",
    fontWeight: 500,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#6B7280",
    ":hover": {
      backgroundColor: "#E5E7EB",
      color: "#111827",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    zIndex: 20,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "" : state.isFocused ? "#E0E7FF" : "white",
    color: state.isSelected ? "white" : "#1F2937",
    fontWeight: state.isSelected ? 600 : 400,
    cursor: "pointer",
  }),
  input: (provided) => ({
    ...provided,
    color: "#1F2937",
    fontSize: "1rem",
  }),
};
