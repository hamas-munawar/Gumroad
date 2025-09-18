"use client";

import { Loader } from 'lucide-react';

import { useCart } from '@/modules/checkout/hooks/useCart';
import { Product, Tenant } from '@/payload-types';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

import CheckoutItemsList from './CheckoutItemsList';
import CheckoutSidebar from './CheckoutSidebar';

const CheckoutPage = ({ tenantSlug }: { tenantSlug: string }) => {
  const { productIds } = useCart(tenantSlug);

  const trpc = useTRPC();
  const { data: products, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions<
      (Product & { image: { url: string } } & {
        tenant: Tenant & { image: { url: string } };
      })[]
    >({ productIds })
  );

  if (isLoading) {
    return (
      <div className="py-6 max-w-5xl mx-auto">
        <div className="py-6 mx-auto border border-dotted rounded-md flex justify-center items-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-6 max-w-5xl mx-auto">
        <div className="py-6 mx-auto border border-dotted rounded-md flex justify-center items-center">
          No Product in your Cart.
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4">
      <div className="col-span-4">
        <CheckoutItemsList products={products} tenantSlug={tenantSlug} />
      </div>
      <div className="col-span-3 border rounded-md overflow-hidden bg-white self-start">
        <CheckoutSidebar products={products} />
      </div>
    </div>
  );
};

export default CheckoutPage;
