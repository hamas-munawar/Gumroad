import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

import type { CollectionConfig } from "payload";

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => Boolean(req.user?.roles?.includes("super-admin")),
    update: ({ req }) => Boolean(req.user?.roles?.includes("super-admin")),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => Boolean(req.user?.roles?.includes("super-admin")),
    update: ({ req }) => Boolean(req.user?.roles?.includes("super-admin")),
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
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
