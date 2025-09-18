import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import TenantFooter from './TenantFooter';
import TenantNavbar, { TenantNavbarSkeleton } from './TenantNavbar';

export default async function HomeLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ tenantSlug: string }>;
  children: React.ReactNode;
}>) {
  const { tenantSlug } = await params;

  const queryClient = getQueryClient();
  try {
    await queryClient.fetchQuery(
      trpc.tenants.getOne.queryOptions({
        tenantSlug,
      })
    );
  } catch {
    notFound();
  }

  await queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      tenantSlug,
    })
  );

  return (
    <div className="flex flex-col min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<TenantNavbarSkeleton />}>
          <TenantNavbar tenantSlug={tenantSlug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 px-4 lg:px-20 bg-[#f4f4f0]">{children}</div>
      <TenantFooter />
    </div>
  );
}
