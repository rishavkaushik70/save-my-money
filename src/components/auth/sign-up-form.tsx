"use client";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { signUpSchema, SignUpSchema } from "@/lib/validators/auth";
import { GiWallet } from "react-icons/gi";
import {
  ChartNoAxesCombined,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpSchema) => {
    const { data: response, error } = await authClient.signUp.email({
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
    <div className="grid grid-cols-1 md:grid-cols-2 rounded-md shadow-md shadow-gray-300 border border-gray-200 pt-5 md:pt-0">
      <div className="md:bg-primary/5 md:px-10 md:py-7 px-0 py-0">
        <Link href={"/"}>
          <span className="text-primary text-md font-bold flex gap-2 items-center">
            {" "}
            <GiWallet className="size-7" /> SaveMyMoney
          </span>
        </Link>
        <div className="flex flex-col md:justify-start md:items-start md:mt-20 mt-5 md:ml-10 justify-center items-center">
          <h1 className="md:text-7xl text-5xl md:w-[75%] font-bold text-center md:text-left">
            Take Control of <span className="text-primary">Your Money</span>
          </h1>
          <div className="mt-5 text-gray-500 md:text-2xl text-xl md:w-[80%] text-center md:text-left">
            Track expenses, set budgets, and achieve your financial goals with
            clarity.
          </div>
          <div className=" flex flex-col justify-center items-start">
            <div className="flex gap-5 mt-10 justify-center items-center">
              <div className="px-2 py-2 border rounded-md bg-primary/10">
                <ChartNoAxesCombined className="text-primary size-7" />
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-lg">Smart Expense Tracking</p>
                <p className="text-gray-500 text-sm">
                  Monitor your spending in real-time
                </p>
              </div>
            </div>
            <div className="flex gap-5 mt-10 justify-center items-center">
              <div className="px-3 py-3 border rounded-md bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-target-arrow-icon lucide-target-arrow text-primary"
                >
                  <path d="M19 2v3h3" />
                  <path d="M13.4 10.6 22 2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M12.3 6H12a6 6 0 1 0 6 6v-.3" />
                  <path d="M15 2.5A9.93 9.93 0 1 0 21.5 9" />
                  <path d="M5.3 19.4 4 22" />
                  <path d="M18.7 19.4 20 22" />
                </svg>
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-lg">Set & Achieve Goals</p>
                <p className="text-gray-500 text-sm">
                  Plan your savings and reach your goals
                </p>
              </div>
            </div>
            <div className="flex gap-5 mt-10 justify-center items-center">
              <div className="px-2 py-2 border rounded-md bg-primary/10">
                <ShieldCheck className="text-primary size-7" />
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-lg">Secure & Private</p>
                <p className="text-gray-500 text-sm">
                  Your data is safe and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%] mx-auto md:hidden border mt-5"></div>
      <div className="px-9 md:py-10 py-5 md:bg-white rounded-r-md">
        <div className="mx-auto w-full text-center">
          <h1 className="font-bold text-2xl mb-1">Create your account</h1>
          <p className="text-gray-500 mb-10 text-sm">
            Start your journey to financial freedom
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>

            <div className="flex border justify-center items-center pl-4 rounded-md w-full transition-all focus-within:ring-2 focus-within:ring-gray-300 focus-within:border-gray-300">
              <span>
                <User className="text-gray-400 border-none size-5" />
              </span>
              <Input
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                className=" w-full focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
                {...form.register("name")}
              />
            </div>

            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>

            <div className="flex border justify-center items-center pl-4 rounded-md w-full transition-all focus-within:ring-2 focus-within:ring-gray-300 focus-within:border-gray-300">
              <span>
                <Mail className="text-gray-400 border-none size-4" />
              </span>
              <Input
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                className=" w-full focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
                {...form.register("email")}
              />
            </div>

            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>

            <div className="flex  border justify-center items-center pl-4 rounded-md w-full transition-all focus-within:ring-2 focus-within:ring-gray-300 focus-within:border-gray-300">
              <span>
                <LockKeyhole className="text-gray-400 border-none size-4" />
              </span>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                className=" w-full focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
                {...form.register("password")}
              />
            </div>

            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>

            <div className="flex border justify-center items-center pl-4 rounded-md w-full transition-all focus-within:ring-2 focus-within:ring-gray-300 focus-within:border-gray-300">
              <span>
                <LockKeyhole className="text-gray-400 border-none size-4" />
              </span>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                className=" w-full focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
                {...form.register("confirmPassword")}
              />
            </div>

            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Loading..." : "Create Account"}
          </Button>
          <div className="w-full border mt-5 md:border-gray-100 border-gray-200 relative">
            <div className="absolute w-fit md:px-5 text-gray-500 -top-3 left-1/2 -translate-x-1/2 px-3 md:bg-white bg-gray-100 text-sm">
              or continue with
            </div>
          </div>
          <div className="flex justify-around items-center gap-3 md:gap-0">
            <Link href={"/"}>
              <Button className="md:px-9 px-2 bg-transparent text-black border border-gray-200 flex justify-center items-center gap-3 hover:bg-primary/10">
                <img src="/google.svg" alt="" className="size-4" />
                <span className="font-semibold">Google</span>
              </Button>
            </Link>
            <Link href={"/"}>
              <Button className="md:px-9 px-2 bg-transparent text-black border border-gray-200 flex justify-center items-center gap-3 hover:bg-primary/10">
                <img src="/github.svg" alt="" className="size-4" />
                <span className="font-semibold">GitHub</span>
              </Button>
            </Link>
            <Link href={"/"}>
              <Button className="md:px-9 px-3 bg-transparent text-black border border-gray-200 flex justify-center items-center gap-3 hover:bg-primary/10">
                <img src="/apple.svg" alt="" className="size-4" />
                <span className="font-semibold">Apple</span>
              </Button>
            </Link>
          </div>
          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link href={"/sign-in"}>
              <span className="text-primary font-semibold">Sign in</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
