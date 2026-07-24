import { CircleCheck } from "lucide-react";
import { Button } from "../ui/button";

const Transactions = () => {
  return (
    <div id="pricing" className="w-6xl mx-auto">
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl font-bold ">Simple, Transparent Pricing</h1>
        <p className="text-sm font-semibold text-gray-600">
          Choose the plan that works for you
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 items-stretch">
        <div className="border shadow-md shadow-gray-200 pt-5 pb-3 rounded-md px-7 flex flex-col h-full hover:scale-102 transition-all">
          <h2 className="font-extrabold text-2xl mb-3">Free</h2>
          <div>
            {" "}
            <span className="text-3xl text-gray-600">₹ </span>
            <span className="text-3xl font-bold">0 </span>
            <span className="text-gray-500 font-semibold">/month</span>
          </div>
          <p className="font-bold text-gray-700 mb-3 text-sm mt-1">
            Perfect for getting started
          </p>
          <div className="text-gray-500 font-semibold text-sm">
            <ul className="space-y-1.5 font-bold">
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" />
                Track income & expenses
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" /> Basic reports
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" />1 financial
                goal
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" /> Up to 2 bank
                accounts
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <Button className="bg-white text-primary border-primary/30 border-2 w-full font-semibold mt-10 hover:bg-primary hover:text-white hover:border-none transition-all">
              Get started
            </Button>
          </div>
        </div>
        <div className="border-primary border-2 shadow-md shadow-gray-200 pt-5 pb-3 rounded-md px-7 flex flex-col relative hover:scale-102 transition-all">
          <div className="rounded-full w-fit py-1 px-10 text-white bg-primary text-sm font-bold absolute -top-4 left-24">
            Most popular
          </div>
          <h2 className="font-semibold text-2xl mb-3 text-primary">Pro</h2>
          <div>
            <span className="text-3xl text-gray-600">₹ </span>
            <span className="text-3xl font-bold text-primary">499 </span>
            <span className="text-gray-500 font-semibold">/month</span>
          </div>
          <p className="font-bold text-gray-700 mb-3 text-sm mt-1">
            For individual who want more
          </p>
          <div className=" font-semibold text-sm">
            <ul className="space-y-1.5 font-bold">
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" />
                Everything in free
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" /> AI finacial
                Advisor
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" />
                Unlimited goal
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" /> Subscription
                tracking
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" /> Advanced
                analytics
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" /> Priority
                support
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <Button className="bg-primary text-white w-full font-semibold hover:bg-primary hover:text-white hover:border-none transition-all mt-3">
              Start Free Trial
            </Button>
          </div>
        </div>
        <div className="border shadow-md shadow-gray-200 pt-5 pb-3 rounded-md px-7 flex flex-col hover:scale-102 transition-all">
          <h2 className="font-extrabold text-2xl mb-3">Premium</h2>
          <div>
            <span className="text-3xl text-gray-600">₹ </span>
            <span className="text-3xl font-bold">999 </span>
            <span className="text-gray-500 font-semibold">/month</span>
          </div>
          <p className="font-bold text-gray-700 mb-3 text-sm mt-1">
            For power users
          </p>
          <div className="text-gray-500 font-semibold text-sm">
            <ul className="space-y-1.5 font-bold">
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" />
                Everything in Pro
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" /> Investment
                tracking
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" />
                Custom categories
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" /> Export
                reports
              </li>
              <li className="flex gap-3">
                {" "}
                <CircleCheck className="inline text-primary/60" /> Dedicated
                support
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <Button className="bg-white text-primary border-primary/30 border-2 w-full font-semibold mt-10 hover:bg-primary hover:text-white hover:border-none transition-all">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
