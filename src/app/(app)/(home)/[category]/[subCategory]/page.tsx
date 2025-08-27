const SubCategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string; subCategory: string }>;
}) => {
  const { category, subCategory } = await params;

  return (
    <>
      <div>Category: {category}</div>
      <div>Subcategory: {subCategory}</div>
    </>
  );
};

export default SubCategoryPage;
