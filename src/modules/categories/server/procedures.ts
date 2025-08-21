import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import configPromise from "@payload-config";
import { getPayload } from "payload";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ()=>{

    const payload = await getPayload({
      config: configPromise,
    });

    const { docs } = await payload.find({
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
