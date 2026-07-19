"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserX,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import useFacilityManagerAPI from "@/services/useFacilityManagerAPI";
import AssignPropertySection from "@/components/views/AssignPropertySection";
import FacilityManagerAssistantsSection from "@/components/views/FacilityManagerAssistantsSection";

function formatPhoneNumber(phoneNumber?: { code?: string; number?: string }) {
  if (!phoneNumber?.number) return "—";
  return `${phoneNumber.code || ""} ${phoneNumber.number}`.trim();
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function DetailField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary-10/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary-10" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 font-Raleway">{label}</p>
        <p className="text-sm font-semibold text-primary-10 font-Raleway break-words">{value}</p>
      </div>
    </div>
  );
}

const FacilityManagerDetailPage = () => {
  const params = useParams();
  const managerId = String(params.id || "");
  const [idImageError, setIdImageError] = useState(false);
  const [confirmType, setConfirmType] = useState<"block" | "unblock" | "">("");

  const {
    facilityManager,
    isLoadingFacilityManager,
    facilityManagerError,
    blockManager,
    unblockManager,
    isBlockingManager,
    isUnblockingManager,
  } = useFacilityManagerAPI({
    managerId,
    enableDetail: true,
  });

  if (isLoadingFacilityManager) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary-10" />
        <p className="text-primary-10 font-Raleway text-lg">Loading facility manager...</p>
      </div>
    );
  }

  if (facilityManagerError || !facilityManager) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
        <p className="text-primary-10 font-Raleway text-lg">Facility manager not found</p>
        <Link href="/facility-admin" className="text-sm font-Raleway font-semibold text-primary-20 hover:underline">
          Back to FM Manager
        </Link>
      </div>
    );
  }

  const fullName =
    [facilityManager.firstName, facilityManager.lastName].filter(Boolean).join(" ") || "Facility Manager";
  const isBlocked = facilityManager.isBlocked;
  const isConfirmPending = isBlockingManager || isUnblockingManager;

  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "FM Manager", href: "/facility-admin" },
          { label: fullName },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between w-full gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[28px] font-Raleway font-bold text-primary-10">{fullName}</h2>
            <span
              className={`inline-flex items-center gap-2 px-2.5 py-1 text-sm leading-5 rounded-lg ${
                isBlocked ? "bg-[#DBC8C0] text-[#9F471B]" : "bg-[#CEDDB7] text-[#6D9F1B]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isBlocked ? "bg-[#9F471B]" : "bg-[#6D9F1B]"}`} />
              {isBlocked ? "Blocked" : "Active"}
            </span>
          </div>
          <p className="text-sm font-Raleway font-medium text-gray-600">
            Facility manager profile and details
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfirmType(isBlocked ? "unblock" : "block")}
          disabled={isConfirmPending}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg border font-Raleway font-semibold text-sm transition-colors disabled:opacity-50 ${
            isBlocked
              ? "border-[#6D9F1B] text-[#6D9F1B] hover:bg-[#CEDDB7]/40"
              : "border-[#9F1B1B] text-[#9F1B1B] hover:bg-[#DBC8C0]/40"
          }`}
        >
          {isBlocked ? <ShieldCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
          {isBlocked ? "Unblock manager" : "Block manager"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-6">
          <h3 className="text-lg font-Raleway font-bold text-primary-10">Profile Information</h3>

          <div className="flex flex-col gap-5">
            <DetailField label="First Name" value={facilityManager.firstName || "—"} icon={User} />
            <DetailField label="Last Name" value={facilityManager.lastName || "—"} icon={User} />
            <DetailField label="Email Address" value={facilityManager.email || "—"} icon={Mail} />
            <DetailField
              label="Phone Number"
              value={formatPhoneNumber(facilityManager.phoneNumber)}
              icon={Phone}
            />
            <DetailField label="Date Added" value={formatDate(facilityManager.createdAt)} icon={Calendar} />
            {facilityManager.blockedAt && (
              <DetailField label="Blocked At" value={formatDate(facilityManager.blockedAt)} icon={Calendar} />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-6">
          <h3 className="text-lg font-Raleway font-bold text-primary-10">Government Issued ID</h3>

          {facilityManager.idCard ? (
            <div className="flex flex-col gap-4">
              {!idImageError ? (
                <img
                  src={facilityManager.idCard}
                  alt="Government ID"
                  className="w-full max-h-80 object-contain rounded-lg border border-gray-200 bg-gray-50"
                  onError={() => setIdImageError(true)}
                />
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-600 font-Raleway mb-3">Preview unavailable for this document.</p>
                  <a
                    href={facilityManager.idCard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-10 hover:underline"
                  >
                    Open ID document
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {!idImageError && (
                <a
                  href={facilityManager.idCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-10 hover:underline self-start"
                >
                  Open full document
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 font-Raleway">No government ID uploaded.</p>
          )}
        </div>
      </div>

      <AssignPropertySection managerId={managerId} />
      <FacilityManagerAssistantsSection managerId={managerId} />

      <ConfirmationModal
        isOpen={Boolean(confirmType)}
        onClose={() => setConfirmType("")}
        onConfirm={() => {
          if (confirmType === "unblock") {
            unblockManager(managerId, {
              onSuccess: () => setConfirmType(""),
              onError: () => setConfirmType(""),
            });
            return;
          }
          blockManager(managerId, {
            onSuccess: () => setConfirmType(""),
            onError: () => setConfirmType(""),
          });
        }}
        message={
          confirmType === "unblock"
            ? `Unblock ${facilityManager.firstName || "this facility manager"}?`
            : `Block ${facilityManager.firstName || "this facility manager"}?`
        }
        cancelMsg="Cancel"
        confirmMsg={isConfirmPending ? "Updating..." : confirmType === "unblock" ? "Unblock" : "Block"}
        confirmButtonColor={confirmType === "unblock" ? "green" : "red"}
        confirmDisabled={isConfirmPending}
      />
    </section>
  );
};

export default FacilityManagerDetailPage;
