import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';

import type { CollectionConfig } from "payload";

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
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
