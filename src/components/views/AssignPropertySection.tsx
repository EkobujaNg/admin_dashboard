"use client";

import React, { useMemo, useState } from "react";
import Select from "react-select";
import { Building2, Loader2, X } from "lucide-react";
import { customSelectStyles } from "@/lib/utils";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import useFacilityManagerAPI from "@/services/useFacilityManagerAPI";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

type PropertyOption = {
  value: string;
  label: string;
};

type PendingRemoval = {
  propertyId: string;
  propertyName: string;
};

type AssignPropertySectionProps = {
  managerId: string;
};

const AssignPropertySection = ({ managerId }: AssignPropertySectionProps) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyOption | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(null);

  const { properties, isLoadingProperties } = usePropertyAPI({
    enableProperties: true,
    page: 1,
    limit: 100,
  });

  const {
    assignedProperties,
    isLoadingAssignedProperties,
    assignProperty,
    isAssigningProperty,
    removeProperty,
    isRemovingProperty,
  } = useFacilityManagerAPI({
    managerId,
    enableAssignedProperties: true,
  });

  const assignedPropertyIds = useMemo(
    () => new Set(assignedProperties.map((property) => property.propertyId || property.id)),
    [assignedProperties]
  );

  const propertyOptions = useMemo(
    () =>
      (properties?.pageItems || [])
        .filter((property) => !assignedPropertyIds.has(property.propertyId || property.id))
        .map((property) => ({
          value: property.propertyId || property.id,
          label: property.name || property.propertyName || "Untitled Property",
        })),
    [properties?.pageItems, assignedPropertyIds]
  );

  const handleAssign = () => {
    if (!selectedProperty?.value) return;

    assignProperty(managerId, selectedProperty.value, {
      onSuccess: () => setSelectedProperty(null),
    });
  };

  const handleRemoveClick = (propertyId: string, propertyName: string) => {
    setPendingRemoval({ propertyId, propertyName });
  };

  const handleConfirmRemove = () => {
    if (!pendingRemoval) return;

    removeProperty(managerId, pendingRemoval.propertyId, {
      onSuccess: () => setPendingRemoval(null),
    });
  };

  return (
    <div className="rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-10/10 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-primary-10" />
        </div>
        <div>
          <h3 className="text-lg font-Raleway font-bold text-primary-10">Assign Property</h3>
          <p className="text-sm text-gray-600 font-Raleway">Link a property to this facility manager</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-Raleway">Property</label>
          <Select
            options={propertyOptions}
            value={selectedProperty}
            isLoading={isLoadingProperties}
            className="basic-select"
            classNamePrefix="select"
            styles={customSelectStyles}
            onChange={(option) => setSelectedProperty(option as PropertyOption | null)}
            placeholder={isLoadingProperties ? "Loading properties..." : "Select a property..."}
            isClearable
          />
        </div>

        <button
          type="button"
          onClick={handleAssign}
          disabled={!selectedProperty?.value || isAssigningProperty}
          className="px-6 py-3 bg-primary-10 text-white rounded-lg font-Raleway font-semibold text-sm hover:bg-opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:min-w-[160px]"
        >
          {isAssigningProperty && <Loader2 className="w-4 h-4 animate-spin" />}
          {isAssigningProperty ? "Assigning..." : "Assign Property"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-primary-10 font-Raleway">
          Assigned Properties ({assignedProperties.length})
        </h4>

        {isLoadingAssignedProperties ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 font-Raleway">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading assigned properties...
          </div>
        ) : assignedProperties.length === 0 ? (
          <p className="text-sm text-gray-500 font-Raleway">No properties assigned yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {assignedProperties.map((property) => {
              const propertyId = property.propertyId || property.id;

              return (
                <div
                  key={propertyId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary-10 font-Raleway truncate">
                      {property.name || property.propertyName || "Untitled Property"}
                    </p>
                    {property.propertyLocation && (
                      <p className="text-xs text-gray-500 font-Raleway truncate">{property.propertyLocation}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveClick(
                        propertyId,
                        property.name || property.propertyName || "this property"
                      )
                    }
                    disabled={isRemovingProperty}
                    className="p-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                    aria-label="Remove property"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={Boolean(pendingRemoval)}
        onClose={() => setPendingRemoval(null)}
        onConfirm={handleConfirmRemove}
        message={`Remove "${pendingRemoval?.propertyName}" from this facility manager?`}
        confirmMsg="Yes, Remove"
        cancelMsg="No, Cancel"
      />
    </div>
  );
};

export default AssignPropertySection;
