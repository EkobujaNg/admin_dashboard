import { z } from "zod";
import { formatZodErrors } from "@/lib/validation/common";
import type { PropertyListingType } from "./types";

export { formatZodErrors };

function percentFromInput(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((value) => !Number.isNaN(Number(value)), `Enter a valid ${label.toLowerCase()}.`)
    .transform((value) => Number(value))
    .refine((value) => value >= 0.1 && value <= 100, `${label} must be between 0.1% and 100%.`);
}

export const PROPERTY_DESCRIPTION_MAX_LENGTH = 300;

export const updatePropertyCommissionSchema = z.object({
  commission: percentFromInput("Commission"),
});

export const propertyListingStep1Schema = z.object({
  propertyType: z.string().trim().min(1, "Please select a property type."),
  name: z.string().trim().min(1, "Please enter a property name."),
  description: z
    .string()
    .trim()
    .min(1, "Please enter a description.")
    .max(
      PROPERTY_DESCRIPTION_MAX_LENGTH,
      `Description must be ${PROPERTY_DESCRIPTION_MAX_LENGTH} characters or fewer.`
    ),
  aboutProperty: z
    .array(z.string())
    .refine((items) => items.some((item) => item.trim().length > 0), {
      message: "Please add at least one about-property highlight.",
    }),
});

export const propertyListingStep2Schema = z.object({
  media: z.array(z.string()).min(1, "Please upload at least one property image."),
  propertyAddress: z.string().trim().min(1, "Please complete all location fields."),
  city: z.string().trim().min(1, "Please complete all location fields."),
  state: z.string().trim().min(1, "Please complete all location fields."),
  zip: z.string().trim().min(1, "Please complete all location fields."),
});

export const propertyListingStep4Schema = z.object({
  numberOfShares: z
    .string()
    .trim()
    .min(1, "Please enter a valid number of shares.")
    .refine((value) => !Number.isNaN(Number(value)), "Please enter a valid number of shares.")
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value) && value >= 1, "Please enter a valid number of shares."),
  presale: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || !Number.isNaN(Number(value)),
      "Please enter a valid presale amount (0 or more)."
    )
    .refine(
      (value) => value === "" || Number(value) >= 0,
      "Please enter a valid presale amount (0 or more)."
    ),
});

export function isResidentialPropertyType(propertyType: PropertyListingType | string): boolean {
  return propertyType === "residential";
}
