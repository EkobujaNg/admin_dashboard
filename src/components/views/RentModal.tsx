"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const RentModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    year: "",
    totalRent: "",
    rentType: "Annual",
    status: "Active",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        year: String(new Date().getFullYear() + 1),
        totalRent: "",
        rentType: "Annual",
        status: "Active",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-Raleway font-normal text-primary-10">
            {initialData ? `Edit Rent - ${initialData.year}` : "Add Rent Year"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="year" className="text-primary-10/70 font-Raleway font-normal">
              Year
            </Label>
            <Input
              id="year"
              name="year"
              type="text"
              value={formData.year}
              onChange={handleChange}
              className="border-opacityClr-30 bg-[#F5F5F5] focus-visible:ring-primary-10 h-12 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="totalRent" className="text-primary-10/70 font-Raleway font-normal">
              Total Rent Expected
            </Label>
            <Input
              id="totalRent"
              name="totalRent"
              type="text"
              value={formData.totalRent}
              onChange={handleChange}
              placeholder="0"
              className="border-opacityClr-30 bg-[#F5F5F5] focus-visible:ring-primary-10 h-12 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="rentType" className="text-primary-10/70 font-Raleway font-normal">
              Rent Type
            </Label>
            <Select
              value={formData.rentType}
              onValueChange={(val) => handleSelectChange("rentType", val)}
              className="w-full"
            >
              <SelectTrigger className="border-opacityClr-30 bg-[#F5F5F5] focus:ring-primary-10 h-12 rounded-lg w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Annual">Annual</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="status" className="text-primary-10/70 font-Raleway font-normal">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(val) => handleSelectChange("status", val)}
              className="w-full"
            >
              <SelectTrigger className="border-opacityClr-30 bg-[#F5F5F5] focus:ring-primary-10 h-12 rounded-lg w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-3 sm:justify-between w-full mt-6">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary-10 hover:bg-primary-10/90 text-white rounded-full h-12 font-Raleway font-bold text-base"
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-primary-10 text-primary-10 hover:bg-primary-10/5 rounded-full h-12 font-Raleway font-bold text-base bg-transparent"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RentModal;
