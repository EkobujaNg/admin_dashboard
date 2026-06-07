"use client";
import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const AccountSharing = () => {
  return (
    <div>
      <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Account Sharing" }]} />
    </div>
  );
};

export default AccountSharing;
