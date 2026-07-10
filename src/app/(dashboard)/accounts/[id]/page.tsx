"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  Mail,
  Phone,
  User,
  Wallet,
  Shield,
  Users,
  Loader2,
  ExternalLink,
  MapPin,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import useUserAPI from "@/services/useUsersAPI";

function formatDate(value?: string | null, withTime = true) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  if (!withTime) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMoney(amount: number, currency = "NGN") {
  return `₦${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}${currency && currency !== "NGN" ? ` ${currency}` : ""}`;
}

function getInitials(firstName?: string, lastName?: string, email?: string) {
  const first = firstName?.trim()?.[0] || "";
  const last = lastName?.trim()?.[0] || "";
  const initials = `${first}${last}`.toUpperCase();
  if (initials) return initials;
  return (email?.trim()?.[0] || "U").toUpperCase();
}

function capitalize(value?: string | null) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function DetailField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-primary-10/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary-10" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 font-Raleway">{label}</p>
        <div className="text-sm font-semibold text-primary-10 font-Raleway break-words">{value || "—"}</div>
      </div>
    </div>
  );
}

function kycBadge(value: boolean) {
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs rounded-md font-medium ${
        value ? "bg-[#CEDDB7] text-[#6D9F1B]" : "bg-[#DBC8C0] text-[#9F471B]"
      }`}
    >
      {value ? "Verified" : "Pending"}
    </span>
  );
}

function ProfileAvatar({
  src,
  firstName,
  lastName,
  email,
}: {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(firstName, lastName, email);
  const showImage = Boolean(src) && !imageError;

  return (
    <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-10/10 border border-primary-10/20 flex items-center justify-center shrink-0">
      {showImage ? (
        <img
          src={src || ""}
          alt={`${firstName || ""} ${lastName || ""}`.trim() || "User avatar"}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-2xl font-bold text-primary-10 font-Raleway">{initials}</span>
      )}
    </div>
  );
}

const UserDetailPage = () => {
  const params = useParams();
  const userId = String(params.id || "");

  const { userDetail, isLoadingUserDetail, userDetailError } = useUserAPI({
    userId,
    enableUserDetail: true,
    enableStats: false,
  });

  if (isLoadingUserDetail) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary-10" />
        <p className="text-primary-10 font-Raleway text-lg">Loading user details...</p>
      </div>
    );
  }

  if (userDetailError || !userDetail) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
        <p className="text-primary-10 font-Raleway text-lg">User not found</p>
        <Link href="/accounts" className="text-sm font-Raleway font-semibold text-primary-20 hover:underline">
          Back to Users
        </Link>
      </div>
    );
  }

  const { profile, wallet, nextOfKin } = userDetail;
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "User";
  const addressParts = [
    profile.address.address,
    profile.address.city,
    profile.address.state,
    profile.address.country,
  ].filter(Boolean);

  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Users", href: "/accounts" },
          { label: fullName },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <ProfileAvatar
            src={profile.profilePicture}
            firstName={profile.firstName}
            lastName={profile.lastName}
            email={userDetail.email}
          />
          <div className="min-w-0">
            <h2 className="text-[28px] font-Raleway font-bold text-primary-10 truncate">{fullName}</h2>
            <p className="text-sm font-Raleway font-medium text-gray-600 mt-1 truncate">{userDetail.email}</p>
            <p className="text-sm font-Raleway text-gray-500 mt-1">{userDetail.phoneNumber || "No phone"}</p>
          </div>
        </div>

        <span
          className={`inline-flex items-center px-3 py-1.5 text-sm rounded-lg font-semibold shrink-0 ${
            userDetail.isBlocked ? "bg-[#DBC8C0] text-[#9F471B]" : "bg-[#CEDDB7] text-[#6D9F1B]"
          }`}
        >
          {userDetail.isBlocked ? "Blocked" : "Active"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-6">
          <h3 className="text-lg font-Raleway font-bold text-primary-10">Account</h3>
          <div className="flex flex-col gap-5">
            <DetailField label="Full Name" value={fullName} icon={User} />
            <DetailField label="Email" value={userDetail.email} icon={Mail} />
            <DetailField label="Phone Number" value={userDetail.phoneNumber || "—"} icon={Phone} />
            <DetailField label="Referral Code" value={userDetail.referralCode || "—"} icon={User} />
            <DetailField label="Has PIN" value={userDetail.hasPin ? "Yes" : "No"} icon={Shield} />
            <DetailField label="Email Verified At" value={formatDate(userDetail.emailVerifiedAt)} icon={Calendar} />
            <DetailField label="Date Joined" value={formatDate(userDetail.createdAt)} icon={Calendar} />
            <DetailField label="Last Updated" value={formatDate(userDetail.updatedAt)} icon={Calendar} />
            {userDetail.blockedAt && (
              <DetailField label="Blocked At" value={formatDate(userDetail.blockedAt)} icon={Calendar} />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-6">
          <h3 className="text-lg font-Raleway font-bold text-primary-10">Profile</h3>
          <div className="flex flex-col gap-5">
            <DetailField label="Gender" value={capitalize(profile.gender)} icon={User} />
            <DetailField label="Date of Birth" value={formatDate(profile.dateOfBirth, false)} icon={Calendar} />
            <DetailField label="Street Address" value={profile.address.address || "—"} icon={MapPin} />
            <DetailField label="City" value={profile.address.city || "—"} icon={MapPin} />
            <DetailField label="State" value={profile.address.state || "—"} icon={MapPin} />
            <DetailField label="Country" value={profile.address.country || "—"} icon={MapPin} />
            <DetailField
              label="Full Address"
              value={addressParts.length ? addressParts.join(", ") : "—"}
              icon={MapPin}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-6">
          <h3 className="text-lg font-Raleway font-bold text-primary-10">KYC</h3>
          <div className="flex flex-col gap-5">
            <DetailField label="NIN" value={kycBadge(profile.kyc.nin)} icon={Shield} />
            <DetailField label="BVN" value={kycBadge(profile.kyc.bvn)} icon={Shield} />
            <DetailField label="Utility Bill" value={kycBadge(profile.kyc.utilityBill)} icon={Shield} />
            {profile.utilityBillUrl && (
              <DetailField
                label="Utility Bill Document"
                icon={ExternalLink}
                value={
                  <a
                    href={profile.utilityBillUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-10 hover:underline"
                  >
                    Open document
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                }
              />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-6">
          <h3 className="text-lg font-Raleway font-bold text-primary-10">Wallet</h3>
          <div className="flex flex-col gap-5">
            <DetailField label="Balance" value={formatMoney(wallet.balance, wallet.currency)} icon={Wallet} />
            <DetailField
              label="Referral Balance"
              value={formatMoney(wallet.referralBalance, wallet.currency)}
              icon={Wallet}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-opacityClr-30 bg-white p-6 flex flex-col gap-6 lg:col-span-2">
          <h3 className="text-lg font-Raleway font-bold text-primary-10">Next of Kin</h3>
          {nextOfKin ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DetailField
                label="Name"
                value={[nextOfKin.firstName, nextOfKin.lastName].filter(Boolean).join(" ") || "—"}
                icon={Users}
              />
              <DetailField label="Email" value={nextOfKin.email || "—"} icon={Mail} />
              <DetailField
                label="Phone"
                value={typeof nextOfKin.phoneNumber === "string" ? nextOfKin.phoneNumber : "—"}
                icon={Phone}
              />
              <DetailField label="Relationship" value={nextOfKin.relationship || "—"} icon={Users} />
            </div>
          ) : (
            <p className="text-sm text-gray-500 font-Raleway">No next of kin on file.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 font-Raleway">User ID: {userDetail.id}</p>
    </section>
  );
};

export default UserDetailPage;
