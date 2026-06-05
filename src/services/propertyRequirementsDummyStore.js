"use client";

import { createDefaultRequirementsByType, createEmptyRequirementsTemplate } from "@/constants/propertyRequirements";

const STORAGE_KEY = "ekobuja_property_requirements_templates_v1";

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

const normalizeTemplate = (template) => ({
  ...createEmptyRequirementsTemplate(),
  ...(template || {}),
});

export const getAllRequirementTemplates = () => {
  if (!canUseStorage()) return createDefaultRequirementsByType();

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return createDefaultRequirementsByType();

    const parsed = JSON.parse(rawValue);
    const defaults = createDefaultRequirementsByType();

    return Object.keys(defaults).reduce((acc, propertyType) => {
      acc[propertyType] = normalizeTemplate(parsed?.[propertyType]);
      return acc;
    }, {});
  } catch (error) {
    return createDefaultRequirementsByType();
  }
};

export const getRequirementTemplateByType = (propertyType) => {
  const templates = getAllRequirementTemplates();
  return normalizeTemplate(templates[propertyType]);
};

export const saveRequirementTemplateByType = (propertyType, template, updatedBy = "admin") => {
  const templates = getAllRequirementTemplates();
  const normalizedTemplate = normalizeTemplate(template);

  const nextTemplates = {
    ...templates,
    [propertyType]: {
      ...normalizedTemplate,
      updatedBy,
      version: (normalizedTemplate.version || 0) + 1,
      updatedAt: new Date().toISOString(),
    },
  };

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTemplates));
  }

  return nextTemplates[propertyType];
};
