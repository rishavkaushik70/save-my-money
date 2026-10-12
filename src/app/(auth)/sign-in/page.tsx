import SignInForm from "@/components/auth/sign-in-form";
import AuthLayout from "@/components/auth/auth-layout";

const SignInPage = () => {
  return (
    <AuthLayout mode="sign-in">
      <SignInForm />
    </AuthLayout>
  );
};

export default SignInPage;
