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

const TenantModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    unitId: "",
    rentAmount: "",
    cycle: "Monthly",
    start: "",
    end: "",
    status: "Active",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        unitId: "",
        rentAmount: "",
        cycle: "Monthly",
        start: "",
        end: "",
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
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-Raleway font-normal text-primary-10">
            {initialData ? "Edit Tenant" : "Add New Tenant"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-primary-10/70 font-Raleway font-normal">
              Tenant Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter tenant name"
              className="border-opacityClr-30 bg-[#F5F5F5] focus-visible:ring-primary-10 h-12 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="unitId" className="text-primary-10/70 font-Raleway font-normal">
              Unit ID
            </Label>
            <Input
              id="unitId"
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              placeholder="e.g., A-101"
              className="border-opacityClr-30 bg-[#F5F5F5] focus-visible:ring-primary-10 h-12 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rentAmount" className="text-primary-10/70 font-Raleway font-normal">
              Rent Amount (₦)
            </Label>
            <Input
              id="rentAmount"
              name="rentAmount"
              value={formData.rentAmount}
              onChange={handleChange}
              placeholder="0"
              className="border-opacityClr-30 bg-[#F5F5F5] focus-visible:ring-primary-10 h-12 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="cycle" className="text-primary-10/70 font-Raleway font-normal">
              Payment Cycle
            </Label>
            <Select
              value={formData.cycle}
              onValueChange={(val) => handleSelectChange("cycle", val)}
            >
              <SelectTrigger className="border-opacityClr-30 bg-[#F5F5F5] focus:ring-primary-10 h-12 rounded-lg w-full">
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4 w-full">
            <div className="flex flex-col gap-2 w-1/2">
              <Label htmlFor="start" className="text-primary-10/70 font-Raleway font-normal">
                Lease Start
              </Label>
              <Input
                id="start"
                name="start"
                type="date"
                value={formData.start}
                onChange={handleChange}
                className="border-opacityClr-30 bg-[#F5F5F5] focus-visible:ring-primary-10 h-12 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <Label htmlFor="end" className="text-primary-10/70 font-Raleway font-normal">
                Lease End
              </Label>
              <Input
                id="end"
                name="end"
                type="date"
                value={formData.end}
                onChange={handleChange}
                className="border-opacityClr-30 bg-[#F5F5F5] focus-visible:ring-primary-10 h-12 rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="status" className="text-primary-10/70 font-Raleway font-normal">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(val) => handleSelectChange("status", val)}
            >
              <SelectTrigger className="border-opacityClr-30 bg-[#F5F5F5] focus:ring-primary-10 h-12 rounded-lg w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-3 sm:justify-between w-full mt-6">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary-10 hover:bg-primary-10/90 text-white rounded-full h-12 font-Raleway font-bold text-base"
          >
            {initialData ? "Save Changes" : "Add Tenant"}
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

export default TenantModal;
