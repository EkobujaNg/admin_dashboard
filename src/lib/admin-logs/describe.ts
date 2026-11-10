import type { AdminLog } from "./types";

type NameLookup = {
  propertyName: (id: string | null) => string | null;
  userName: (id: string | null) => string | null;
};

function money(value: unknown): string | null {
  const n = Number(value);
  return Number.isFinite(n) ? `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}` : null;
}

function shares(value: unknown): string | null {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toLocaleString()} share${n === 1 ? "" : "s"}` : null;
}

/**
 * Turns a log entry into a sentence that names what was changed, e.g.
 * "Hid 'Sky Villa' from investors". Falls back to the backend's description.
 */
export function describeAdminLog(log: AdminLog, lookup: NameLookup): string {
  const meta = log.metadata ?? {};
  const fallback = log.description || log.remark || "—";

  const property =
    log.resourceType === "property"
      ? (typeof meta.name === "string" && meta.name) || lookup.propertyName(log.resourceId)
      : null;
  const propertyLabel = property ? `'${property}'` : "a property";

  const userId =
    log.resourceType === "user" ? log.resourceId : typeof meta.userId === "string" ? meta.userId : null;
  const user = lookup.userName(userId);

  switch (log.action) {
    case "property_created":
      return `Created ${propertyLabel}`;
    case "property_updated":
      return `Updated ${propertyLabel}`;
    case "property_hidden_toggled":
      if (meta.isHidden === true) return `Hid ${propertyLabel} from investors`;
      if (meta.isHidden === false) return `Showed ${propertyLabel} to investors again`;
      return fallback;
    case "property_commission_updated":
      return meta.commission != null
        ? `Changed commission on ${propertyLabel} to ${meta.commission}%`
        : `Changed commission on ${propertyLabel}`;
    case "property_featured_added":
      return `Featured ${propertyLabel} on the homepage`;
    case "property_featured_removed":
      return `Removed ${propertyLabel} from the homepage`;
    case "property_ekobuja_buyback_updated":
      return `Changed the buyback rate on ${propertyLabel}`;
    case "property_profit_sharing_rate_updated":
      return `Changed profit sharing on ${propertyLabel}`;
    case "property_quarterly_report_uploaded":
      return `Uploaded a quarterly report for ${propertyLabel}`;
    case "property_quarterly_report_updated":
      return `Updated a quarterly report for ${propertyLabel}`;
    case "utility_bill_verified":
      return user ? `Verified ${user}'s utility bill` : "Verified an investor's utility bill";
    case "user_blocked":
      return user ? `Blocked ${user}` : fallback;
    case "user_unblocked":
      return user ? `Unblocked ${user}` : fallback;
    case "buyback_approved":
    case "buyback_declined": {
      const verb = log.action === "buyback_approved" ? "Approved" : "Declined";
      const parts = [shares(meta.units), money(meta.totalAmount) && `for ${money(meta.totalAmount)}`]
        .filter(Boolean)
        .join(" ");
      const whose = user ? ` from ${user}` : "";
      return parts ? `${verb} buyback of ${parts}${whose}` : `${verb} a buyback request${whose}`;
    }
    default:
      return fallback;
  }
}
