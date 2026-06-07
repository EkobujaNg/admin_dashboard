"use client";

import React from "react";
import AddPropertyForm from "./AddPropertyForm";

const AddPropertyCardDrawer = () => {
  return (
    <div className="flex flex-col items-start gap-6 py-6 relative h-full overflow-y-auto">
      <AddPropertyForm />
    </div>
  );
};

export default AddPropertyCardDrawer;
