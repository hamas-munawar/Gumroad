"use client";
import { Product, Tenant } from '@/payload-types';

import CheckoutItem from './CheckoutItem';

const CheckoutItemsList = ({
  products,
  tenantSlug,
}: {
  products: (Product & { image: { url: string } } & {
    tenant: Tenant & { image: { url: string } };
  })[];
  tenantSlug: string;
}) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      {products?.map((product, i) => (
        <CheckoutItem
          key={product.id}
          product={product}
          isLast={i > products.length - 2}
          tenantSlug={tenantSlug}
        />
      ))}
    </div>
  );
};

export default CheckoutItemsList;
