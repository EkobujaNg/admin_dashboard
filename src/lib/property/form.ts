import type { PropertyDetailsState, PropertyListingType, PropertyRecord } from "./types";
import {
  ADMIN_ADJUST_WITH_OPTIONS,
  calculatePropertyValuation,
  createEmptyRentalUnit,
  createInitialValuationState,
  DEVELOPMENT_OPTIONS,
  INFRASTRUCTURE_OPTIONS,
  PROPERTY_CLASSIFICATION_OPTIONS,
  SECURITY_RISK_OPTIONS,
  TITLE_ADJUSTMENT_OPTIONS,
  VACANCY_OPTIONS,
  type AdminAdjustWith,
  type PropertyClassification,
  type SelectOption,
  type ValuationFormState,
  type ValuationResult,
} from "./valuation";

function matchSelectOption<T extends string | number>(
  options: SelectOption<T>[],
  value: T | null | undefined,
  name?: string
): SelectOption<T> {
  if (name) {
    const byName = options.find((option) => option.name === name);
    if (byName) return byName;
  }

  if (value != null) {
    const byValue = options.find((option) => option.value === value);
    if (byValue) return byValue;

    if (typeof value === "number") {
      const byApprox = options.find((option) => Math.abs(Number(option.value) - value) < 0.0001);
      if (byApprox) return byApprox;
    }
  }

  return options[0];
}

export function mapPropertyToDetailsState(property: PropertyRecord): PropertyDetailsState {
  return {
    name: property.name || property.propertyName || "",
    description: property.description || property.aboutProperty || "",
    propertyType: (property.propertyType as PropertyListingType) || "",
    media: property.media?.length ? property.media : property.imageUrls || [],
    propertyAddress: property.propertyAddress || "",
    city: property.city || "",
    state: property.state || "",
    zip: property.zip || "",
    numberOfShares: String(property.numberOfShares ?? ""),
  };
}

export function mapPropertyToValuationState(property: PropertyRecord): {
  state: ValuationFormState;
  result: ValuationResult | null;
} {
  const valuation = property.propertyValuation;
  if (!valuation) {
    return { state: createInitialValuationState(), result: null };
  }

  const classification = (valuation.propertyClassification || "standard") as PropertyClassification;
  const adminAdjustWith = (valuation.adminAjustWith === "minus" ? "minus" : "plus") as AdminAdjustWith;

  const state: ValuationFormState = {
    rentalUnits:
      valuation.rentalUnits.length > 0
        ? valuation.rentalUnits.map((unit) => ({
            id: unit.id || crypto.randomUUID(),
            unitType: unit.unitType,
            numberOfUnits: unit.numberOfUnits,
            monthlyRentPerUnit: unit.monthlyRentPerUnit,
          }))
        : [createEmptyRentalUnit()],
    vacancy: matchSelectOption(VACANCY_OPTIONS, valuation.vacancyRate, valuation.vacancyRateName),
    securityCost: valuation.securityCost,
    maintenanceCost: valuation.maintenanceCost,
    repairsCost: valuation.repairsCost,
    utilitiesCost: valuation.utilitiesCost,
    managementCost: valuation.managementCost,
    taxCost: valuation.taxCost,
    propertyTier: valuation.propertyTier || 3,
    propertyClassification: matchSelectOption(PROPERTY_CLASSIFICATION_OPTIONS, classification).value,
    titleAdjustment: matchSelectOption(TITLE_ADJUSTMENT_OPTIONS, valuation.titleAdjustment, valuation.titleAdjustmentName),
    securityRiskAdjustment: matchSelectOption(
      SECURITY_RISK_OPTIONS,
      valuation.securityRiskAdjustment,
      valuation.securityRiskAdjustmentName
    ),
    infrastructureAdjustment: matchSelectOption(
      INFRASTRUCTURE_OPTIONS,
      valuation.infrastructureAdjustment,
      valuation.infrastructureAdjustmentName
    ),
    developmentAdjustment: matchSelectOption(
      DEVELOPMENT_OPTIONS,
      valuation.developmentAdjustment,
      valuation.developmentAdjustmentName
    ),
    adminAdjustment: valuation.adminAdjustment ?? 0,
    adminAdjustWith: matchSelectOption(ADMIN_ADJUST_WITH_OPTIONS, adminAdjustWith).value,
  };

  return {
    state,
    result: calculatePropertyValuation(state),
  };
}
