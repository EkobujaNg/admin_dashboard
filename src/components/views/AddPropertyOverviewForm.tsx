// src/components/AddPropertyOverviewForm.jsx
"use client";
import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { usePropertyAPI } from "@/services/usePropertyAPI";
import { PROPERTY_LISTING_TYPE_OPTIONS } from "@/lib/property/types";

const AddPropertyOverviewForm = forwardRef(({ onSuccess }: { onSuccess?: () => void }, ref) => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [thumbnailIdx, setThumbnailIdx] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Use mutation hook
  const { addProperty, isAddingProperty } = usePropertyAPI();

  const initialFormData = {
    propertyName: "",
    pricePerStock: "",
    propertySize: "",
    aboutProperty: "",
    propertyLocation: "",
    amountRaisedDuringPresale: "",
    propertyValue: "",
    beds: "",
    baths: "",
    estimatedYieldPerAnnum: "10",
    numberOfShares: "",
    propertyType: "", // ✅ Added
  };

  const [formData, setFormData] = useState(initialFormData);

  // ✅ Expose payload to parent
  useImperativeHandle(ref, () => ({
    getFormData: () => buildPayload(),
  }));

  const buildPayload = () => ({
    propertyName: formData.propertyName.trim(),
    pricePerStock: parseFloat(formData.pricePerStock) || 0,
    propertySize: formData.propertySize.trim(),
    aboutProperty: formData.aboutProperty.trim(),
    propertyLocation: formData.propertyLocation.trim(),
    amountRaisedDuringPresale: parseFloat(formData.amountRaisedDuringPresale) || 0,
    propertyValue: parseFloat(formData.propertyValue) || 0,
    features: [formData.beds ? `${formData.beds} Beds` : null, formData.baths ? `${formData.baths} Baths` : null].filter(Boolean),
    estimatedYieldPerAnnum: parseFloat(formData.estimatedYieldPerAnnum) || 0,
    numberOfShares: parseInt(formData.numberOfShares) || 0,
    propertyType: formData.propertyType.trim(),
    imageUrls: images,
    thumbnailImageUrl: images[thumbnailIdx] || (images.length > 0 ? images[0] : ""),
  });

  // ✅ Upload image to Cloudinary (via API route)
  const uploadImageToCloudinary = async (file) => {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/Media/upload", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.responseMessage || "Upload failed");
    return data.data.secureUrl;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setIsUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImageToCloudinary));
      setImages((prev) => [...prev, ...urls]);
    } finally {
      setIsUploading(false);
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    if (idx === thumbnailIdx) setThumbnailIdx(0);
  };

  const handleSetThumbnail = (idx, e) => {
    e.stopPropagation();
    setThumbnailIdx(idx);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Reset form and images after success
  const resetForm = () => {
    setFormData(initialFormData);
    setImages([]);
    setThumbnailIdx(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ Handle submit → Calls backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    const payload = buildPayload();

    addProperty(payload, {
      onSuccess: () => {
        resetForm();
        onSuccess?.();
      },
    });
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      {/* Image Upload Section */}
      <div>
        <label className="font-semibold text-opacityClr-100 text-base mb-2 block">
          Add image <br />
          <span className="font-normal text-opacityClr-70">or upload multiple images</span>
        </label>

        <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative group flex-shrink-0">
              <img
                src={img}
                alt={`property-${idx}`}
                className={`w-64 h-44 object-cover rounded-lg border-2 ${
                  thumbnailIdx === idx ? "border-opacityClr-100 ring-2 ring-opacityClr-100" : "border-dashed border-opacityClr-60"
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
                  onClick={(e) => handleSetThumbnail(idx, e)}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-neutral-lightGreen text-white rounded-full px-3 py-1 opacity-0 group-hover:opacity-100"
                >
                  Set as thumbnail
                </button>
              )}
              {thumbnailIdx === idx && (
                <div className="absolute top-1 left-1 bg-opacityClr-100 text-white text-[10px] px-2 py-0.5 rounded-full">Thumbnail</div>
              )}
            </div>
          ))}

          {/* Upload Button */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              disabled={isUploading}
              className={`w-64 h-44 flex flex-col items-center justify-center border-2 border-dashed rounded-lg ${
                isUploading
                  ? "text-opacityClr-40 bg-opacityClr-5 cursor-wait"
                  : "text-opacityClr-60 bg-opacityClr-10 hover:bg-opacityClr-20"
              }`}
              onClick={() => !isUploading && fileInputRef.current.click()}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-opacityClr-60 mb-2"></div>
                  <span className="text-sm">Uploading...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">+</span>
                  <span className="text-sm mt-1">Upload</span>
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

      {/* Basic Info Fields */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Property Name *</label>
        <input
          type="text"
          name="propertyName"
          value={formData.propertyName}
          onChange={handleChange}
          placeholder="Enter property name"
          required
          className="border rounded-lg px-4 py-3 outline-none"
        />
      </div>

      {/* Price Per Stock */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Price Per Stock *</label>
        <div className="flex items-center gap-2">
          <span className="px-3 py-3 border rounded-l bg-opacityClr-20">₦</span>
          <input
            type="number"
            name="pricePerStock"
            value={formData.pricePerStock}
            onChange={handleChange}
            placeholder="Enter price per stock"
            required
            className="w-full border rounded-r-lg p-3 outline-none"
          />
        </div>
      </div>

      {/* Property Size */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Property Size *</label>
        <input
          type="text"
          name="propertySize"
          value={formData.propertySize}
          onChange={handleChange}
          placeholder="Enter property size"
          required
          className="border rounded-lg px-4 py-3 outline-none"
        />
      </div>

      {/* Property Type */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Property Type *</label>
        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          required
          className="border rounded-lg p-3 outline-none"
        >
          <option value="">Select Type</option>
          {PROPERTY_LISTING_TYPE_OPTIONS.map((propertyType) => (
            <option key={propertyType.value} value={propertyType.value}>
              {propertyType.label}
            </option>
          ))}
        </select>
      </div>

      {/* About Property */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">About Property *</label>
        <textarea
          name="aboutProperty"
          value={formData.aboutProperty}
          onChange={handleChange}
          placeholder="Describe the property"
          rows={3}
          required
          className="border rounded-lg px-4 py-3 text-sm outline-none resize-none"
        />
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Location *</label>
        <input
          type="text"
          name="propertyLocation"
          value={formData.propertyLocation}
          onChange={handleChange}
          placeholder="Enter property location"
          required
          className="border rounded-lg px-4 py-3 outline-none"
        />
      </div>

      {/* Amount Raised & Property Value */}
      <div className="flex flex-col gap-4">
        {/* Amount Raised */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-semibold">Amount Raised *</label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-3 border rounded-l bg-opacityClr-20">₦</span>
            <input
              type="number"
              name="amountRaisedDuringPresale"
              placeholder="Enter amount raised during presale"
              value={formData.amountRaisedDuringPresale}
              onChange={handleChange}
              required
              className="w-full border rounded-r-lg p-3 outline-none"
            />
          </div>
        </div>
        {/* Property Value */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-semibold">Property Value *</label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-3 border rounded-l bg-opacityClr-20">₦</span>
            <input
              type="number"
              name="propertyValue"
              placeholder="Enter property value"
              value={formData.propertyValue}
              onChange={handleChange}
              required
              className="w-full border rounded-r-lg p-3 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Beds, Baths, Yield, Shares */}
      <div className="flex flex-col gap-4">
        {/* Beds */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-semibold">Beds *</label>
          <input
            type="number"
            name="beds"
            placeholder="Enter number of beds"
            value={formData.beds}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 outline-none"
          />
        </div>
        {/* Baths */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-semibold">Baths *</label>
          <input
            type="number"
            name="baths"
            placeholder="Enter number of baths"
            value={formData.baths}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Yield */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-semibold">Yield per annum</label>
          <select
            name="estimatedYieldPerAnnum"
            value={formData.estimatedYieldPerAnnum}
            onChange={handleChange}
            className="border rounded-lg p-3 outline-none"
          >
            {["8", "10", "12", "15", "20"].map((v) => (
              <option key={v} value={v}>
                {v}%
              </option>
            ))}
          </select>
        </div>
        {/* Shares */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-semibold">Shares *</label>
          <input
            type="number"
            name="numberOfShares"
            placeholder="Enter number of shares"
            value={formData.numberOfShares}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isAddingProperty || isUploading}
        className={`mt-4 bg-opacityClr-100 text-white font-semibold py-4 rounded-lg transition-all duration-300 ${
          isAddingProperty || isUploading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {isUploading ? "Uploading..." : isAddingProperty ? "Saving..." : "Save Property"}
      </button>
    </form>
  );
});

AddPropertyOverviewForm.displayName = "AddPropertyOverviewForm";
export default AddPropertyOverviewForm;
