"use client";

import React from "react";
import { Eye, Loader2, Users } from "lucide-react";
import { useDrawerModal } from "@/context/DrawerModalContext";
import useFacilityManagerAPI from "@/services/useFacilityManagerAPI";
import ViewAssistantManagerDrawer from "@/components/views/ViewAssistantManagerDrawer";
import type { FacilityManagerAssistant } from "@/lib/facility-manager/types";

type FacilityManagerAssistantsSectionProps = {
  managerId: string;
};

function formatPhone(phone?: { code?: string; number?: string }) {
  if (!phone?.number) return "—";
  return `${phone.code || ""} ${phone.number}`.trim();
}

function statusBadge(assistant: FacilityManagerAssistant) {
  if (assistant.isBlocked) {
    return (
      <span className="inline-flex items-center gap-2 px-2 py-[6px] text-xs leading-5 rounded-lg bg-[#DBC8C0] text-[#9F471B]">
        <span className="w-2 h-2 rounded-full bg-[#9F471B]" />
        Blocked
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-2 py-[6px] text-xs leading-5 rounded-lg bg-[#CEDDB7] text-[#6D9F1B]">
      <span className="w-2 h-2 rounded-full bg-[#6D9F1B]" />
      Active
    </span>
  );
}

const FacilityManagerAssistantsSection = ({ managerId }: FacilityManagerAssistantsSectionProps) => {
  const { openModal } = useDrawerModal();
  const { assistants, isLoadingAssistants, assistantsError } = useFacilityManagerAPI({
    managerId,
    enableAssistants: true,
  });

  return (
    <div className="rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-10/10 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-primary-10" />
        </div>
        <div>
          <h3 className="text-lg font-Raleway font-bold text-primary-10">Assistant Managers</h3>
          <p className="text-sm text-gray-600 font-Raleway">
            Assistants linked to this facility manager
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-primary-10 font-Raleway">
          Assistants ({isLoadingAssistants ? "…" : assistants.length})
        </h4>

        {isLoadingAssistants ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 font-Raleway">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading assistants...
          </div>
        ) : assistantsError ? (
          <p className="text-sm text-red-600 font-Raleway">Failed to load assistants.</p>
        ) : assistants.length === 0 ? (
          <p className="text-sm text-gray-500 font-Raleway">No assistant managers yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {assistants.map((assistant) => {
              const fullName =
                [assistant.firstName, assistant.lastName].filter(Boolean).join(" ") || "Assistant";

              return (
                <div
                  key={assistant.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-primary-10 font-Raleway truncate">
                        {fullName}
                      </p>
                      {statusBadge(assistant)}
                    </div>
                    <p className="text-xs text-gray-500 font-Raleway truncate mt-0.5">
                      {assistant.email || "—"} · {formatPhone(assistant.phoneNumber)}
                    </p>
                    <p className="text-xs text-gray-500 font-Raleway mt-0.5">
                      {assistant.assignedPropertyCount} assigned{" "}
                      {assistant.assignedPropertyCount === 1 ? "property" : "properties"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openModal("Assistant details", <ViewAssistantManagerDrawer assistant={assistant} />)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-opacityClr-100 text-opacityClr-100 text-sm font-Raleway hover:bg-opacityClr-10 shrink-0"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityManagerAssistantsSection;
