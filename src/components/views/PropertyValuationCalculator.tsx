"use client";

import React, { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  ADMIN_ADJUST_WITH_OPTIONS,
  buildValuationPayload,
  calculatePropertyValuation,
  createEmptyRentalUnit,
  createInitialValuationState,
  DEVELOPMENT_OPTIONS,
  formatNaira,
  formatPercent,
  getAnnualRentForUnit,
  INFRASTRUCTURE_OPTIONS,
  PROPERTY_CLASSIFICATION_OPTIONS,
  PROPERTY_TIER_OPTIONS,
  SECURITY_RISK_OPTIONS,
  TITLE_ADJUSTMENT_OPTIONS,
  VACANCY_OPTIONS,
  type RentalUnit,
  type SelectOption,
  type ValuationFormState,
  type ValuationResult,
} from "@/lib/property/valuation";

const inputClassName =
  "w-full p-4 rounded-lg border border-opacityClr-50 text-opacityClr-100 outline-none focus:border-opacityClr-100 placeholder:text-opacityClr-30 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out";

const selectClassName =
  "w-full p-4 rounded-lg border border-opacityClr-50 text-opacityClr-100 outline-none focus:border-opacityClr-100 font-Raleway transition-all duration-300 ease-in-out bg-white";

const labelClassName = "text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100";

const sectionTitleClassName =
  "text-primary-10 text-lg font-bold font-Raleway leading-normal border-b border-opacityClr-20 pb-3";

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <label className={labelClassName}>{label}</label>
      {children}
    </div>
  );
}

type PropertyValuationCalculatorProps = {
  state?: ValuationFormState;
  onStateChange?: (state: ValuationFormState) => void;
  result?: ValuationResult | null;
  onResultChange?: (result: ValuationResult | null) => void;
  hasCalculated?: boolean;
  onHasCalculatedChange?: (value: boolean) => void;
  onChange?: (state: ValuationFormState, result: ValuationResult | null, payload: ReturnType<typeof buildValuationPayload>) => void;
  hideHeader?: boolean;
  collapseAdvanced?: boolean;
};

