import { cookies as getCookies, headers as getHeaders } from "next/headers";

import { stripe } from "@/lib/stripe";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { AUTH_TOKEN } from "../constants";
import { loginSchema, registerSchema } from "../schema";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = ctx.payload.auth({ headers });

    return session;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_TOKEN);
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = input.username.toLowerCase().trim();
      const existing = await ctx.payload.find({
        collection: "tenants",
        where: { slug: { equals: slug } },
        limit: 1,
      });

      if (existing.totalDocs > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username is not available — it's already taken.",
        });
      }

      try {
        const account = await stripe.accounts.create({});

        if (!account) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create Stripe account",
          });
        }

        const createdTenant = await ctx.payload.create({
          collection: "tenants",
          data: {
            username: input.username,
            slug,
            stripeAccountId: account.id, // Will be updated after stripe account is created
            stripeDetailsSubmitted: false,
          },
        });

        try {
          await ctx.payload.create({
            collection: "users",
            data: {
              ...input,
              password: input.password,
              tenants: [{ tenant: createdTenant.id }],
            },
          });
        } catch (userErr) {
          // cleanup orphan tenant if user create fails
          if (createdTenant?.id) {
            await ctx.payload
              .delete({ collection: "tenants", id: createdTenant.id })
              .catch(() => {});
          }
          throw userErr;
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Registration failed",
          // keep cause for observability
          cause: error as Error,
        });
      }

      const user = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!user.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const cookies = await getCookies();
      cookies.set({
        name: AUTH_TOKEN,
        value: user.token,
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      });

      return user;
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const user = await ctx.payload.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!user.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const cookies = await getCookies();
    cookies.set({
      name: AUTH_TOKEN,
      value: user.token,
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    });

    return user;
  }),
});
