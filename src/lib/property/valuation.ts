import type { CreatePropertyPayload, PropertyListingType, UpdatePropertyPayload } from "./types";

export type SelectOption<T extends string | number = number> = {
  value: T;
  name: string;
};

export type RentalUnit = {
  id: string;
  unitType: string;
  numberOfUnits: number;
  monthlyRentPerUnit: number;
};

export type PropertyClassification = "standard" | "premium" | "budget";

export type AdminAdjustWith = "plus" | "minus";

export type ExpenseInput = number | "";

export type ValuationFormState = {
  rentalUnits: RentalUnit[];
  vacancy: SelectOption<number>;
  securityCost: ExpenseInput;
  maintenanceCost: ExpenseInput;
  repairsCost: ExpenseInput;
  utilitiesCost: ExpenseInput;
  managementCost: ExpenseInput;
  taxCost: ExpenseInput;
  propertyTier: number;
  propertyClassification: PropertyClassification;
  titleAdjustment: SelectOption<number>;
  securityRiskAdjustment: SelectOption<number>;
  infrastructureAdjustment: SelectOption<number>;
  developmentAdjustment: SelectOption<number>;
  adminAdjustment: number;
  adminAdjustWith: AdminAdjustWith;
};

function toExpenseNumber(value: ExpenseInput): number {
  if (value === "" || value == null) return 0;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export type ValuationResult = {
  grossRent: number;
  effectiveGrossIncome: number;
  totalOperatingExpenses: number;
  noi: number;
  capRate: number;
  estimatedPropertyValue: number;
  adjustedPropertyValue: number;
};

export type ValuationPayload = {
  vacancy: SelectOption<number>;
  securityCost: number;
  maintenanceCost: number;
  repairsCost: number;
  utilitiesCost: number;
  managementCost: number;
  taxCost: number;
  propertyTier: number;
  propertyClassification: PropertyClassification;
  titleAdjustment: SelectOption<number>;
  securityRiskAdjustment: SelectOption<number>;
  infrastructureAdjustment: SelectOption<number>;
  developmentAdjustment: SelectOption<number>;
  rentalUnits: Array<{
    unitType: string;
    numberOfUnits: number;
    monthlyRentPerUnit: number;
  }>;
  adminAdjustment: number;
  adminAjustWith: AdminAdjustWith;
};

export const VACANCY_OPTIONS: SelectOption<number>[] = [
  { value: 0.05, name: "Prime Estate (5%)" },
  { value: 0.1, name: "Middle Market (10%)" },
  { value: 0.15, name: "Low Income / Risky (15%)" },
];

export const PROPERTY_TIER_OPTIONS: SelectOption<number>[] = [
  { value: 1, name: "Tier 1 (Prime)" },
  { value: 2, name: "Tier 2 (Upper Middle)" },
  { value: 3, name: "Tier 3 (Middle)" },
  { value: 4, name: "Tier 4 (Lower Middle)" },
  { value: 5, name: "Tier 5 (High Risk)" },
];

export const PROPERTY_CLASSIFICATION_OPTIONS: SelectOption<PropertyClassification>[] = [
  { value: "standard", name: "Standard" },
  { value: "premium", name: "Premium Residential" },
  { value: "budget", name: "Low-Income / Edge" },
];

export const TITLE_ADJUSTMENT_OPTIONS: SelectOption<number>[] = [
  { value: 0, name: "C of O / Supreme Court (0%)" },
  { value: 0.01, name: "Governor's Consent (+1%)" },
  { value: 0.02, name: "Registered Deed (+2%)" },
  { value: 0.04, name: "Omo-Onile (+4%)" },
];

export const SECURITY_RISK_OPTIONS: SelectOption<number>[] = [
  { value: 0, name: "Gated & Secure (0%)" },
  { value: 0.01, name: "Fair (+1%)" },
  { value: 0.03, name: "High Risk (+3%)" },
];

export const INFRASTRUCTURE_OPTIONS: SelectOption<number>[] = [
  { value: 0, name: "Good (0%)" },
  { value: 0.01, name: "Moderate (+1%)" },
  { value: 0.02, name: "Poor (+2%)" },
];

export const DEVELOPMENT_OPTIONS: SelectOption<number>[] = [
  { value: -0.01, name: "Growing (-1%)" },
  { value: 0, name: "Stable (0%)" },
  { value: 0.01, name: "Declining (+1%)" },
];

export const ADMIN_ADJUST_WITH_OPTIONS: SelectOption<AdminAdjustWith>[] = [
  { value: "plus", name: "Plus (+)" },
  { value: "minus", name: "Minus (-)" },
];

const CAP_RATE_TABLE: Record<PropertyClassification, Record<number, number>> = {
  standard: { 1: 0.05, 2: 0.07, 3: 0.08, 4: 0.12, 5: 0.16 },
  premium: { 1: 0.045, 2: 0.065, 3: 0.07, 4: 0.115, 5: 0.155 },
  budget: { 1: 0.09, 2: 0.11, 3: 0.13, 4: 0.17, 5: 0.22 },
};

export function createEmptyRentalUnit(): RentalUnit {
  return {
    id: crypto.randomUUID(),
    unitType: "",
    numberOfUnits: 1,
    monthlyRentPerUnit: 0,
  };
}

export function getAnnualRentForUnit(unit: RentalUnit): number {
  return unit.numberOfUnits * unit.monthlyRentPerUnit * 12;
}

function getGrossRent(rentalUnits: RentalUnit[]): number {
  return rentalUnits.reduce((total, unit) => total + getAnnualRentForUnit(unit), 0);
}

function getBaseCapRate(propertyTier: number, propertyClassification: PropertyClassification): number {
  return CAP_RATE_TABLE[propertyClassification][propertyTier] ?? CAP_RATE_TABLE.standard[propertyTier];
}

export function calculatePropertyValuation(state: ValuationFormState): ValuationResult {
  const grossRent = getGrossRent(state.rentalUnits);

  const totalOperatingExpenses =
    toExpenseNumber(state.securityCost) +
    toExpenseNumber(state.maintenanceCost) +
    toExpenseNumber(state.repairsCost) +
    toExpenseNumber(state.utilitiesCost) +
    toExpenseNumber(state.managementCost) +
    toExpenseNumber(state.taxCost);

  const capRate =
    getBaseCapRate(state.propertyTier, state.propertyClassification) +
    state.titleAdjustment.value +
    state.securityRiskAdjustment.value +
    state.infrastructureAdjustment.value +
    state.developmentAdjustment.value;

  const effectiveGrossIncome = grossRent * (1 - state.vacancy.value);
  const noi = effectiveGrossIncome - totalOperatingExpenses;
  const safeCapRate = capRate > 0 ? capRate : 0.0001;
  const estimatedPropertyValue = noi / safeCapRate;

  const adjustmentFactor = state.adminAdjustment / 100;
  const adjustedPropertyValue =
    state.adminAdjustWith === "plus"
      ? estimatedPropertyValue * (1 + adjustmentFactor)
      : estimatedPropertyValue * (1 - adjustmentFactor);

  return {
    grossRent,
    effectiveGrossIncome,
    totalOperatingExpenses,
    noi,
    capRate,
    estimatedPropertyValue,
    adjustedPropertyValue,
  };
}

export function buildValuationPayload(state: ValuationFormState): ValuationPayload {
  return {
    vacancy: state.vacancy,
    securityCost: toExpenseNumber(state.securityCost),
    maintenanceCost: toExpenseNumber(state.maintenanceCost),
    repairsCost: toExpenseNumber(state.repairsCost),
    utilitiesCost: toExpenseNumber(state.utilitiesCost),
    managementCost: toExpenseNumber(state.managementCost),
    taxCost: toExpenseNumber(state.taxCost),
    propertyTier: state.propertyTier,
    propertyClassification: state.propertyClassification,
    titleAdjustment: state.titleAdjustment,
    securityRiskAdjustment: state.securityRiskAdjustment,
    infrastructureAdjustment: state.infrastructureAdjustment,
    developmentAdjustment: state.developmentAdjustment,
    rentalUnits: state.rentalUnits.map(({ unitType, numberOfUnits, monthlyRentPerUnit }) => ({
      unitType,
      numberOfUnits,
      monthlyRentPerUnit,
    })),
    adminAdjustment: state.adminAdjustment,
    adminAjustWith: state.adminAdjustWith,
  };
}

export function createInitialValuationState(): ValuationFormState {
  return {
    rentalUnits: [createEmptyRentalUnit()],
    vacancy: VACANCY_OPTIONS[0],
    securityCost: "",
    maintenanceCost: "",
    repairsCost: "",
    utilitiesCost: "",
    managementCost: "",
    taxCost: "",
    propertyTier: 3,
    propertyClassification: "standard",
    titleAdjustment: TITLE_ADJUSTMENT_OPTIONS[0],
    securityRiskAdjustment: SECURITY_RISK_OPTIONS[0],
    infrastructureAdjustment: INFRASTRUCTURE_OPTIONS[0],
    developmentAdjustment: DEVELOPMENT_OPTIONS[1],
    adminAdjustment: 0,
    adminAdjustWith: "plus",
  };
}

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString()}`;
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

type PropertyDetailsPayloadInput = {
  name: string;
  description: string;
  aboutProperty: string[];
  propertyType: PropertyListingType | "";
  media: string[];
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  numberOfShares: string | number;
  presale: string | number;
};

export function buildCreatePropertyPayload(
  details: PropertyDetailsPayloadInput,
  valuationState: ValuationFormState
): CreatePropertyPayload {
  return {
    name: details.name.trim(),
    description: details.description.trim(),
    aboutProperty: details.aboutProperty.map((item) => item.trim()).filter(Boolean),
    propertyType: details.propertyType as PropertyListingType,
    media: details.media,
    propertyAddress: details.propertyAddress.trim(),
    city: details.city.trim(),
    state: details.state.trim(),
    zip: details.zip.trim(),
    numberOfShares: Number(details.numberOfShares) || 0,
    ...(details.presale === "" || details.presale == null
      ? {}
      : { presale: Number(details.presale) || 0 }),
    valuation: buildValuationPayload(valuationState),
  };
}

export function buildUpdatePropertyPayload(
  details: PropertyDetailsPayloadInput,
  valuationState: ValuationFormState
): UpdatePropertyPayload {
  const { numberOfShares: _shares, presale: _presale, ...rest } = buildCreatePropertyPayload(
    details,
    valuationState
  );
  return rest;
}
