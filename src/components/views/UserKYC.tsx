"use client";
import React, { useRef } from "react";
import { Upload, ChevronDown } from "lucide-react";

const KYC = ({ kycDetails, onInputChange, onDocumentUpload }) => {
  const documentInputRef = useRef(null);

  const handleInputChange = (e) => {
    onInputChange(e); // Pass the event object up to the parent
  };

  const handleDocumentClick = () => {
    documentInputRef.current.click();
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onDocumentUpload(file); // Pass the file object up to the parent
    }
  };

  // Determine the display value for the document input
  const displayDocumentName = () => {
    if (kycDetails.document instanceof File) {
      return kycDetails.document.name;
    } else if (typeof kycDetails.document === "string") {
      // Assuming if it's a string, it's the existing document name
      return kycDetails.document;
    } else {
      return "";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full overflow-y-auto pb-24">
      <h3 className="text-lg font-semibold text-primary-10">KYC Information</h3>
      <div className="flex flex-col gap-4 w-full">
        {/* ID Type */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">ID Type</label>
          {/* Dropdown/select */}
          <div className="relative w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10 flex items-center justify-between">
            <select
              name="idType"
              value={kycDetails.idType}
              onChange={handleInputChange}
              className="block appearance-none w-full bg-transparent outline-none"
            >
              <option value="">Select ID Type</option>
              <option value="National ID">National ID</option>
              <option value="Passport">Passport</option>
              <option value="Driver's License">Driver's License</option>
              <option value="Voter's Card">Voter's Card</option>
            </select>
            <ChevronDown className="text-gray-500 w-[18px] h-[18px]" />
          </div>
        </div>

        {/* ID Number */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">ID Number</label>
          <input
            type="text"
            name="idNumber"
            value={kycDetails.idNumber}
            onChange={handleInputChange}
            placeholder="Enter ID Number"
            className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10"
          />
        </div>

        {/* Document Upload */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Upload Document</label>
          <div
            className="flex items-center w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10 cursor-pointer"
            onClick={handleDocumentClick}
          >
            <input
              type="text"
              name="document"
              value={displayDocumentName()}
              readOnly
              className="flex-1 border-none bg-transparent outline-none cursor-pointer"
              placeholder="No file selected"
            />
            <Upload className="text-gray-500 w-[18px] h-[18px]" />
          </div>
          <input type="file" ref={documentInputRef} className="hidden" onChange={handleDocumentFileChange} />
        </div>
        {/* Verification Status */}
        <div className="flex flex-col gap-2">
          <label className="block font-Raleway font-semibold text-opacityClr-100 text-base leading-[150%]">Verification Status</label>
          {/* Placeholder for displaying status, read-only */}
          <div className="w-full border border-opacityClr-30 rounded-lg px-4 py-3 text-opacityClr-100 text-base leading-[150%] outline-none bg-opacityClr-10">
            {kycDetails.status || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYC;
