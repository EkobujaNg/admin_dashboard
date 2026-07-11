"use client";

import React, { useState } from "react";
import { Shield, User } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import useAdminsAPI from "@/services/useAdminsAPI";
import { formatAdminRoles, type AdminAccount } from "@/lib/admins/types";

type ViewAdminDrawerProps = {
  admin: AdminAccount;
  closeModal?: () => void;
  isSelf?: boolean;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPhone(phone?: { code?: string; number?: string }) {
  if (!phone?.number) return "—";
  return `${phone.code || ""} ${phone.number}`.trim();
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-xs font-medium text-gray-500 font-Raleway">{label}</p>
      <div className="text-sm font-semibold text-primary-10 font-Raleway break-words">{value || "—"}</div>
    </div>
  );
}

export default function ViewAdminDrawer({ admin, closeModal, isSelf = false }: ViewAdminDrawerProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { blockAdminAccount, unblockAdminAccount, isBlockingAdmin, isUnblockingAdmin, admin: freshAdmin } =
    useAdminsAPI({
      adminId: admin.id,
      enableDetail: true,
    });

  const current = freshAdmin ?? admin;
  const isPending = isBlockingAdmin || isUnblockingAdmin;

  const handleConfirm = () => {
    if (isSelf) {
      setConfirmOpen(false);
      return;
    }
    if (current.isBlocked) {
      unblockAdminAccount(current.id, {
        onSuccess: () => {
          setConfirmOpen(false);
          closeModal?.();
        },
        onError: () => setConfirmOpen(false),
      });
      return;
    }

    blockAdminAccount(current.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        closeModal?.();
      },
      onError: () => setConfirmOpen(false),
    });
  };

  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-Raleway font-bold text-primary-10">
          {[current.firstName, current.lastName].filter(Boolean).join(" ") || "Admin"}
        </h3>
        <p className="text-sm font-Raleway text-opacityClr-60">{current.email || "—"}</p>
      </div>

      <div className="rounded-xl border border-opacityClr-30 bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-primary-10" />
          <h4 className="text-sm font-bold text-primary-10 font-Raleway">Profile</h4>
        </div>
        <DetailRow label="Phone" value={formatPhone(current.phoneNumber)} />
        <DetailRow label="Status" value={current.isBlocked ? "Blocked" : "Active"} />
        <DetailRow label="Created" value={formatDate(current.createdAt)} />
      </div>

      <div className="rounded-xl border border-opacityClr-30 bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary-10" />
          <h4 className="text-sm font-bold text-primary-10 font-Raleway">Roles</h4>
        </div>
        <DetailRow label="Assigned roles" value={formatAdminRoles(current.roles)} />
      </div>

      <div className="mt-auto pt-4 border-t border-opacityClr-20">
        {isSelf ? (
          <p className="text-sm text-center text-opacityClr-60 font-Raleway">
            You cannot block or unblock your own account.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={isPending}
            className={`w-full px-5 py-[14px] rounded-md font-Raleway font-bold text-base transition-colors disabled:opacity-50 ${
              current.isBlocked
                ? "bg-[#6D9F1B] text-white hover:bg-[#587f16]"
                : "bg-[#9F1B1B] text-white hover:bg-[#7f1616]"
            }`}
          >
            {isPending ? "Updating..." : current.isBlocked ? "Unblock admin" : "Block admin"}
          </button>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        message={
          current.isBlocked
            ? `Unblock ${current.firstName || "this admin"}? They will regain access.`
            : `Block ${current.firstName || "this admin"}? They will lose access.`
        }
        cancelMsg="Cancel"
        confirmMsg={
          isPending ? "Updating..." : current.isBlocked ? "Unblock" : "Block"
        }
        confirmButtonColor={current.isBlocked ? "green" : "red"}
        confirmDisabled={isPending}
      />
    </div>
  );
}
