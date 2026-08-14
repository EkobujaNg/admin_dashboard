import type { ValuationPayload } from "./valuation";

export type PropertyListingType = "residential" | "commercial" | "land";

export type PropertyDetailsState = {
  name: string;
  description: string;
  aboutProperty: string[];
  propertyType: PropertyListingType | "";
  media: string[];
  videoLink: string;
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  numberOfShares: string;
  presale: string;
};

export type CreatePropertyPayload = {
  name: string;
  description: string;
  aboutProperty: string[];
  propertyType: PropertyListingType;
  media: string[];
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  numberOfShares: number;
  presale?: number;
  valuation: ValuationPayload;
};

/** PATCH body — API rejects numberOfShares and presale on update. */
export type UpdatePropertyPayload = Omit<CreatePropertyPayload, "numberOfShares" | "presale">;

export const PROPERTY_LISTING_TYPE_OPTIONS: Array<{ value: PropertyListingType; label: string }> = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
];

export type PropertyValuationRentalUnit = {
  id: string;
  unitType: string;
  numberOfUnits: number;
  monthlyRentPerUnit: number;
  annualRent: number;
};

export type PropertyValuationRecord = {
  id: string;
  vacancyRate: number | null;
  vacancyRateName?: string;
  securityCost: number;
  maintenanceCost: number;
  repairsCost: number;
  utilitiesCost: number;
  managementCost: number;
  taxCost: number;
  propertyTier: number;
  propertyClassification: string;
  titleAdjustment: number | null;
  titleAdjustmentName?: string;
  securityRiskAdjustment: number | null;
  securityRiskAdjustmentName?: string;
  infrastructureAdjustment: number | null;
  infrastructureAdjustmentName?: string;
  developmentAdjustment: number | null;
  developmentAdjustmentName?: string;
  grossRent: number;
  effectiveIncome: number;
  totalExpenses: number;
  noi: number;
  capRate: number | null;
  estimatedValue: number;
  computedValue: number;
  ekobujaValue: number;
  adminAdjustment: number;
  adminAjustWith: string;
  rentalUnits: PropertyValuationRentalUnit[];
  createdAt?: string;
  updatedAt?: string;
};

export type PropertyRecord = {
  propertyId: string;
  id: string;
  propertyName: string;
  name: string;
  propertyCode?: string;
  propertyType: string;
  propertyLocation: string;
  propertyAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  description?: string;
  aboutProperty: string[];
  imageUrls: string[];
  media: string[];
  videoLink?: string | null;
  pricePerStock: number;
  shareValue: number;
  ekobujaValue?: number | null;
  numberOfShares: number;
  numberOfSharesSold: number;
  sharesSold: number;
  isHidden?: boolean;
  propertySize?: string;
  features: string[];
  estimatedYieldPerAnnum?: number | null;
  amountRaisedDuringPresale?: number | null;
  presale?: number | null;
  commission?: number | null;
  ekobujaBuyBack?: number | null;
  isActive?: boolean;
  dateCreated?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  propertyValuation?: PropertyValuationRecord | null;
  valuation?: Record<string, unknown>;
  rentalUnits?: PropertyValuationRentalUnit[];
  [key: string]: unknown;
};

export type PaginatedProperties = {
  pageItems: PropertyRecord[];
  currentPage: number;
  numberOfPages: number;
  totalItems: number;
};

export type PropertyStatistics = {
  totalProperties: number;
  activeProperties: number;
  totalStocks: number;
  inactiveStocks: number;
  startDate: string | null;
};

export type GetPropertiesParams = {
  page?: number;
  limit?: number;
  name?: string;
};

export function createInitialPropertyDetailsState(): PropertyDetailsState {
  return {
    name: "",
    description: "",
    aboutProperty: [""],
    propertyType: "",
    media: [],
    videoLink: "",
    propertyAddress: "",
    city: "",
    state: "",
    zip: "",
    numberOfShares: "",
    presale: "",
  };
}
