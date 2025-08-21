import { getQueryClient, trpc } from "@/trpc/server";

export default async function HomePage() {
  const queryClient = getQueryClient();
  const categories =await queryClient.fetchQuery(trpc.categories.getMany.queryOptions());

  return <section>{JSON.stringify(categories)}</section>;

}
