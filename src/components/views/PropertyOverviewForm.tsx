"use client";
import React, { useState, useRef, useEffect } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { PROPERTY_LISTING_TYPE_OPTIONS } from "@/lib/property/types";

const PropertyOverviewForm = ({ property, onSave, isLoading }: { property?: any; onSave?: any; isLoading?: any }) => {
  const fileInputRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ✅ Use correct image field (imageUrls)
  const [images, setImages] = useState(property?.imageUrls || []);
  const [thumbnailIdx, setThumbnailIdx] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Initial form data
  const buildInitialFormData = (p) => ({
    propertyName: p?.propertyName || "",
    propertyCode: p?.propertyCode || "FXTR56",
    pricePerStock: p?.pricePerStock?.toString() || "",
    propertySize: p?.propertySize || "",
    aboutProperty: Array.isArray(p?.aboutProperty)
      ? p.aboutProperty.join("\n")
      : p?.aboutProperty || "",
    propertyLocation: p?.propertyLocation || "",
    amountRaisedDuringPresale: p?.amountRaisedDuringPresale?.toString() || p?.presale?.toString() || "",
    propertyValue: p?.propertyValue?.toString() || "",
    beds: p?.features?.find((f) => f.includes("Bed"))?.match(/\d+/)?.[0] || "",
    baths: p?.features?.find((f) => f.includes("Bath"))?.match(/\d+/)?.[0] || "",
    estimatedYieldPerAnnum: p?.estimatedYieldPerAnnum?.toString() || "10",
    numberOfShares: p?.numberOfShares?.toString() || "",
    propertyType: p?.propertyType || "",
  });

  const [formData, setFormData] = useState(buildInitialFormData(property));

  // ✅ Update form if a new property is fetched
  useEffect(() => {
    if (property) {
      setFormData(buildInitialFormData(property));
      setImages(property.imageUrls || []);
    }
  }, [property]);

  // ✅ Handlers
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/Media/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.responseMessage || 'Failed to upload image');
      }
      return data.data.secureUrl; // Return the secure URL
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // Upload all images in parallel
      const uploadPromises = files.map(file => uploadImageToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      // Handle error (e.g., show toast message)
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    // If we're removing the current thumbnail, reset to the first image or -1 if no images left
    if (indexToRemove === thumbnailIdx) {
      setThumbnailIdx(0);
    } else if (indexToRemove < thumbnailIdx) {
      // Adjust thumbnail index if we removed an image before it
      setThumbnailIdx(prev => prev - 1);
    }
  };

  const handleSetThumbnail = (idx, e) => {
    e.stopPropagation(); // Prevent triggering remove when clicking the thumbnail button
    setThumbnailIdx(idx);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Don't submit if we're still uploading images
    if (isUploading) {
      return;
    }

    const updatedData = {
      ...formData,
      pricePerStock: parseFloat(formData.pricePerStock) || 0,
      amountRaisedDuringPresale: parseFloat(formData.amountRaisedDuringPresale) || 0,
      propertyValue: parseFloat(formData.propertyValue) || 0,
      estimatedYieldPerAnnum: parseFloat(formData.estimatedYieldPerAnnum) || 0,
      numberOfShares: parseInt(formData.numberOfShares) || 0,
      features: [
        formData.beds ? `${formData.beds} Beds` : null,
        formData.baths ? `${formData.baths} Baths` : null
      ].filter(Boolean),
      imageUrls: images,
      thumbnailImageUrl: images[thumbnailIdx] || (images.length > 0 ? images[0] : ''),
    };
    
    const { beds, baths, ...apiData } = updatedData;
    onSave(apiData);
  };

  const handleLiquidate = () => setShowConfirmModal(true);
  const handleConfirmLiquidate = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto ">
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSave}>
        {/* Image Upload */}
        <div>
          <label className="font-Raleway text-opacityClr-100 text-base mb-4 block">
            Add image, <br />
            <span className="font-semibold">or upload multiple images</span>
          </label>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 pb-2">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative group flex-shrink-0 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={img}
                      alt={`property-img-${idx}`}
                      className={`w-64 h-44 object-cover rounded-lg border-2 ${
                        thumbnailIdx === idx 
                          ? "border-opacityClr-100 ring-2 ring-offset-1 ring-opacityClr-100" 
                          : "border-dashed border-opacityClr-60"
                      }`}
                    />
                    {/* Thumbnail indicator */}
                    {thumbnailIdx === idx && (
                      <div className="absolute top-1 left-1 bg-opacityClr-100 text-white text-[10px] px-2 py-0.5 rounded-full">
                        Thumbnail
                      </div>
                    )}
                    
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    {/* Set as thumbnail button */}
                    {thumbnailIdx !== idx && (
                      <button
                        type="button"
                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-opacityClr-100 leading-[150%] rounded-full bg-neutral-lightGreen px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity`}
                        onClick={(e) => handleSetThumbnail(idx, e)}
                      >
                        Set as thumbnail
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="relative">
                <button
                  type="button"
                  disabled={isUploading}
                  className={`w-64 h-44 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg ${
                    isUploading 
                      ? 'text-opacityClr-40 bg-opacityClr-5 cursor-wait' 
                      : 'text-opacityClr-60 bg-opacityClr-10 hover:bg-opacityClr-20'
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
                  accept="image/*" 
                  multiple 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImageUpload} 
                  disabled={isUploading}
                />
              </div>
            </div>
            {isUploading && (
              <div className="text-sm text-opacityClr-60">
                Uploading images, please wait...
              </div>
            )}
          </div>
        </div>

        {/* Property Name */}
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

        {/* About Property */}
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

        {/* Amount Raised & Value */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">Amount Raised *</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-3 border rounded-l bg-opacityClr-20">₦</span>
              <input
                type="number"
                name="amountRaisedDuringPresale"
                value={formData.amountRaisedDuringPresale}
                onChange={handleChange}
                required
                className="w-full border rounded-r-lg p-3 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">Property Value *</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-3 border rounded-l bg-opacityClr-20">₦</span>
              <input
                type="number"
                name="propertyValue"
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
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">No. of Beds *</label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 outline-none"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">No. of Baths *</label>
            <input
              type="number"
              name="baths"
              value={formData.baths}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">Estimate Yield Per Annum</label>
            <select
              name="estimatedYieldPerAnnum"
              value={formData.estimatedYieldPerAnnum}
              onChange={handleChange}
              className="border rounded-lg p-3 outline-none"
            >
              {["8", "10", "12", "15", "20"].map((y) => (
                <option key={y} value={y}>
                  {y}%
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">No. of Shares *</label>
            <input
              type="number"
              name="numberOfShares"
              value={formData.numberOfShares}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 outline-none"
            />
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 bg-opacityClr-100 text-white font-Raleway font-semibold text-base py-4 rounded-lg transition-all duration-500 ease-in-out disabled:bg-opacityClr-50 cursor-pointer${
            isLoading ? "bg-opacityClr-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="spinner"></span>
              <span className="text-opacityClr-10">Saving...</span>
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>

      {/* Liquidate Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmLiquidate}
        message="Are you sure you want to liquidate this property? This action cannot be undone."
        confirmMsg="Yes, Liquidate Property"
        cancelMsg="No, Cancel"
      />
    </div>
  );
};

export default PropertyOverviewForm;
