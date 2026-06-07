"use client";
import React, { useState, useEffect } from "react";
import TabButton from "@/components/ui/TabButton";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AccountDetails from "./UserAccountDetails";
import NextOfKin from "./UserNextOfKin";
import KYC from "./UserKYC";

const EditUserDrawer = ({ userDetails }) => {
  const [activeTab, setActiveTab] = useState("accountDetails");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(
    userDetails || {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      bvn: "",
      verificationStatus: "",
      gender: "",
      governmentId: null,
      dateOfBirth: "",
      residentialAddress: "",
      avatarImage: null,
      nextOfKinDetails: {
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        phoneNumber: "",
        relationship: "",
      },
      kycDetails: {
        idType: "",
        idNumber: "",
        document: null,
        status: "",
      },
    }
  );

  useEffect(() => {
    if (userDetails) {
      setFormData(userDetails);
    }
  }, [userDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (imageData) => {
    setFormData((prev) => ({ ...prev, avatarImage: imageData }));
  };

  const handleGovernmentIdUpload = (file) => {
    setFormData((prev) => ({ ...prev, governmentId: file }));
  };

  const handleNextOfKinInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      nextOfKinDetails: {
        ...prev.nextOfKinDetails,
        [name]: value,
      },
    }));
  };

  const handleKycInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      kycDetails: {
        ...prev.kycDetails,
        [name]: value,
      },
    }));
  };

  const handleKycDocumentUpload = (file) => {
    setFormData((prev) => ({
      ...prev,
      kycDetails: {
        ...prev.kycDetails,
        document: file,
      },
    }));
  };

  const handleSave = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "accountDetails":
        return (
          <AccountDetails
            userDetails={formData}
            onInputChange={handleInputChange}
            onAvatarUpload={handleAvatarUpload}
            onGovernmentIdUpload={handleGovernmentIdUpload}
          />
        );
      case "nextOfKin":
        return <NextOfKin nextOfKinDetails={formData.nextOfKinDetails} onInputChange={handleNextOfKinInputChange} />;
      case "kyc":
        return <KYC kycDetails={formData.kycDetails} onInputChange={handleKycInputChange} onDocumentUpload={handleKycDocumentUpload} />;
      default:
        return (
          <AccountDetails
            userDetails={formData}
            onInputChange={handleInputChange}
            onAvatarUpload={handleAvatarUpload}
            onGovernmentIdUpload={handleGovernmentIdUpload}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-start gap-6 py-6 relative h-full">
      <div className="flex items-center justify-center gap-2 w-full bg-[#ECECEC] rounded-[100px]">
        <TabButton label="Account Details" isActive={activeTab === "accountDetails"} onClick={() => setActiveTab("accountDetails")} />
        <TabButton label="Next Of Kin" isActive={activeTab === "nextOfKin"} onClick={() => setActiveTab("nextOfKin")} />
        <TabButton label="KYC" isActive={activeTab === "kyc"} onClick={() => setActiveTab("kyc")} />
      </div>

      {renderTabContent()}

      {/* Fixed buttons at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white py-3 px-6 border-t border-opacityClr-20">
        <div className="flex items-center gap-4 w-full">
          <button
            type="button"
            className="flex items-center justify-center w-full rounded-md border border-transparent py-3 px-5 bg-opacityClr-60 text-base text-white font-semibold leading-[150%] transition-all duration-300 ease-in-out hover:bg-opacityClr-80 cursor-pointer"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="spinner mr-2"></span>
                Processing...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        message="Are you sure you want to save these changes?"
        confirmMsg="Yes, Save Changes"
        cancelMsg="No, Cancel"
      />
    </div>
  );
};

export default EditUserDrawer;
