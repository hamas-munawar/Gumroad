import CheckoutPage from "./CheckoutPage";

const page = async ({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) => {
  const { tenantSlug } = await params;

  return <CheckoutPage tenantSlug={tenantSlug} />;
};

export default page;