export default function PropertyValuationCalculator({
  state: controlledState,
  onStateChange,
  result: controlledResult,
  onResultChange,
  hasCalculated: controlledHasCalculated,
  onHasCalculatedChange,
  onChange,
  hideHeader = false,
  collapseAdvanced = true,
}: PropertyValuationCalculatorProps) {
  const [showAdvanced, setShowAdvanced] = useState(!collapseAdvanced);
  const [internalState, setInternalState] = useState<ValuationFormState>(createInitialValuationState);
  const [internalResult, setInternalResult] = useState<ValuationResult | null>(null);
  const [internalHasCalculated, setInternalHasCalculated] = useState(false);

  const state = controlledState ?? internalState;
  const result = controlledResult ?? internalResult;
  const hasCalculated = controlledHasCalculated ?? internalHasCalculated;

  const setState = (next: ValuationFormState) => {
    if (onStateChange) onStateChange(next);
    else setInternalState(next);
    onChange?.(next, result, buildValuationPayload(next));
  };

  const setResult = (next: ValuationResult | null) => {
    if (onResultChange) onResultChange(next);
    else setInternalResult(next);
  };

  const setHasCalculated = (next: boolean) => {
    if (onHasCalculatedChange) onHasCalculatedChange(next);
    else setInternalHasCalculated(next);
  };

  const updateState = (patch: Partial<ValuationFormState>) => {
    setState({ ...state, ...patch });
  };

  const updateRentalUnits = (rentalUnits: RentalUnit[]) => {
    updateState({ rentalUnits });
  };

  const handleAddUnit = () => {
    updateRentalUnits([...state.rentalUnits, createEmptyRentalUnit()]);
  };

  const handleRemoveUnit = (id: string) => {
    if (state.rentalUnits.length === 1) return;
    updateRentalUnits(state.rentalUnits.filter((unit) => unit.id !== id));
  };

  const handleUnitChange = (id: string, field: keyof RentalUnit, value: string) => {
    updateRentalUnits(
      state.rentalUnits.map((unit) => {
        if (unit.id !== id) return unit;

        if (field === "unitType") {
          return { ...unit, unitType: value };
        }

        return {
          ...unit,
          [field]: Number(value) || 0,
        };
      })
    );
  };

  const handleNumberChange = (field: keyof ValuationFormState, value: string) => {
    updateState({ [field]: Number(value) || 0 } as Partial<ValuationFormState>);
  };

  const handleSelectOption = <T extends string | number>(
    field: keyof ValuationFormState,
    options: SelectOption<T>[],
    value: string
  ) => {
    const selected = options.find((option) => String(option.value) === value);
    if (selected) {
      updateState({ [field]: selected } as Partial<ValuationFormState>);
    }
  };

  const handleCalculate = () => {
    const nextResult = calculatePropertyValuation(state);
    setResult(nextResult);
    setHasCalculated(true);
    onChange?.(state, nextResult, buildValuationPayload(state));
  };

  const liveGrossRent = useMemo(() => state.rentalUnits.reduce((sum, unit) => sum + getAnnualRentForUnit(unit), 0), [state.rentalUnits]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {!hideHeader && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-Raleway font-bold text-primary-10">Property Valuation Calculator (Multi-Unit)</h2>
          <p className="text-sm font-Raleway font-medium text-opacityClr-80">
            Enter rental units, operating expenses, and cap rate factors to estimate property value.
          </p>
        </div>
      )}

      <section className="flex flex-col gap-4 w-full">
        <h3 className={sectionTitleClassName}>Rental Units</h3>

        <div className="rounded-lg border border-opacityClr-30 bg-white overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-opacityClr-10">
              <tr>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">Unit Type / Name</th>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">No. of Units</th>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">Monthly Rent per Unit (₦)</th>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">Annual Rent (₦)</th>
                <th className="text-left px-4 py-3 text-primary-10 font-Raleway font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.rentalUnits.map((unit) => (
                <tr key={unit.id} className="border-b border-opacityClr-20">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={unit.unitType}
                      onChange={(e) => handleUnitChange(unit.id, "unitType", e.target.value)}
                      placeholder="2-Bed Flat"
                      className="w-full px-3 py-2 rounded-lg border border-opacityClr-30 text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={unit.numberOfUnits}
                      onChange={(e) => handleUnitChange(unit.id, "numberOfUnits", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-opacityClr-30 text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={unit.monthlyRentPerUnit}
                      onChange={(e) => handleUnitChange(unit.id, "monthlyRentPerUnit", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-opacityClr-30 text-primary-10 font-Raleway text-sm outline-none focus:border-primary-10"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-primary-10 font-Raleway text-sm font-medium">
                      {formatNaira(getAnnualRentForUnit(unit))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveUnit(unit.id)}
                      disabled={state.rentalUnits.length === 1}
                      className="flex items-center justify-center w-9 h-9 rounded-lg border border-red-200 bg-transparent hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="text-red-500 w-[14px] h-[14px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleAddUnit}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-neutral-lightGreen rounded-md text-primary-10 font-Raleway text-base font-semibold leading-[150%] cursor-pointer"
          >
            <Plus className="w-[14px] h-[14px]" />
            Add Unit
          </button>
          <p className="text-sm font-Raleway font-medium text-opacityClr-80">
            Gross rent preview: <span className="font-semibold text-primary-10">{formatNaira(liveGrossRent)}</span>
          </p>
        </div>

        <Field label="Vacancy Expectation">
          <select
            value={state.vacancy.value}
            onChange={(e) => handleSelectOption("vacancy", VACANCY_OPTIONS, e.target.value)}
            className={selectClassName}
          >
            {VACANCY_OPTIONS.map((option) => (
              <option key={option.name} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="flex flex-col gap-4 w-full">
        <h3 className={sectionTitleClassName}>Operating Expenses (Annual)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Field label="Security Payments (₦)">
            <input type="number" min="0" value={state.securityCost} onChange={(e) => handleNumberChange("securityCost", e.target.value)} className={inputClassName} />
          </Field>
          <Field label="Maintenance (₦)">
            <input type="number" min="0" value={state.maintenanceCost} onChange={(e) => handleNumberChange("maintenanceCost", e.target.value)} className={inputClassName} />
          </Field>
          <Field label="Repairs Allowance (₦)">
            <input type="number" min="0" value={state.repairsCost} onChange={(e) => handleNumberChange("repairsCost", e.target.value)} className={inputClassName} />
          </Field>
          <Field label="Utilities / Common Services (₦)">
            <input type="number" min="0" value={state.utilitiesCost} onChange={(e) => handleNumberChange("utilitiesCost", e.target.value)} className={inputClassName} />
          </Field>
          <Field label="Management Fee (₦)">
            <input type="number" min="0" value={state.managementCost} onChange={(e) => handleNumberChange("managementCost", e.target.value)} className={inputClassName} />
          </Field>
          <Field label="Land Use Charge / Property Tax (₦)">
            <input type="number" min="0" value={state.taxCost} onChange={(e) => handleNumberChange("taxCost", e.target.value)} className={inputClassName} />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-4 w-full">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className={sectionTitleClassName}>Cap Rate Factors & Admin Adjustment</h3>
          <span className="text-sm font-Raleway font-semibold text-primary-20 shrink-0 ml-4">
            {showAdvanced ? "Hide" : "Show"} advanced
          </span>
        </button>

        {showAdvanced && (
          <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Field label="Property Tier (Location Quality)">
                <select
                  value={state.propertyTier}
                  onChange={(e) => updateState({ propertyTier: Number(e.target.value) })}
                  className={selectClassName}
                >
                  {PROPERTY_TIER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Property Classification">
                <select
                  value={state.propertyClassification}
                  onChange={(e) =>
                    updateState({ propertyClassification: e.target.value as ValuationFormState["propertyClassification"] })
                  }
                  className={selectClassName}
                >
                  {PROPERTY_CLASSIFICATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Title Status">
                <select
                  value={state.titleAdjustment.value}
                  onChange={(e) => handleSelectOption("titleAdjustment", TITLE_ADJUSTMENT_OPTIONS, e.target.value)}
                  className={selectClassName}
                >
                  {TITLE_ADJUSTMENT_OPTIONS.map((option) => (
                    <option key={option.name} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Security Level">
                <select
                  value={state.securityRiskAdjustment.value}
                  onChange={(e) => handleSelectOption("securityRiskAdjustment", SECURITY_RISK_OPTIONS, e.target.value)}
                  className={selectClassName}
                >
                  {SECURITY_RISK_OPTIONS.map((option) => (
                    <option key={option.name} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Infrastructure Quality">
                <select
                  value={state.infrastructureAdjustment.value}
                  onChange={(e) => handleSelectOption("infrastructureAdjustment", INFRASTRUCTURE_OPTIONS, e.target.value)}
                  className={selectClassName}
                >
                  {INFRASTRUCTURE_OPTIONS.map((option) => (
                    <option key={option.name} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Development Stage">
                <select
                  value={state.developmentAdjustment.value}
                  onChange={(e) => handleSelectOption("developmentAdjustment", DEVELOPMENT_OPTIONS, e.target.value)}
                  className={selectClassName}
                >
                  {DEVELOPMENT_OPTIONS.map((option) => (
                    <option key={option.name} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Adjustment Value (%)">
                <input
                  type="number"
                  min="0"
                  value={state.adminAdjustment}
                  onChange={(e) => handleNumberChange("adminAdjustment", e.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Apply Adjustment As">
                <select
                  value={state.adminAdjustWith}
                  onChange={(e) => updateState({ adminAdjustWith: e.target.value as ValuationFormState["adminAdjustWith"] })}
                  className={selectClassName}
                >
                  {ADMIN_ADJUST_WITH_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={handleCalculate}
        className="w-full md:w-fit px-8 py-4 bg-primary-10 text-white font-Raleway font-bold text-base rounded-lg transition-all duration-300 hover:bg-primary-20"
      >
        Calculate Property Value
      </button>

      {hasCalculated && result && (
        <div className="rounded-xl border border-[#B9D9F5] bg-[#F1F9FF] p-6 w-full">
          <h3 className="text-primary-10 text-lg font-bold font-Raleway leading-normal mb-4">Valuation Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base font-Raleway text-primary-10">
            <p>Gross Rent: <span className="font-semibold">{formatNaira(result.grossRent)}</span></p>
            <p>Effective Gross Income: <span className="font-semibold">{formatNaira(result.effectiveGrossIncome)}</span></p>
            <p>Total Operating Expenses: <span className="font-semibold">{formatNaira(result.totalOperatingExpenses)}</span></p>
            <p>Net Operating Income (NOI): <span className="font-semibold">{formatNaira(result.noi)}</span></p>
            <p>Cap Rate: <span className="font-semibold">{formatPercent(result.capRate)}</span></p>
            <p>Estimated Property Value: <span className="font-semibold">{formatNaira(result.estimatedPropertyValue)}</span></p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#B9D9F5]">
            <p className="text-sm font-Raleway font-medium text-opacityClr-80">Final Adjusted Property Value</p>
            <p className="text-[32px] font-Raleway font-bold text-primary-10 mt-1">{formatNaira(result.adjustedPropertyValue)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
