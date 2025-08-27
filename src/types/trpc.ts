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
  category: unknown
): category is CategoryWithSubcategories {
  if (!category || typeof category !== 'object') return false;
  
  const categoryObj = category as Record<string, unknown>;
  return (
    typeof categoryObj.id === 'string' &&
    typeof categoryObj.name === 'string' &&
    typeof categoryObj.slug === 'string' &&
    (categoryObj.subcategories === undefined ||
      Array.isArray(categoryObj.subcategories))
  );
}

export function isSubcategoryItem(item: unknown): item is SubcategoryItem {
  if (!item || typeof item !== 'object') return false;
  
  const itemObj = item as Record<string, unknown>;
  return (
    typeof itemObj.slug === 'string' &&
    typeof itemObj.name === 'string'
  );
}