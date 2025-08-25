import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { AUTH_TOKEN } from "../constants";

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
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        username: z
          .string()
          .min(3, "Username must be at least 3 characters long")
          .max(20, "Username must be at most 20 characters long")
          .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
          )
          .refine(
            (val) =>
              !["admin", "root", "superuser"].includes(val.toLowerCase()),
            "This username is not allowed"
          ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.payload.create({
        collection: "users",
        data: {
          ...input,
          password: input.password,
        },
      });

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
        // TODO: Ensure cross-domain cookie sharing
      });

      return user;
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
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
        // TODO: Ensure cross-domain cookie sharing
      });

      return user;
    }),
});
