import { Suspense } from 'react';

import { trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface LayoutProps {
  params: {
    category: string;
  };
}

export default async function HomeLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}> &
  LayoutProps) {
  const { category } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </HydrationBoundary>
  );
}
