import type Stripe from "stripe";
import { z } from "zod";

import { PLATFORM_FEE_PERCENTAGE } from "@/constants";
import { stripe } from "@/lib/stripe";
import { generateTenantSubdomain } from "@/lib/utils";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { CheckoutMetadata, ProductMetadata } from "../types";

export const checkoutRouter = createTRPCRouter({
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.payload.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 0,
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const tenantId = user.tenants?.[0]?.tenant as string;
    const tenant = await ctx.payload.findByID({
      collection: "tenants",
      id: tenantId,
    });

    if (!tenant) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Tenant not found",
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL!}/admin`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL!}/admin`,
      type: "account_onboarding",
    });

    if (!accountLink) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create verification link",
      });
    }

    return { url: accountLink.url };
  }),

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
            { archived: { not_equals: true } },
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

      if (!tenant.stripeDetailsSubmitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tenant has not submitted Stripe details",
        });
      }

      const totalAmount = products.docs.reduce(
        (acc, item) => acc + item.price * 100,
        0
      );

      const platformFee = Math.round(
        totalAmount * (PLATFORM_FEE_PERCENTAGE / 100)
      );

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

      const domain = generateTenantSubdomain(tenant.slug);

      const checkout = await stripe.checkout.sessions.create(
        {
          customer_email: ctx.session.user.email,
          success_url: `${domain}/checkout?success=true`,
          cancel_url: `${domain}/checkout?cancel=true`,
          mode: "payment",
          line_items: lineItems,
          invoice_creation: { enabled: true },
          metadata: { userId: ctx.session.user.id } as CheckoutMetadata,
          payment_intent_data: {
            application_fee_amount: platformFee,
          },
        },
        {
          stripeAccount: tenant.stripeAccountId,
        }
      );

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
          and: [
            { id: { in: input.productIds } },
            { archived: { not_equals: true } },
          ],
        },
        select: {
          content: false, // Exclude protected content
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
