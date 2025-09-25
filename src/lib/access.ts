import { ClientUser } from "payload";

import type { User } from "@/payload-types";

export const isSuperAdmin = (
  user: ClientUser | User | null | undefined
): boolean => {
  return Boolean(user?.roles?.includes("super-admin"));
};
