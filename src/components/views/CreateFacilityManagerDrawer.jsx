"use client";

import React, { useState } from "react";
import { FiCopy, FiUpload } from "react-icons/fi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { customSelectStyles } from "@/lib/utils";
import { FiInfo } from "react-icons/fi";

const CreateFacilityManagerDrawer = ({ closeModal }) => {
  const animatedComponents = makeAnimated();
  const [formData, setFormData] = useState({
    email: "",
    password: generatePassword(),
    properties: [],
    phone: "",
    gender: "female",
    idDocument: null,
    dob: "",
  });

  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  function generatePassword() {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  const propertyOptions = [
    { value: "oak_villa", label: "Oak Villa" },
    { value: "maple_residence", label: "Maple Residence" },
    { value: "pine_heights", label: "Pine Heights" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, idDocument: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleGeneratePassword = () => {
    setFormData((prev) => ({ ...prev, password: generatePassword() }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.password);
    // You might want to add a toast notification here
  };

  return (
    <div className="flex flex-col gap-6 py-6 relative h-full">
      <div>
        <h3 className="text-xl font-Raleway font-bold text-primary-10">Create Manager Access</h3>
        <p className="text-sm text-gray-600 mt-1">Fill in the details below to create a new facility manager account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        {/* Email Address */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent"
            placeholder="Who are you giving access to?"
            required
          />
        </div>

        {/* Default Password */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Default Password</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPasswordInfo(!showPasswordInfo)}
                className="text-primary-10 text-xs flex items-center gap-1"
                onMouseEnter={() => setShowPasswordInfo(true)}
                onMouseLeave={() => setShowPasswordInfo(false)}
              >
                Why?
                <FiInfo size={14} />
              </button>
              {showPasswordInfo && (
                <div className="absolute right-0 mt-1 w-64 p-2 bg-white border border-gray-200 rounded-lg shadow-lg text-xs text-gray-600 z-10">
                  This is a temporary password. The user will be prompted to change it on first login.
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              value={formData.password}
              readOnly
              className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg bg-gray-50"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <button type="button" onClick={copyToClipboard} className="p-1.5 text-gray-500 hover:text-primary-10" title="Copy password">
                <FiCopy size={18} />
              </button>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-primary-10 text-sm font-medium px-3 py-1.5 bg-primary-10 bg-opacity-10 rounded-md"
              >
                Generate Code
              </button>
            </div>
          </div>
        </div>

        {/* Assigned Properties */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Assigned Properties</label>
          <Select
            isMulti
            name="properties"
            options={propertyOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            closeMenuOnSelect={false}
            components={animatedComponents}
            styles={customSelectStyles}
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                properties: selected.map((item) => item.value),
              }))
            }
            placeholder="Select properties..."
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <div className="flex">
            <select
              className="w-24 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent"
              defaultValue="+234"
            >
              <option value="+234">+234</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Gender</label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-10 focus:ring-primary-10"
              />
              <span className="ml-2 text-gray-700">Female</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-10 focus:ring-primary-10"
              />
              <span className="ml-2 text-gray-700">Male</span>
            </label>
          </div>
        </div>

        {/* Upload ID */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Upload Any Government Issued ID</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input type="file" id="idDocument" name="idDocument" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
            <label htmlFor="idDocument" className="cursor-pointer flex flex-col items-center justify-center">
              <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                <span className="text-primary-10 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (max. 5MB)</p>
            </label>
            {formData.idDocument && <p className="text-sm text-gray-700 mt-2">Selected: {formData.idDocument.name}</p>}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Date Of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-10 focus:border-transparent"
            required
          />
        </div>
      </form>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="w-full bg-primary-10 text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          onClick={handleSubmit}
        >
          Create User
        </button>
      </div>
    </div>
  );
};

export default CreateFacilityManagerDrawer;
