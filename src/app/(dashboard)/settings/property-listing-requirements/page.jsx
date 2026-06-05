"use client";

import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import TabButton from "@/components/ui/TabButton";
import RentalUnitsTable from "@/components/views/RentalUnitsTable";
import VacancyExpectationTable from "@/components/views/VacancyExpectationTable";
import DocumentationTable from "@/components/views/DocumentationTable";
import OperatingExpensesTable from "@/components/views/OperatingExpensesTable";
import CapRateFactorsTable from "@/components/views/CapRateFactorsTable";
import { PROPERTY_TYPES, createDefaultRequirementsByType, createEmptyRequirementsTemplate } from "@/constants/propertyRequirements";
import { getAllRequirementTemplates, saveRequirementTemplateByType } from "@/services/propertyRequirementsDummyStore";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

const PropertyListingRequirements = () => {
  const [activePropertyType, setActivePropertyType] = useState("Residential");
  const [requirementsByType, setRequirementsByType] = useState(createDefaultRequirementsByType());
  const [isDirty, setIsDirty] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openSection, setOpenSection] = useState("unitProfile");

  useEffect(() => {
    setRequirementsByType(getAllRequirementTemplates());
    setIsLoaded(true);
  }, []);

  // Get current property type's data
  const currentData = requirementsByType[activePropertyType] || createEmptyRequirementsTemplate();
  const rentalUnits = currentData.rentalUnits || [];
  const vacancyExpectation = currentData.vacancyExpectation || { options: [], value: "" };
  const documentation = currentData.documentation || [];
  const operatingExpenses = currentData.operatingExpenses || [];
  const capRateFactors = currentData.capRateFactors || [];

  const updateCurrentType = (patch) => {
    setRequirementsByType((prev) => ({
      ...prev,
      [activePropertyType]: {
        ...prev[activePropertyType],
        ...patch,
      },
    }));
    setIsDirty(true);
  };

  // Update rental units for current property type
  const updateRentalUnits = (newRentalUnits) => {
    updateCurrentType({ rentalUnits: newRentalUnits });
  };

  // Update vacancy expectation for current property type
  const updateVacancyExpectation = (newVacancyData) => {
    updateCurrentType({ vacancyExpectation: newVacancyData });
  };

  // Update documentation for current property type
  const updateDocumentation = (newDocuments) => {
    updateCurrentType({ documentation: newDocuments });
  };

  // Update operating expenses for current property type
  const updateOperatingExpenses = (newExpenses) => {
    updateCurrentType({ operatingExpenses: newExpenses });
  };

  // Update cap rate factors for current property type
  const updateCapRateFactors = (newFactors) => {
    updateCurrentType({ capRateFactors: newFactors });
  };

  const handleSaveTemplate = () => {
    saveRequirementTemplateByType(activePropertyType, requirementsByType[activePropertyType], "admin");
    setIsDirty(false);
  };

  const sections = useMemo(
    () => [
      {
        key: "unitProfile",
        title: "Step 1: Unit Profile",
        description: "Set unit structure and rent assumptions for this property type.",
        count: rentalUnits.length,
        component: <RentalUnitsTable rentalUnits={rentalUnits} onChange={updateRentalUnits} />,
      },
      {
        key: "documentation",
        title: "Step 2: Required Documentation",
        description: "Define legal/operational documents admins must provide during listing.",
        count: documentation.length,
        component: <DocumentationTable documents={documentation} onChange={updateDocumentation} />,
      },
      {
        key: "vacancy",
        title: "Step 3: Vacancy Expectations",
        description: "Configure market vacancy assumptions used in evaluation.",
        count: (vacancyExpectation.options || []).length,
        component: <VacancyExpectationTable vacancyData={vacancyExpectation} onChange={updateVacancyExpectation} />,
      },
      {
        key: "opex",
        title: "Step 4: Operating Expenses",
        description: "Capture recurring cost inputs required for underwriting.",
        count: operatingExpenses.length,
        component: <OperatingExpensesTable expenses={operatingExpenses} onChange={updateOperatingExpenses} />,
      },
      {
        key: "capRate",
        title: "Step 5: Cap Rate Factors",
        description: "Add cap-rate drivers and available options for each.",
        count: capRateFactors.length,
        component: <CapRateFactorsTable factors={capRateFactors} onChange={updateCapRateFactors} />,
      },
    ],
    [rentalUnits, documentation, vacancyExpectation, operatingExpenses, capRateFactors]
  );

  const completedSections = sections.filter((section) => section.count > 0).length;

  return (
    <div className="flex flex-col gap-6 px-6 w-full pb-10">
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Property Listing Requirements" }]} />

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1 items-start">
          <h2 className="text-primary-10 font-Raleway font-bold text-[28px]">
            Property Listing <span className="text-primary-20">Requirements</span>
          </h2>
          <p className="text-sm font-Raleway font-medium text-primary-10">
            Use this guided template builder to define what admins must provide when listing a property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-xl border border-opacityClr-30">
            <p className="text-xs text-opacityClr-60 font-medium">Property Type</p>
            <p className="text-base font-semibold text-primary-10">{activePropertyType}</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-opacityClr-30">
            <p className="text-xs text-opacityClr-60 font-medium">Progress</p>
            <p className="text-base font-semibold text-primary-10">
              {completedSections}/{sections.length} sections configured
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-opacityClr-30">
            <p className="text-xs text-opacityClr-60 font-medium">Template State</p>
            <p className={`text-base font-semibold ${isDirty ? "text-amber-600" : "text-emerald-600"}`}>
              {isDirty ? "Unsaved changes" : "Saved"}
            </p>
          </div>
        </div>

        <div className="sticky top-0 z-10 flex items-center justify-end gap-2 p-3 bg-[#F8F8F8] rounded-xl border border-opacityClr-20">
          <button
            type="button"
            onClick={() => {
              setRequirementsByType(getAllRequirementTemplates());
              setIsDirty(false);
            }}
            className="px-4 py-2 rounded-lg border border-opacityClr-30 text-primary-10 font-semibold"
          >
            Reload Saved
          </button>
          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={!isLoaded || !isDirty}
            className="px-4 py-2 rounded-lg bg-primary-10 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Template
          </button>
        </div>

        {/* Property Type Tabs */}
        <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
          {PROPERTY_TYPES.map((type) => (
            <TabButton key={type} label={type} isActive={activePropertyType === type} onClick={() => setActivePropertyType(type)} />
          ))}
        </div>

        {/* Content */}
        <div className="w-full">
          <div className="flex flex-col gap-4">
            {sections.map((section) => {
              const isOpen = openSection === section.key;
              return (
                <div key={section.key} className="rounded-2xl border border-opacityClr-30 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenSection((prev) => (prev === section.key ? "" : section.key))}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-opacityClr-5 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-primary-10 font-bold text-lg">{section.title}</h3>
                        {section.count > 0 && <CheckCircle2 size={16} className="text-emerald-600" />}
                      </div>
                      <p className="text-sm text-opacityClr-70">{section.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-opacityClr-10 text-primary-10">
                        {section.count} configured
                      </span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  {isOpen && <div className="p-5 pt-0">{section.component}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingRequirements;
