import SignInForm from "@/components/auth/sign-in-form";

const SignInPage = () => {
  return (
    <div className="min-w-full min-h-screen bg-gray-100 flex justify-center items-center flex-col">
      {" "}
      <SignInForm />{" "}
    </div>
  );
};

export default SignInPage;
