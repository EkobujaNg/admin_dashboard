const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const buildDynamicRequirementFields = (template) => {
  if (!template) return [];

  const fields = [];

  (template.documentation || []).forEach((doc) => {
    if (!doc?.name?.trim()) return;
    fields.push({
      id: `doc_${doc.id}`,
      key: `documentation.${slugify(doc.name)}`,
      label: doc.name.trim(),
      inputType: "checkbox",
      required: true,
      weight: 5,
      section: "Documentation",
    });
  });

  if ((template.vacancyExpectation?.options || []).length > 0) {
    fields.push({
      id: "vacancy_expectation",
      key: "vacancyExpectation.value",
      label: "Vacancy Expectation",
      inputType: "select",
      options: template.vacancyExpectation.options,
      required: true,
      weight: 10,
      section: "Market Assumptions",
    });
  }

  (template.capRateFactors || []).forEach((factor) => {
    if (!factor?.name?.trim()) return;
    fields.push({
      id: `cap_${factor.id}`,
      key: `capRateFactors.${slugify(factor.name)}`,
      label: factor.name.trim(),
      inputType: "select",
      options: factor.options || [],
      required: true,
      weight: 10,
      section: "Cap Rate Factors",
    });
  });

  (template.operatingExpenses || []).forEach((expense) => {
    if (!expense?.name?.trim()) return;
    fields.push({
      id: `opex_${expense.id}`,
      key: `operatingExpenses.${slugify(expense.name)}`,
      label: expense.name.trim(),
      inputType: "number",
      required: true,
      weight: 8,
      section: "Operating Expenses",
    });
  });

  (template.categories || []).forEach((category) => {
    (category?.requirements || []).forEach((requirement) => {
      if (!requirement?.text?.trim()) return;
      fields.push({
        id: `cat_${category.id}_req_${requirement.id}`,
        key: `categories.${slugify(category.title)}.${slugify(requirement.text)}`,
        label: requirement.text.trim(),
        inputType: "text",
        required: true,
        weight: 12,
        section: category.title || "Other Requirements",
      });
    });
  });

  return fields;
};

export const buildInitialRequirementAnswers = (fields, existingAnswers = {}) =>
  fields.reduce((acc, field) => {
    const hasExisting = Object.prototype.hasOwnProperty.call(existingAnswers, field.key);
    if (hasExisting) {
      acc[field.key] = existingAnswers[field.key];
    } else {
      acc[field.key] = field.inputType === "checkbox" ? false : "";
    }
    return acc;
  }, {});

export const validateRequirementAnswers = (fields, answers = {}) =>
  fields.reduce((errors, field) => {
    if (!field.required) return errors;

    const value = answers[field.key];
    const isEmpty =
      field.inputType === "checkbox"
        ? value !== true
        : value === undefined || value === null || String(value).trim().length === 0;

    if (isEmpty) {
      errors[field.key] = `${field.label} is required`;
    }

    return errors;
  }, {});

export const computeRequirementEvaluation = (fields, answers = {}) => {
  const totalWeight = fields.reduce((sum, field) => sum + (field.weight || 0), 0);

  const achievedWeight = fields.reduce((sum, field) => {
    const value = answers[field.key];
    const fulfilled = field.inputType === "checkbox" ? value === true : String(value || "").trim().length > 0;
    return fulfilled ? sum + (field.weight || 0) : sum;
  }, 0);

  const completionRate = totalWeight > 0 ? Number(((achievedWeight / totalWeight) * 100).toFixed(2)) : 0;

  return {
    score: achievedWeight,
    totalWeight,
    completionRate,
  };
};
