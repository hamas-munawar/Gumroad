import z from "zod";

export const registerSchema = z.object({
  email: z.string("Email is Required").email("Invalid email address"),
  password: z.string().min(6),
  username: z
    .string("Username is Required")
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters, and numbers")
    .refine(
      (val) => !["admin", "root", "superuser"].includes(val.toLowerCase()),
      "This username is not allowed"
    ),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
