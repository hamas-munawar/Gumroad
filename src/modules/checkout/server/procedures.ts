import type Stripe from "stripe";
import { z } from "zod";

import { stripe } from "@/lib/stripe";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { CheckoutMetadata, ProductMetadata } from "../types";

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.payload.find({
        collection: "products",
        where: {
          and: [
            { id: { in: input.productIds } },
            { "tenant.slug": { equals: input.tenantSlug } },
          ],
        },
        depth: 2,
      });

      if (
        products.totalDocs === 0 ||
        products.totalDocs !== input.productIds.length
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const {
        docs: [tenant],
      } = await ctx.payload.find({
        collection: "tenants",
        pagination: false,
        where: {
          slug: { equals: input.tenantSlug },
        },
        depth: 1,
      });

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found",
        });
      }

      // TODO: Throw error if tenant doesn't have stripe connected

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => ({
          quantity: 1,
          price_data: {
            unit_amount: product.price * 100, // Stripe handle price in cents
            currency: "usd",
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.name,
                price: product.price,
              } as ProductMetadata,
            },
          },
        }));

      const checkout = await stripe.checkout.sessions.create({
        customer_email: ctx.session.user.email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/${input.tenantSlug}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/${input.tenantSlug}/checkout?cancel=true`,
        mode: "payment",
        line_items: lineItems,
        invoice_creation: { enabled: true },
        metadata: { userId: ctx.session.user.id } as CheckoutMetadata,
      });

      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return { url: checkout.url };
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.payload.find({
        collection: "products",
        where: {
          id: { in: input.productIds },
        },
        depth: 2,
      });

      if (
        products.totalDocs === 0 ||
        products.totalDocs !== input.productIds.length
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Products not found",
        });
      }

      return products.docs;
    }),
});
