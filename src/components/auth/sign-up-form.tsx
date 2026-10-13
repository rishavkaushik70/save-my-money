"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { SignUpSchema, signUpSchema } from "@/lib/validators/auth";

export default function SignUpForm() {
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignUpSchema) => {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created successfully. Please login to continue.");
    form.reset();
    router.push("/sign-in");
  };

  return (
    <>
      <div className="auth-form-heading">
        <span className="auth-form-kicker">Get started for free</span>
        <h1 className="auth-form-title mt-2">Create your account</h1>
        <p className="auth-form-copy mt-2 text-sm leading-6">
          A clearer picture of your money starts with a few details.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="sign-up-name" className="auth-label">Full name</label>
          <div className="auth-field flex items-center gap-3 rounded-xl border px-3.5">
            <User className="auth-field-icon size-[18px] shrink-0" aria-hidden="true" />
            <Input
              id="sign-up-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={Boolean(form.formState.errors.name)}
              className="auth-input h-12 border-0 bg-transparent dark:bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              {...form.register("name")}
            />
          </div>
          {form.formState.errors.name && (
            <p className="auth-error" role="alert">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sign-up-email" className="auth-label">Email address</label>
          <div className="auth-field flex items-center gap-3 rounded-xl border px-3.5">
            <Mail className="auth-field-icon size-[18px] shrink-0" aria-hidden="true" />
            <Input
              id="sign-up-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(form.formState.errors.email)}
              className="auth-input h-12 border-0 bg-transparent dark:bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email && (
            <p className="auth-error" role="alert">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sign-up-password" className="auth-label">Password</label>
          <div className="auth-field flex items-center gap-3 rounded-xl border px-3.5">
            <LockKeyhole className="auth-field-icon size-[18px] shrink-0" aria-hidden="true" />
            <Input
              id="sign-up-password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={Boolean(form.formState.errors.password)}
              className="auth-input h-12 border-0 bg-transparent dark:bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              {...form.register("password")}
            />
          </div>
          {form.formState.errors.password && (
            <p className="auth-error" role="alert">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sign-up-confirm-password" className="auth-label">Confirm password</label>
          <div className="auth-field flex items-center gap-3 rounded-xl border px-3.5">
            <LockKeyhole className="auth-field-icon size-[18px] shrink-0" aria-hidden="true" />
            <Input
              id="sign-up-confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              aria-invalid={Boolean(form.formState.errors.confirmPassword)}
              className="auth-input h-12 border-0 bg-transparent dark:bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              {...form.register("confirmPassword")}
            />
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="auth-error" role="alert">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="auth-submit mt-2 h-12 w-full rounded-xl text-sm font-semibold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating your account…" : "Create account"}
        </Button>
      </form>

      <p className="auth-account-switch mt-5 text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="auth-link font-semibold">Sign in</Link>
      </p>
    </>
  );
}
