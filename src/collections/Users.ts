import { isSuperAdmin } from "@/lib/access";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

import type { CollectionConfig } from "payload";

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true;
      // Allow users to update their own profile
      return req.user?.id === id;
    },
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  auth: {
    cookies: {
      ...(process.env.NODE_ENV !== "development" && {
        sameSite: "None",
        secure: true,
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      }),
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed

    {
      name: "username",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["user", "super-admin"],
      saveToJWT: true,
      access: {
        create: ({ req }) => Boolean(req.user?.roles?.includes("super-admin")),
        update: ({ req }) => Boolean(req.user?.roles?.includes("super-admin")),
      },
      admin: {
        position: "sidebar",
      },
    },
    {
      ...defaultTenantArrayField,
      admin: { ...(defaultTenantArrayField.admin || {}), position: "sidebar" },
    },
  ],
};
