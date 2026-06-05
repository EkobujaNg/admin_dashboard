"use client";

import React, { useMemo } from "react";

const toReadableLabel = (value = "") =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const DynamicRequirementFields = ({ fields = [], answers = {}, errors = {}, onChange }) => {
  const answeredCount = useMemo(
    () =>
      fields.filter((field) => {
        const value = answers[field.key];
        return field.inputType === "checkbox" ? value === true : String(value || "").trim().length > 0;
      }).length,
    [fields, answers]
  );

  const fieldsBySection = useMemo(
    () =>
      fields.reduce((acc, field) => {
        const section = field.section || "Other";
        if (!acc[section]) acc[section] = [];
        acc[section].push(field);
        return acc;
      }, {}),
    [fields]
  );

  if (!fields.length) {
    return (
      <div className="p-4 rounded-lg border border-dashed border-opacityClr-30 bg-opacityClr-10">
        <p className="text-sm text-opacityClr-70">
          No extra requirements configured for this property type yet. You can continue with the base property fields.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4 rounded-xl border border-opacityClr-30 bg-white">
      <div className="flex flex-col gap-1">
        <h3 className="text-primary-10 font-Raleway font-bold text-lg">Listing Requirements</h3>
        <p className="text-sm text-opacityClr-70">
          Complete the sections below. Required items must be filled before saving this property.
        </p>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-opacityClr-10 border border-opacityClr-20">
        <p className="text-sm font-medium text-primary-10">Progress</p>
        <p className="text-sm font-semibold text-primary-10">
          {answeredCount}/{fields.length} completed
        </p>
      </div>

      {Object.entries(fieldsBySection).map(([sectionName, sectionFields]) => (
        <div key={sectionName} className="p-4 rounded-xl border border-opacityClr-30 bg-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-primary-10">{sectionName}</h4>
            <span className="text-xs font-medium text-opacityClr-60">
              {
                sectionFields.filter((field) => {
                  const value = answers[field.key];
                  return field.inputType === "checkbox" ? value === true : String(value || "").trim().length > 0;
                }).length
              }
              /{sectionFields.length}
            </span>
          </div>

          {sectionFields.map((field) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-primary-10">
                {toReadableLabel(field.label)} {field.required ? "*" : ""}
              </label>

              {field.inputType === "select" ? (
                <select
                  value={answers[field.key] ?? ""}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  className="border rounded-lg p-3 outline-none bg-white"
                >
                  <option value="">Select option</option>
                  {(field.options || []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.inputType === "checkbox" ? (
                <label className="inline-flex items-center gap-2 rounded-lg border border-opacityClr-20 bg-opacityClr-5 px-3 py-2 w-fit">
                  <input type="checkbox" checked={answers[field.key] === true} onChange={(event) => onChange(field.key, event.target.checked)} />
                  <span className="text-sm text-opacityClr-80">Marked as provided</span>
                </label>
              ) : (
                <input
                  type={field.inputType === "number" ? "number" : "text"}
                  value={answers[field.key] ?? ""}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  placeholder={field.inputType === "number" ? "Enter amount" : "Enter value"}
                  className="border rounded-lg px-4 py-3 outline-none"
                />
              )}

              {errors[field.key] && <p className="text-xs text-red-500">{errors[field.key]}</p>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DynamicRequirementFields;
