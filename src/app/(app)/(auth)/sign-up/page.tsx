"use client";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { registerSchema } from "@/modules/auth/schema";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

const popins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const SignUpPage = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error(error.message || "Something went wrong");
      },
      onSuccess: () => {
        toast.success("Account created successfully");
        router.push("/");
      },
    })
  );

  const form = useForm({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const username = form.watch("username");
  const usernameError = form.formState.errors.username;
  const showDomain = username && !usernameError;

  return (
    <div className="grid grid-col-1 lg:grid-cols-5 ">
      <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 p-4 lg:p-16">
        <div className="flex mb-8">
          <Link
            href="/"
            className={cn(
              "pl-2 text-4xl xl:text-5xl font-semibold flex-1",
              popins.className
            )}
          >
            Gumroad
          </Link>
          <Button variant="ghost" className="underline border-transparent">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => register.mutate(data))}
            className="flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormDescription
                    className={cn("hidden", showDomain && "block")}
                  >
                    Your store will be on &nbsp;
                    <span className="font-extrabold">{username}</span>
                    .gumroad.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={register.isPending}
              type="submit"
              size="lg"
              variant={"elevated"}
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              Create Account
            </Button>
          </form>
        </Form>
        <Toaster position="top-center" />
      </div>
      <div className="h-screen w-full lg:col-span-2">
        <Image
          src="/auth-background.png"
          alt="Sign Up"
          width={1536}
          height={1024}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
