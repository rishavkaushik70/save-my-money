import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CircleCheck,
  Sparkles,
  SquareChartGantt,
  Zap,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { RiRobot3Fill } from "react-icons/ri";

const LowerHtw = () => {
  return (
    <div className="grid grid-cols-[40%_60%] w-7xl mx-auto h-100 mb-10">
      <div className="justify-items-start w-[90%] flex flex-col gap-7">
        <Badge className="bg-primary/20 text-primary py-3 px-7 font-bold">
          {" "}
          <Zap className="text-green-500 font-semibold" /> AI-Powered
        </Badge>
        <div className="text-4xl font-extrabold">
          <h1>Ask Anything.</h1>
          <h1>Get Smart Answers.</h1>
        </div>
        <div className="w-[65%] text-gray-500 font-semibold">
          <p>
            Our AI assistant understands your finances and gives you actionable
            insights.
          </p>
        </div>
        <div className="text-gray-500 font-semibold">
          <ul className="space-y-1.5">
            <li>
              {" "}
              <CircleCheck className="inline text-primary/60 mr-2.5" />
              Ask questions in natural language
            </li>
            <li>
              {" "}
              <CircleCheck className="inline text-primary/60 mr-1.5" /> Get
              personalized financial advice
            </li>
            <li>
              {" "}
              <CircleCheck className="inline text-primary/60 mr-1.5" /> Goal
              Understand your spending better
            </li>
            <li>
              {" "}
              <CircleCheck className="inline text-primary/60 mr-2" />
              Smart recommendations to save more
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-primary/5 rounded-md flex items-center justify-between px-10">
        <div className="w-40 h-40 rounded-full bg-primary/8 flex items-center justify-center relative">
          <Sparkles className="text-primary/70 absolute top-2 left-28" />
          <Sparkles className="text-primary/40 absolute -top-3 left-35" />
          <RiRobot3Fill className="size-25 text-primary" />
        </div>
        <div className="shadow-md shadow-gray-300 rounded-md bg-white h-[90%] w-[70%] relative">
          <div className="px-7 py-2 bg-white shadow-md rounded-md w-fit font-bold text-sm text-gray-600 absolute -right-6">
            How can i save ₹5,000 this month?
          </div>
          <div className=" rounded-md bg-white h-[70%] mt-15 ml-10 px-1 border-l">
            <h1 className="text-sm font-bold text-gray-600 ml-5">
              Based on your spending, here are some suggestions:
            </h1>
            <div className="text-sm text-gray-500 w-[73%] mt-7 font-semibold ml-5">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span>
                    <SquareChartGantt className="size-7 text-primary" />
                  </span>
                  You spent 32% more on dining out. Reducing it by 20% can save
                  you ₹2,300
                </li>
                <li className="flex gap-3">
                  <span>
                    <SquareChartGantt className="size-7 text-primary" />
                  </span>
                  Cancel unused subscriptions. You can save ₹1,200 monthly
                </li>
                <li className="flex gap-3">
                  <span>
                    <SquareChartGantt className="size-7 text-primary" />
                  </span>
                  Consider using public transport 2 more times a week. Save
                  around ₹1,000
                </li>
                <li className="flex gap-3">
                  <span>
                    <SquareChartGantt className="size-7 text-primary" />
                  </span>
                  Total potential savings: ₹4,500-₹5,000
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-1 mx-5">
            <div className=" bg-white border rounded-full text-sm pl-2 py-2 text-gray-400 w-[95%]">
              Ask anything about your finances...
            </div>
            <ArrowRight className="text-white rounded-full bg-primary size-8 py-2 px-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerHtw;
