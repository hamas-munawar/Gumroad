import { notFound } from "next/navigation";

const SubCategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string; subCategory: string }>;
}) => {
  const { category, subCategory } = await params;

  // Validate parameters
  if (
    !category ||
    !subCategory ||
    typeof category !== "string" ||
    typeof subCategory !== "string" ||
    category.trim().length === 0 ||
    subCategory.trim().length === 0
  ) {
    notFound();
  }

  // Basic sanitization - ensure they're valid slug formats
  const sanitizedCategory = category.replace(/[^a-zA-Z0-9-_]/g, "");
  const sanitizedSubCategory = subCategory.replace(/[^a-zA-Z0-9-_]/g, "");

  if (sanitizedCategory !== category || sanitizedSubCategory !== subCategory) {
    notFound();
  }

  return (
    <>
      <div>Category: {sanitizedCategory}</div>
      <div>Subcategory: {sanitizedSubCategory}</div>
    </>
  );
};

export default SubCategoryPage;
