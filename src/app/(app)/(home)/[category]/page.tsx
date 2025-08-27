import { notFound } from "next/navigation";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;

  // Validate category parameter
  if (
    !category ||
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    notFound();
  }

  // Basic sanitization - ensure it's a valid slug format
  const sanitizedCategory = category.replace(/[^a-zA-Z0-9-_]/g, "");
  if (sanitizedCategory !== category) {
    notFound();
  }

  return <div>{sanitizedCategory}</div>;
};

export default CategoryPage;
