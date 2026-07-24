"use client";
import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { SignInSchema, signInSchema } from "@/lib/validators/auth";
import { LockKeyhole, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    const { data: response, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
    console.log(data);
    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }
    toast.success("Login successful!");
    form.reset();
    router.replace("/dashboard");
  };
  return (
    <div className="flex flex-col items-center justify-center px-5 md:px-0">
      <div className="bg-white w-full shadow-md shadow-gray-200 flex flex-col justify-center items-center px-10 py-10 rounded-md">
        <div className="text-primary border rounded-full bg-primary/10 px-2 py-2 mb-5">
          <Lock className="size-6" />
        </div>
        <div className="mb-10">
          <h1 className="text-center text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 text-sm">
            Sign in to continue to your account
          </p>
        </div>
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
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

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Loading..." : "Login"}
            </Button>
            <Link href={"/forgot-password"}>
              <div className="text-primary font-semibold text-left text-[12px] leading-tight -mt-2">
                <p>Forgot your password?</p>
              </div>
            </Link>
            <div className="w-full border mt-5 md:border-gray-100 border-gray-200 relative">
              <div className="absolute w-fit md:px-5 text-gray-500 -top-3 left-1/2 -translate-x-1/2 px-3 bg-white text-sm">
                or continue with
              </div>
            </div>
            <div className="flex justify-around items-center gap-3 md:gap-3">
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
              <Link href={"/sign-in"}>
                <Button className="md:px-9 px-3 bg-transparent text-black border border-gray-200 flex justify-center items-center gap-3 hover:bg-primary/10">
                  <img src="/apple.svg" alt="" className="size-4" />
                  <span className="font-semibold">Apple</span>
                </Button>
              </Link>
            </div>
            <p className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <Link href={"/sign-up"}>
                <span className="text-primary font-semibold">Sign up</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
