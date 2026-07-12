"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { getPasswordRequirementStatus } from "@/lib/validation/common";

type PasswordRequirementsChecklistProps = {
  password: string;
};

const PasswordRequirementsChecklist = ({ password }: PasswordRequirementsChecklistProps) => {
  const requirements = getPasswordRequirementStatus(password);

  return (
    <ul className="flex flex-col gap-1 w-full">
      {requirements.map((requirement) => (
        <li key={requirement.id} className="flex items-center gap-2">
          {requirement.met ? (
            <CheckCircle2 size={16} className="text-[#6D9F1B] shrink-0" />
          ) : (
            <Circle size={16} className="text-opacityClr-50 shrink-0" />
          )}
          <span
            className={`text-sm font-Raleway ${
              requirement.met ? "text-[#6D9F1B]" : "text-opacityClr-50"
            }`}
          >
            {requirement.label}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PasswordRequirementsChecklist;
