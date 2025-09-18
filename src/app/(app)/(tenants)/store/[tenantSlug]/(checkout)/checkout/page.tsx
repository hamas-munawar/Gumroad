import CheckoutPage from './CheckoutPage';

const page = async ({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) => {
  const { tenantSlug } = await params;

  return (
    <div className="py-6 max-w-5xl mx-auto ">
      <CheckoutPage tenantSlug={tenantSlug} />
    </div>
  );
};

export default page;
