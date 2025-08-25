import { cookies as getCookies, headers as getHeaders } from "next/headers";

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
      try {
        await ctx.payload.create({
          collection: "users",
          data: {
            ...input,
            password: input.password,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username is not available",
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
        // TODO: Ensure cross-domain cookie sharing
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
      // TODO: Ensure cross-domain cookie sharing
    });

    return user;
  }),
});
