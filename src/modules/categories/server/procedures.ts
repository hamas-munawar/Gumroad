import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ctx})=>{

    const { docs } = await ctx.payload.find({
      collection: "categories",
      depth: 1,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
      pagination: false,
    });

    const categories = docs.map((parent) => ({
        ...parent,
        subcategories: Array.isArray(parent.subcategories?.docs)
          ? parent.subcategories!.docs
              .filter((child): child is Category => typeof child === "object" && child !== null)
              .map(({ slug, name }: Category) => ({ slug, name }))
          : undefined,
      }));

    return categories;
  })
})
