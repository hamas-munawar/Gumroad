import type { Stripe } from "stripe";

import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";
import config from "@payload-config";
import { TRPCError } from "@trpc/server";

export async function POST(request: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await request.blob()).text(),
      request.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET! as string
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (error! instanceof Error) {
      console.log(`❌  Webhook signature verification failed.`, errorMessage);
    }

    return NextResponse.json({ errorMessage }, { status: 400 });
  }

  console.log("✅  Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "account.updated",
  ];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;

          if (!data.metadata?.userId) throw new Error("User ID is required.");

          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) throw new Error("User not found.");

          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            },
            {
              stripeAccount: event.account,
            }
          );

          if (
            !expandedSession.line_items ||
            !expandedSession.line_items.data.length
          ) {
            throw new Error("No line items found in the session.");
          }

          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];

          for (const item of lineItems) {
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                stripeAccountId: event.account,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.metadata.name,
              },
            });
          }
          break;
        case "account.updated":
          data = event.data.object as Stripe.Account;

          const account = await payload.update({
            collection: "tenants",
            where: {
              stripeAccountId: { equals: data.id },
            },
            data: {
              stripeDetailsSubmitted: data.details_submitted,
            },
          });

          if (!account)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Tenant not found",
            });

          break;

        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Unhandled event type ${event.type}`,
          });
      }
    } catch (error) {
      console.log(error);

      return NextResponse.json(
        { errorMessage: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}
