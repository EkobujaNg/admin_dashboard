"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import StepProgress from "@/components/ui/StepProgress";
import PropertyValuationCalculator from "@/components/views/PropertyValuationCalculator";
import { createProperty, getPropertyErrorMessage, updateProperty } from "@/lib/property/api";
import { mapPropertyToDetailsState, mapPropertyToValuationState } from "@/lib/property/form";
import { buildPropertyMediaPayload, uploadPropertyMedia } from "@/lib/property/media";
import {
  createInitialPropertyDetailsState,
  PROPERTY_LISTING_TYPE_OPTIONS,
  type PropertyDetailsState,
  type PropertyListingType,
  type PropertyRecord,
} from "@/lib/property/types";
import {
  buildCreatePropertyPayload,
  buildUpdatePropertyPayload,
  createInitialValuationState,
  formatNaira,
  formatPercent,
  type ValuationFormState,
  type ValuationResult,
} from "@/lib/property/valuation";
import {
  formatZodErrors,
  PROPERTY_DESCRIPTION_MAX_LENGTH,
  propertyListingStep1Schema,
  propertyListingStep2Schema,
  propertyListingStep4Schema,
} from "@/lib/property/validation";

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Location & Media" },
  { id: 3, label: "Valuation" },
  { id: 4, label: "Review" },
] as const;

const inputClassName =
  "w-full p-4 rounded-lg border border-opacityClr-50 text-opacityClr-100 outline-none focus:border-opacityClr-100 placeholder:text-opacityClr-30 placeholder:font-normal placeholder:font-Raleway transition-all duration-300 ease-in-out";

const selectClassName =
  "w-full p-4 rounded-lg border border-opacityClr-50 text-opacityClr-100 outline-none focus:border-opacityClr-100 font-Raleway transition-all duration-300 ease-in-out bg-white";

const labelClassName = "text-base font-Raleway font-semibold leading-[150%] text-opacityClr-100";

const sectionTitleClassName =
  "text-primary-10 text-lg font-bold font-Raleway leading-normal border-b border-opacityClr-20 pb-3";

type FieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ label, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <label className={labelClassName}>
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}

