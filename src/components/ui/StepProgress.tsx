"use client";

import React from "react";

type Step = {
  id: number;
  label: string;
};

type StepProgressProps = {
  steps: Step[];
  currentStep: number;
};

export default function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0 w-full">
        {steps.map((step, index) => {
          const isComplete = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className={`flex items-center ${isLast ? "" : "md:flex-1"}`}>
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold font-Raleway transition-colors ${
                    isComplete
                      ? "bg-primary-10 text-white"
                      : isCurrent
                      ? "bg-primary-10 text-white ring-4 ring-primary-10/15"
                      : "bg-opacityClr-10 text-opacityClr-60"
                  }`}
                >
                  {isComplete ? "✓" : step.id}
                </span>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-sm font-Raleway font-semibold truncate ${
                      isCurrent ? "text-primary-10" : isComplete ? "text-primary-20" : "text-opacityClr-60"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && <span className="text-xs font-Raleway text-opacityClr-60">In progress</span>}
                </div>
              </div>

              {!isLast && (
                <div
                  className={`hidden md:block h-0.5 flex-1 mx-4 rounded-full ${
                    isComplete ? "bg-primary-10" : "bg-opacityClr-20"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
