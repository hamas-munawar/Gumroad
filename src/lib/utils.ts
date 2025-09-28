import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantSubdomain(tenantSlug: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const isDomainRewriteFalse = process.env.DOMAIN_REWRITE === "false";
  if (!isProduction || isDomainRewriteFalse) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/store/${tenantSlug}`;
  }

  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";
  return `${protocol}://${tenantSlug}.${domain}`;
}

export function formatCurrency(amount: string | number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}
