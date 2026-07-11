import type {
  PaginatedProperties,
  PropertyRecord,
  PropertyStatistics,
  PropertyValuationRecord,
  PropertyValuationRentalUnit,
} from "./types";

type ApiProperty = Record<string, any>;

function parseDecimal(value: unknown): number | null {
  if (value == null || value === "") return null;
  const num = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(num) ? num : null;
}

function parseAmount(value: unknown): number {
  return parseDecimal(value) ?? 0;
}

function buildLocation(property: ApiProperty) {
  if (property.propertyLocation) return property.propertyLocation;

  const parts = [property.propertyAddress, property.city, property.state].filter(Boolean);
  return parts.join(", ");
}

function normalizeRentalUnit(unit: Record<string, unknown>): PropertyValuationRentalUnit {
  return {
    id: String(unit.id || ""),
    unitType: String(unit.unitType || ""),
    numberOfUnits: Number(unit.numberOfUnits) || 0,
    monthlyRentPerUnit: parseAmount(unit.monthlyRentPerUnit),
    annualRent: parseAmount(unit.annualRent),
  };
}

function normalizePropertyValuation(raw: Record<string, unknown> | null | undefined): PropertyValuationRecord | null {
  if (!raw) return null;

  return {
    id: String(raw.id || ""),
    vacancyRate: parseDecimal(raw.vacancyRate),
    vacancyRateName: raw.vacancyRateName ? String(raw.vacancyRateName) : undefined,
    securityCost: parseAmount(raw.securityCost),
    maintenanceCost: parseAmount(raw.maintenanceCost),
    repairsCost: parseAmount(raw.repairsCost),
    utilitiesCost: parseAmount(raw.utilitiesCost),
    managementCost: parseAmount(raw.managementCost),
    taxCost: parseAmount(raw.taxCost),
    propertyTier: Number(raw.propertyTier) || 0,
    propertyClassification: String(raw.propertyClassification || ""),
    titleAdjustment: parseDecimal(raw.titleAdjustment),
    titleAdjustmentName: raw.titleAdjustmentName ? String(raw.titleAdjustmentName) : undefined,
    securityRiskAdjustment: parseDecimal(raw.securityRiskAdjustment),
    securityRiskAdjustmentName: raw.securityRiskAdjustmentName ? String(raw.securityRiskAdjustmentName) : undefined,
    infrastructureAdjustment: parseDecimal(raw.infrastructureAdjustment),
    infrastructureAdjustmentName: raw.infrastructureAdjustmentName ? String(raw.infrastructureAdjustmentName) : undefined,
    developmentAdjustment: parseDecimal(raw.developmentAdjustment),
    developmentAdjustmentName: raw.developmentAdjustmentName ? String(raw.developmentAdjustmentName) : undefined,
    grossRent: parseAmount(raw.grossRent),
    effectiveIncome: parseAmount(raw.effectiveIncome),
    totalExpenses: parseAmount(raw.totalExpenses),
    noi: parseAmount(raw.noi),
    capRate: parseDecimal(raw.capRate),
    estimatedValue: parseAmount(raw.estimatedValue),
    computedValue: parseAmount(raw.computedValue),
    ekobujaValue: parseAmount(raw.ekobujaValue),
    adminAdjustment: parseAmount(raw.adminAdjustment),
    adminAjustWith: String(raw.adminAjustWith || "plus"),
    rentalUnits: Array.isArray(raw.rentalUnits) ? raw.rentalUnits.map(normalizeRentalUnit) : [],
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}

export function normalizeProperty(property: ApiProperty): PropertyRecord {
  const media = property.media || property.imageUrls || [];
  const propertyId = property.propertyId || property.id || "";
  const propertyValuation = normalizePropertyValuation(property.propertyValuation);
  const sharesSold = property.numberOfSharesSold ?? property.sharesSold ?? 0;
  const ekobujaValue =
    propertyValuation?.ekobujaValue ??
    parseDecimal(property.ekobujaValue) ??
    parseDecimal(property.amountRaisedDuringPresale);
  const capRate = propertyValuation?.capRate ?? parseDecimal(property.capRate);
  const aboutProperty = Array.isArray(property.aboutProperty)
    ? property.aboutProperty.map(String).map((item) => item.trim()).filter(Boolean)
    : typeof property.aboutProperty === "string" && property.aboutProperty.trim()
      ? [property.aboutProperty.trim()]
      : [];
  const presale =
    parseDecimal(property.presale) ??
    parseDecimal(property.amountRaisedDuringPresale) ??
    null;

  return {
    ...property,
    propertyId,
    id: propertyId,
    propertyName: property.propertyName || property.name || "Untitled Property",
    name: property.name || property.propertyName || "Untitled Property",
    description: property.description || "",
    aboutProperty,
    imageUrls: media,
    media,
    pricePerStock: property.pricePerStock ?? property.shareValue ?? 0,
    shareValue: property.shareValue ?? property.pricePerStock ?? 0,
    propertyLocation: buildLocation(property),
    propertyAddress: property.propertyAddress || "",
    city: property.city || "",
    state: property.state || "",
    zip: property.zip || "",
    numberOfShares: property.numberOfShares ?? 0,
    numberOfSharesSold: sharesSold,
    sharesSold,
    isHidden: property.isHidden ?? false,
    propertyType: property.propertyType || property.type || "",
    features: property.features || [],
    estimatedYieldPerAnnum:
      property.estimatedYieldPerAnnum ?? (capRate != null ? capRate * 100 : null),
    amountRaisedDuringPresale: presale ?? ekobujaValue,
    presale,
    commission: parseDecimal(property.commission),
    ekobujaBuyBack:
      parseDecimal(property.ekobujaBuyBack) ?? parseDecimal(property.ekbujaBuyBack),
    ekobujaValue,
    propertyValuation,
    rentalUnits: propertyValuation?.rentalUnits || [],
    isActive: property.isActive ?? (property.status ? property.status === "active" : !property.isHidden),
    dateCreated: property.dateCreated || property.createdAt || null,
    createdAt: property.createdAt || property.dateCreated || null,
    updatedAt: property.updatedAt || null,
  };
}

export function normalizePaginatedProperties(data: Record<string, any>): PaginatedProperties {
  const rawItems = data.pageItems || data.items || data.data || [];
  const pageItems = Array.isArray(rawItems) ? rawItems.map(normalizeProperty) : [];

  return {
    pageItems,
    currentPage: data.currentPage ?? data.pageNumber ?? data.page ?? 1,
    numberOfPages: data.numberOfPages ?? data.totalPages ?? 1,
    totalItems: data.totalItems ?? data.totalCount ?? pageItems.length,
  };
}

export function derivePropertyStatistics(paginated: PaginatedProperties): PropertyStatistics {
  const { pageItems, totalItems } = paginated;

  const totalStocks = pageItems.reduce((sum, property) => sum + (property.numberOfShares || 0), 0);
  const inactiveStocks = pageItems.reduce(
    (sum, property) => sum + Math.max((property.numberOfShares || 0) - (property.sharesSold || 0), 0),
    0
  );
  const activeProperties = pageItems.filter((property) => property.isActive !== false).length;
  const earliestDate = pageItems
    .map((property) => property.dateCreated)
    .filter(Boolean)
    .sort()[0];

  return {
    totalProperties: totalItems,
    activeProperties: activeProperties || totalItems,
    totalStocks,
    inactiveStocks,
    startDate: earliestDate || null,
  };
}
