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

    let categories = docs.map((parent) => {
      return {
        ...parent,
        subcategories:
          parent.subcategories?.docs &&
          parent.subcategories.docs.map((child) => {
            return { ...(child as Category), subcategories: undefined };
          }),
      };
    });

    return categories;
  })
})
