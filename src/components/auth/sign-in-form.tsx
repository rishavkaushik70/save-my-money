"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { SignInSchema, signInSchema } from "@/lib/validators/auth";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInSchema) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }

    toast.success("Login successful!");
    form.reset();
    router.replace("/dashboard");
  };

  return (
    <>
      <div className="auth-form-heading">
        <span className="auth-form-kicker">Welcome back</span>
        <h1 className="auth-form-title mt-2">Sign in to your account</h1>
        <p className="auth-form-copy mt-2 text-sm leading-6">
          Pick up where you left off and see your money more clearly.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5">
        <div className="space-y-2">
          <label htmlFor="sign-in-email" className="auth-label">Email address</label>
          <div className="auth-field flex items-center gap-3 rounded-xl border px-3.5">
            <Mail className="auth-field-icon size-[18px] shrink-0" aria-hidden="true" />
            <Input
              id="sign-in-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(form.formState.errors.email)}
              className="auth-input h-12 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email && (
            <p className="auth-error" role="alert">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="sign-in-password" className="auth-label">Password</label>
          <div className="auth-field flex items-center gap-3 rounded-xl border px-3.5">
            <LockKeyhole className="auth-field-icon size-[18px] shrink-0" aria-hidden="true" />
            <Input
              id="sign-in-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(form.formState.errors.password)}
              className="auth-input h-12 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              {...form.register("password")}
            />
          </div>
          {form.formState.errors.password && (
            <p className="auth-error" role="alert">{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="auth-submit mt-1 h-12 w-full rounded-xl text-sm font-semibold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signing you in…" : "Sign in"}
          {!form.formState.isSubmitting && <ArrowRight className="ml-2 size-4" />}
        </Button>
      </form>

      <p className="auth-account-switch mt-6 text-center text-sm">
        New to SaveMyMoney?{" "}
        <Link href="/sign-up" className="auth-link font-semibold">Create an account</Link>
      </p>

      <div className="auth-security-note mt-6 flex items-center justify-center gap-2 border-t pt-5 text-xs">
        <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
        <span>Secure email sign-in</span>
      </div>
    </>
  );
};

export default SignInForm;
