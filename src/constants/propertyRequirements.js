export const PROPERTY_TYPES = ["Residential", "Commercial", "Land"];

export const createEmptyRequirementsTemplate = () => ({
  rentalUnits: [],
  vacancyExpectation: { options: [], value: "" },
  documentation: [],
  operatingExpenses: [],
  capRateFactors: [],
  categories: [],
  version: 1,
  updatedBy: "admin",
  updatedAt: "",
});

export const createDefaultRequirementsByType = () =>
  PROPERTY_TYPES.reduce((acc, type) => {
    acc[type] = createEmptyRequirementsTemplate();
    return acc;
  }, {});
