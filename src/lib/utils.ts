import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantSubdomain(tenantSlug: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const isDomainRewriteFalse = process.env.DOMAIN_REWRITE === "false";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  if (!isProduction || isDomainRewriteFalse || !rootDomain)
    return `${appUrl}/store/${tenantSlug}`;

  return `https://${tenantSlug}.${rootDomain}`;
}

export function formatCurrency(amount: string | number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}
