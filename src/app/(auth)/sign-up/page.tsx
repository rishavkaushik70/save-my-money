import SignUpForm from "@/components/auth/sign-up-form";
import AuthLayout from "@/components/auth/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout mode="sign-up">
      <SignUpForm />
    </AuthLayout>
  );
}
