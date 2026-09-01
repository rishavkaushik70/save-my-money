import {
  Brain,
  ChartCandlestick,
  ChartNoAxesColumn,
  CreditCard,
  ShieldCheck,
  Target,
} from "lucide-react";

const FeaturesCard = () => {
  return (
    <div className="w-7xl grid grid-cols-6 gap-5 mt-3 mx-auto">
      <div className="max-w-50 flex flex-col justify-center items-center gap-3 py-5 bg-white shadow-md border-gray-100 rounded-md shadow-gray-300 border">
        <span className="border px-3 py-3 rounded-md  bg-primary/10">
          <ChartNoAxesColumn className="text-primary" />
        </span>
        <h1 className="font-bold">Smart Analytics</h1>
        <p className="text-gray-500 text-sm mx-4">
          Visualise your spending patterns with beautiful dashboard and charts
        </p>
      </div>
      <div className="max-w-50 flex flex-col justify-center items-center gap-3 py-5 bg-white shadow-md border-gray-100 rounded-md shadow-gray-300 border">
        <span className="border px-3 py-3 rounded-md  bg-primary/10">
          <Brain className="text-primary" />
        </span>
        <h1 className="font-bold">AI Financial Advisor</h1>
        <p className="text-gray-500 text-sm mx-4">
          Get personalized tips and recommendations powered by AI.
        </p>
      </div>
      <div className="max-w-50 flex flex-col justify-center items-center gap-3 py-5 bg-white shadow-md border-gray-100 rounded-md shadow-gray-300 border">
        <span className="border px-3 py-3 rounded-md  bg-primary/10">
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
        </span>
        <h1 className="font-bold">Budget Planning</h1>
        <p className="text-gray-500 text-sm mx-2">
          Set budgets, tracks limits and stay on the top of your financial
          goals.
        </p>
      </div>
      <div className="max-w-50 flex flex-col justify-center items-center gap-3 py-5 bg-white shadow-md border-gray-100 rounded-md shadow-gray-300 border">
        <span className="border px-3 py-3 rounded-md  bg-primary/10">
          <CreditCard className="text-primary" />
        </span>
        <h1 className="font-bold">Subscription Tracker</h1>
        <p className="text-gray-500 text-sm mx-5">
          Track all your subcriptions and never miss a payment.
        </p>
      </div>
      <div className="max-w-50 flex flex-col justify-center items-center gap-3 py-5 bg-white shadow-md border-gray-100 rounded-md shadow-gray-300 border">
        <span className="border px-3 py-3 rounded-md  bg-primary/10">
          <ChartCandlestick className="text-primary" />
        </span>
        <h1 className="font-bold">Investment Insights</h1>
        <p className="text-gray-500 text-sm">
          Monitor your investments and get smart insights to grow wealth.
        </p>
      </div>
      <div className="max-w-50 flex flex-col justify-center items-center gap-3 py-5 bg-white shadow-md border-gray-100 rounded-md shadow-gray-300 border">
        <span className="border px-3 py-3 rounded-md  bg-primary/10">
          <ShieldCheck className="text-primary" />
        </span>
        <h1 className="font-bold">Secure & Private</h1>
        <p className="text-gray-500 text-sm mx-4">
          Bank-level security ensures your data is always protected.
        </p>
      </div>
    </div>
  );
};

export default FeaturesCard;
