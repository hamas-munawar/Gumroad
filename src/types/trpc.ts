import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers/_app';

// =============================================================================
// TRPC INFERRED TYPES
// =============================================================================
// These types are automatically inferred from tRPC procedures
// This ensures type safety between client and server

// Categories Types
export type CategoriesGetManyOutput = inferProcedureOutput<AppRouter['categories']['getMany']>;
export type CategoryWithSubcategories = CategoriesGetManyOutput[number];

// Type-safe version that matches the actual runtime structure
export type CategoryForComponent = Omit<CategoryWithSubcategories, 'subcategories'> & {
  subcategories?: CategoryWithSubcategories['subcategories'];
};

// Individual subcategory type (extracted from the transformed structure)
export type SubcategoryItem = NonNullable<CategoryWithSubcategories['subcategories']>[number];

// =============================================================================
// UTILITY TYPES
// =============================================================================
// Additional utility types for common patterns

// Type for category selection/filtering
export type CategorySelection = {
  id: string;
  name: string;
  slug: string;
};

// Type for category with optional subcategories (for UI components)
export type CategoryForUI = {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  subcategories?: SubcategoryItem[];
};

// =============================================================================
// TYPE GUARDS
// =============================================================================
// Runtime type checking utilities

export function isCategoryWithSubcategories(
  category: any
): category is CategoryWithSubcategories {
  return (
    typeof category === 'object' &&
    category !== null &&
    typeof category.id === 'string' &&
    typeof category.name === 'string' &&
    typeof category.slug === 'string' &&
    (category.subcategories === undefined ||
      Array.isArray(category.subcategories))
  );
}

export function isSubcategoryItem(item: any): item is SubcategoryItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.slug === 'string' &&
    typeof item.name === 'string'
  );
}