import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string().trim()
      .min(3, "Name must be at least 3 characters"),

    email: z

      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(1,"Please confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z
  .object({
    email: z
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(1, "Password is required"),
  })

export type SignInSchema = z.infer<typeof signInSchema>;