function getPropertyTypeLabel(value: PropertyListingType | "") {
  return PROPERTY_LISTING_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

type PropertyListingFormProps = {
  mode?: "create" | "edit";
  property?: PropertyRecord;
};

export default function AddPropertyListingForm({ mode = "create", property }: PropertyListingFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = mode === "edit";
  const propertyId = property?.propertyId || property?.id || "";
  const sharesSold = property?.sharesSold ?? property?.numberOfSharesSold ?? 0;

  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<PropertyDetailsState>(createInitialPropertyDetailsState);
  const [valuationState, setValuationState] = useState<ValuationFormState>(createInitialValuationState);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [thumbnailIdx, setThumbnailIdx] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previousPropertyType, setPreviousPropertyType] = useState<PropertyDetailsState["propertyType"]>("");
  const [isInitialized, setIsInitialized] = useState(!isEditMode);

  useEffect(() => {
    if (!isEditMode || !property) return;

    const mappedDetails = mapPropertyToDetailsState(property);
    const mappedValuation = mapPropertyToValuationState(property);

    setDetails({
      ...createInitialPropertyDetailsState(),
      ...mappedDetails,
      videoLink: mappedDetails.videoLink ?? "",
    });
    setValuationState(mappedValuation.state);
    setValuationResult(mappedValuation.result);
    setHasCalculated(Boolean(mappedValuation.result));
    setThumbnailIdx(0);
    setStep(1);
    setIsInitialized(true);
  }, [isEditMode, property]);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "propertyType" && value !== details.propertyType) {
      setValuationState(createInitialValuationState());
      setValuationResult(null);
      setHasCalculated(false);
      setPreviousPropertyType(details.propertyType);
    }

    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAboutPropertyChange = (index: number, value: string) => {
    setDetails((prev) => ({
      ...prev,
      aboutProperty: prev.aboutProperty.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddAboutProperty = () => {
    setDetails((prev) => ({
      ...prev,
      aboutProperty: [...prev.aboutProperty, ""],
    }));
  };

  const handleRemoveAboutProperty = (index: number) => {
    setDetails((prev) => {
      const next = prev.aboutProperty.filter((_, i) => i !== index);
      return {
        ...prev,
        aboutProperty: next.length > 0 ? next : [""],
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadPropertyMedia));
      setDetails((prev) => ({ ...prev, media: [...prev.media, ...urls] }));
    } catch (error: any) {
      toast.error(getPropertyErrorMessage(error, "Failed to upload image."));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (idx: number) => {
    setDetails((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== idx),
    }));
    if (idx === thumbnailIdx) setThumbnailIdx(0);
    else if (idx < thumbnailIdx) setThumbnailIdx((prev) => prev - 1);
  };

  const createPropertyMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: (data) => {
      toast.success(
        data?.responseDescription ||
          data?.responseMessage ||
          data?.message ||
          "Property created successfully!"
      );
      router.push("/properties");
    },
    onError: (error: any) => {
      toast.error(getPropertyErrorMessage(error, "Failed to create property."));
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: (payload: ReturnType<typeof buildUpdatePropertyPayload>) => updateProperty(propertyId, payload),
    onSuccess: (data) => {
      toast.success(
        data?.responseDescription ||
          data?.responseMessage ||
          data?.message ||
          "Property updated successfully!"
      );
      router.push(`/properties/${propertyId}`);
    },
    onError: (error: any) => {
      toast.error(getPropertyErrorMessage(error, "Failed to update property."));
    },
  });

  const isSubmitting = createPropertyMutation.isPending || updatePropertyMutation.isPending;

  const validateStep1 = () => {
    const validation = propertyListingStep1Schema.safeParse({
      propertyType: details.propertyType,
      name: details.name,
      description: details.description,
      aboutProperty: details.aboutProperty,
    });
    if (!validation.success) {
      const errors = formatZodErrors(validation.error);
      toast.error(Object.values(errors)[0] || "Please complete the basics step.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const validation = propertyListingStep2Schema.safeParse({
      media: details.media,
      videoLink: details.videoLink ?? "",
      propertyAddress: details.propertyAddress,
      city: details.city,
      state: details.state,
      zip: details.zip,
    });
    if (!validation.success) {
      const errors = formatZodErrors(validation.error);
      toast.error(Object.values(errors)[0] || "Please complete the media & location step.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!hasCalculated || !valuationResult) {
      toast.error("Please calculate the property valuation before continuing.");
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    // Shares and presale are create-only; the API rejects them on update.
    if (isEditMode) return true;

    const validation = propertyListingStep4Schema.safeParse({
      numberOfShares: details.numberOfShares,
      presale: details.presale,
    });
    if (!validation.success) {
      const errors = formatZodErrors(validation.error);
      toast.error(Object.values(errors)[0] || "Please complete the shares & presale step.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4() || !validateStep3() || !validateStep2() || !validateStep1()) return;

    const orderedMedia = buildPropertyMediaPayload(
      details.media,
      details.videoLink ?? "",
      thumbnailIdx
    );

    if (isEditMode) {
      updatePropertyMutation.mutate(
        buildUpdatePropertyPayload({ ...details, media: orderedMedia }, valuationState)
      );
      return;
    }
    createPropertyMutation.mutate(
      buildCreatePropertyPayload({ ...details, media: orderedMedia }, valuationState)
    );
  };

  const stepTitle = {
    1: "Property basics",
    2: "Location & media",
    3: "Valuation",
    4: isEditMode ? "Review & save" : "Review & create",
  }[step];

  const stepDescription = {
    1: "Choose the property type and enter the basic listing details.",
    2: "Upload images and add the property location details.",
    3: isEditMode
      ? "Update the valuation inputs and recalculate before saving."
      : "Use the valuation calculator to estimate property value. Rental units are optional.",
    4: isEditMode ? "Review your changes before saving the listing." : "Review everything before creating the listing.",
  }[step];

  const descriptionRemaining = PROPERTY_DESCRIPTION_MAX_LENGTH - details.description.length;
  const isDescriptionOverLimit = descriptionRemaining < 0;
  const isDescriptionNearLimit = descriptionRemaining <= 20 && descriptionRemaining >= 0;

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[320px] w-full">
        <p className="text-primary-10 font-Raleway text-base">Loading property...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <StepProgress steps={[...STEPS]} currentStep={step} />

      <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit} autoComplete="off">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-Raleway font-bold text-primary-10 capitalize">{stepTitle}</h2>
          <p className="text-sm font-Raleway font-medium text-opacityClr-80">{stepDescription}</p>
        </div>

        {step === 1 && (
          <section className="flex flex-col gap-6 w-full">
            <Field label="Property Type" required>
              <select
                name="propertyType"
                value={details.propertyType}
                onChange={handleDetailsChange}
                required
                className={selectClassName}
              >
                <option value="">Select type</option>
                {PROPERTY_LISTING_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            {previousPropertyType && previousPropertyType !== details.propertyType && (
              <div className="rounded-xl border border-opacityClr-20 bg-opacityClr-10 px-4 py-3 text-sm font-Raleway text-opacityClr-80">
                Property type changed — valuation data has been reset.
              </div>
            )}

            <Field label="Property Name" required>
              <input
                type="text"
                name="name"
                value={details.name}
                onChange={handleDetailsChange}
                placeholder="Sunrise Apartments"
                required
                className={inputClassName}
              />
            </Field>

            <Field label="Description" required>
              <textarea
                name="description"
                value={details.description}
                onChange={handleDetailsChange}
                placeholder="A premium residential block in Lekki with strong rental demand."
                rows={4}
                required
                aria-invalid={isDescriptionOverLimit}
                className={`${inputClassName} resize-none ${
                  isDescriptionOverLimit ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              <div className="flex items-center justify-between gap-3">
                {isDescriptionOverLimit ? (
                  <p className="text-xs font-Raleway text-red-600">
                    Description must be {PROPERTY_DESCRIPTION_MAX_LENGTH} characters or fewer.
                  </p>
                ) : (
                  <span />
                )}
                <p
                  className={`text-xs font-Raleway font-semibold tabular-nums ${
                    isDescriptionOverLimit
                      ? "text-red-600"
                      : isDescriptionNearLimit
                        ? "text-amber-600"
                        : "text-opacityClr-60"
                  }`}
                >
                  {details.description.length}/{PROPERTY_DESCRIPTION_MAX_LENGTH}
                </p>
              </div>
            </Field>

            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between gap-3">
                <label className={labelClassName}>About property *</label>
                <button
                  type="button"
                  onClick={handleAddAboutProperty}
                  className="text-sm font-Raleway font-semibold text-primary-20 hover:underline"
                >
                  + Add highlight
                </button>
              </div>
              <p className="text-sm font-Raleway text-opacityClr-70 -mt-1">
                Short bullet points shown on the property details page.
              </p>
              {details.aboutProperty.map((item, index) => (
                <div key={`about-${index}`} className="flex items-start gap-2 w-full">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleAboutPropertyChange(index, e.target.value)}
                    placeholder={
                      index === 0
                        ? "A residential block with 12 units."
                        : "24/7 security and dedicated parking."
                    }
                    className={inputClassName}
                  />
                  {details.aboutProperty.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAboutProperty(index)}
                      className="shrink-0 px-3 py-4 rounded-lg border border-opacityClr-30 text-sm font-Raleway text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="flex flex-col gap-6 w-full">
            <div>
              <label className={`${labelClassName} mb-2 block`}>
                Property images *
                <br />
                <span className="font-normal text-opacityClr-70">Upload one or more images</span>
              </label>

              <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
                {details.media.map((img, idx) => (
                  <div key={img} className="relative group shrink-0">
                    <img
                      src={img}
                      alt={`property-${idx}`}
                      className={`w-64 h-44 object-cover rounded-lg border-2 ${
                        thumbnailIdx === idx
                          ? "border-opacityClr-100 ring-2 ring-opacityClr-100"
                          : "border-dashed border-opacityClr-60"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ✕
                    </button>
                    {thumbnailIdx !== idx && (
                      <button
                        type="button"
                        onClick={() => setThumbnailIdx(idx)}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-neutral-lightGreen text-white rounded-full px-3 py-1 opacity-0 group-hover:opacity-100"
                      >
                        Set as thumbnail
                      </button>
                    )}
                    {thumbnailIdx === idx && (
                      <div className="absolute top-1 left-1 bg-opacityClr-100 text-white text-[10px] px-2 py-0.5 rounded-full">
                        Thumbnail
                      </div>
                    )}
                  </div>
                ))}

                <div className="relative shrink-0">
                  <button
                    type="button"
                    disabled={isUploading}
                    className={`w-64 h-44 flex flex-col items-center justify-center border-2 border-dashed rounded-lg ${
                      isUploading
                        ? "text-opacityClr-40 bg-opacityClr-5 cursor-wait"
                        : "text-opacityClr-60 bg-opacityClr-10 hover:bg-opacityClr-20"
                    }`}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-opacityClr-60 mb-2" />
                        <span className="text-sm font-Raleway">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">+</span>
                        <span className="text-sm mt-1 font-Raleway">Upload</span>
                      </>
                    )}
                  </button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>

            <Field label="Video link">
              <input
                type="url"
                name="videoLink"
                value={details.videoLink ?? ""}
                onChange={handleDetailsChange}
                placeholder="Add youtube video link here"
                className={inputClassName}
              />
            </Field>

            <h3 className={sectionTitleClassName}>Location</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Field label="Street Address" required>
                <input
                  type="text"
                  name="propertyAddress"
                  value={details.propertyAddress}
                  onChange={handleDetailsChange}
                  placeholder="12 Admiralty Way"
                  required
                  className={inputClassName}
                />
              </Field>
              <Field label="City" required>
                <input
                  type="text"
                  name="city"
                  value={details.city}
                  onChange={handleDetailsChange}
                  placeholder="Lekki"
                  required
                  className={inputClassName}
                />
              </Field>
              <Field label="State" required>
                <input
                  type="text"
                  name="state"
                  value={details.state}
                  onChange={handleDetailsChange}
                  placeholder="Lagos"
                  required
                  className={inputClassName}
                />
              </Field>
              <Field label="Zip / Postal Code" required>
                <input
                  type="text"
                  name="zip"
                  value={details.zip}
                  onChange={handleDetailsChange}
                  placeholder="105102"
                  required
                  className={inputClassName}
                />
              </Field>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="flex flex-col gap-6 w-full">
            <PropertyValuationCalculator
              state={valuationState}
              onStateChange={setValuationState}
              result={valuationResult}
              onResultChange={setValuationResult}
              hasCalculated={hasCalculated}
              onHasCalculatedChange={setHasCalculated}
              hideHeader
              collapseAdvanced
            />
          </section>
        )}

        {step === 4 && (
          <section className="flex flex-col gap-6 w-full">
            {isEditMode && (
              <div className="rounded-xl border border-opacityClr-20 bg-opacityClr-10 px-4 py-3 text-sm font-Raleway text-opacityClr-80">
                Number of shares and presale amount cannot be changed after a property is created
                {sharesSold > 0
                  ? ` (${sharesSold.toLocaleString()} share${sharesSold === 1 ? "" : "s"} already sold).`
                  : "."}
              </div>
            )}

            <Field label="Number of Shares" required={!isEditMode}>
              <input
                type="number"
                name="numberOfShares"
                min={1}
                value={details.numberOfShares}
                onChange={handleDetailsChange}
                placeholder="1000"
                required={!isEditMode}
                disabled={isEditMode}
                readOnly={isEditMode}
                className={`${inputClassName} ${isEditMode ? "bg-opacityClr-10 cursor-not-allowed opacity-70" : ""}`}
              />
            </Field>

            <Field label="Presale Amount (₦)">
              <input
                type="number"
                name="presale"
                min={0}
                step="any"
                value={details.presale}
                onChange={handleDetailsChange}
                placeholder="Optional"
                disabled={isEditMode}
                readOnly={isEditMode}
                className={`${inputClassName} ${isEditMode ? "bg-opacityClr-10 cursor-not-allowed opacity-70" : ""}`}
              />
            </Field>

            <div className="rounded-xl border border-opacityClr-20 bg-white p-6 flex flex-col gap-4">
              <h3 className="text-lg font-Raleway font-bold text-primary-10">Listing summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-Raleway text-primary-10">
                <p>
                  <span className="text-opacityClr-60">Name:</span> <span className="font-semibold">{details.name}</span>
                </p>
                <p>
                  <span className="text-opacityClr-60">Type:</span>{" "}
                  <span className="font-semibold">{getPropertyTypeLabel(details.propertyType)}</span>
                </p>
                <p>
                  <span className="text-opacityClr-60">Location:</span>{" "}
                  <span className="font-semibold">
                    {details.propertyAddress}, {details.city}, {details.state} {details.zip}
                  </span>
                </p>
                <p>
                  <span className="text-opacityClr-60">Images:</span>{" "}
                  <span className="font-semibold">{details.media.length} uploaded</span>
                </p>
                {(details.videoLink ?? "").trim() && (
                  <p className="md:col-span-2">
                    <span className="text-opacityClr-60">Video:</span>{" "}
                    <span className="font-semibold break-all">{(details.videoLink ?? "").trim()}</span>
                  </p>
                )}
                <p>
                  <span className="text-opacityClr-60">Shares:</span>{" "}
                  <span className="font-semibold">{details.numberOfShares || "—"}</span>
                </p>
                <p>
                  <span className="text-opacityClr-60">Presale:</span>{" "}
                  <span className="font-semibold">
                    {details.presale !== "" ? formatNaira(Number(details.presale) || 0) : "—"}
                  </span>
                </p>
                {valuationResult && (
                  <>
                    <p>
                      <span className="text-opacityClr-60">Rental units:</span>{" "}
                      <span className="font-semibold">
                        {valuationState.includesRentalUnits ? "Included" : "Not included"}
                      </span>
                    </p>
                    <p>
                      <span className="text-opacityClr-60">Cap rate:</span>{" "}
                      <span className="font-semibold">{formatPercent(valuationResult.capRate)}</span>
                    </p>
                    <p>
                      <span className="text-opacityClr-60">NOI:</span>{" "}
                      <span className="font-semibold">{formatNaira(valuationResult.noi)}</span>
                    </p>
                  </>
                )}
              </div>

              {details.description.trim() && (
                <div className="pt-4 border-t border-opacityClr-20">
                  <p className="text-sm font-Raleway text-opacityClr-60 mb-2">Description</p>
                  <p className="text-sm font-Raleway text-primary-10 leading-relaxed">{details.description.trim()}</p>
                </div>
              )}

              {details.aboutProperty.some((item) => item.trim()) && (
                <div className="pt-4 border-t border-opacityClr-20">
                  <p className="text-sm font-Raleway text-opacityClr-60 mb-2">About property</p>
                  <ul className="list-disc pl-5 flex flex-col gap-1 text-sm font-Raleway text-primary-10">
                    {details.aboutProperty
                      .map((item) => item.trim())
                      .filter(Boolean)
                      .map((item, index) => (
                        <li key={`${index}-${item}`}>{item}</li>
                      ))}
                  </ul>
                </div>
              )}

              {valuationResult && (
                <div className="mt-2 pt-4 border-t border-opacityClr-20">
                  <p className="text-sm font-Raleway text-opacityClr-80">Final adjusted property value</p>
                  <p className="text-[28px] font-Raleway font-bold text-primary-10">
                    {formatNaira(valuationResult.adjustedPropertyValue)}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-opacityClr-20">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || isSubmitting}
            className="px-6 py-3 rounded-lg border border-opacityClr-50 text-primary-10 font-Raleway font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-opacityClr-10 transition-colors"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={isUploading}
              className="px-8 py-3 bg-primary-10 text-white font-Raleway font-bold rounded-lg hover:bg-primary-20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 3 ? "Continue to review" : "Continue"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-8 py-3 bg-opacityClr-100 text-white font-Raleway font-bold rounded-lg hover:bg-opacityClr-80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEditMode
                  ? "Saving Changes..."
                  : "Creating Property..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Property"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
