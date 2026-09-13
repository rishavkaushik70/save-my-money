import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CircleCheck,
  Sparkles,
  SquareChartGantt,
  Zap,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { RiRobot3Fill } from "react-icons/ri";

const AiFeature = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[40%_60%] w-[92%] sm:w-[90%] md:w-[80%] mx-auto h-auto md:h-100 mb-10 gap-8 md:gap-0">
      <div className="justify-items-start w-full md:w-[90%] flex flex-col gap-5 md:gap-7">
        <Badge className="bg-primary/20 text-primary py-3 px-7 font-bold">
          <Zap className="text-green-500 font-semibold mr-1.5" /> AI-Powered
        </Badge>
        <div className="text-3xl sm:text-4xl font-extrabold">
          <h1>Ask Anything.</h1>
          <h1>Get Smart Answers.</h1>
        </div>
        <div className="w-full sm:w-[80%] md:w-[65%] text-gray-500 font-semibold">
          <p>
            Our AI assistant understands your finances and gives you actionable
            insights.
          </p>
        </div>
        <div className="text-gray-500 font-semibold">
          <ul className="space-y-1.5 text-sm sm:text-base">
            <li>
              <CircleCheck className="inline text-primary/60 mr-2.5" />
              Ask questions in natural language
            </li>
            <li>
              <CircleCheck className="inline text-primary/60 mr-1.5" /> Get
              personalized financial advice
            </li>
            <li>
              <CircleCheck className="inline text-primary/60 mr-1.5" /> Understand
              your spending better
            </li>
            <li>
              <CircleCheck className="inline text-primary/60 mr-2" />
              Smart recommendations to save more
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-primary/5 rounded-md flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-10 py-8 md:py-0 gap-6 md:gap-0">
        <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 shrink-0 rounded-full bg-primary/8 flex items-center justify-center relative">
          <Sparkles className="text-primary/70 absolute top-2 left-20 sm:left-28" />
          <Sparkles className="text-primary/40 absolute -top-3 left-24 sm:left-35" />
          <RiRobot3Fill className="size-16 sm:size-20 md:size-25 text-primary" />
        </div>
        <div className="shadow-md shadow-gray-300 rounded-md bg-white py-4 md:py-0 h-auto md:h-[90%] w-full md:w-[70%] relative flex flex-col justify-between">
          <div className="px-4 sm:px-7 py-2 bg-white shadow-md rounded-md w-fit font-bold text-xs sm:text-sm text-gray-600 mx-auto md:mx-0 md:absolute md:-right-6 md:top-4">
            How can i save ₹5,000 this month?
          </div>
          <div className="rounded-md bg-white h-auto md:h-[70%] mt-4 md:mt-15 ml-2 sm:ml-4 md:ml-10 px-2 sm:px-1 border-l">
            <h1 className="text-xs sm:text-sm font-bold text-gray-600 ml-2 sm:ml-5">
              Based on your spending, here are some suggestions:
            </h1>
            <div className="text-xs sm:text-sm text-gray-500 w-full md:w-[73%] mt-3 sm:mt-5 md:mt-7 font-semibold ml-2 sm:ml-5">
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex gap-2 sm:gap-3">
                  <span>
                    <SquareChartGantt className="size-5 sm:size-7 text-primary shrink-0" />
                  </span>
                  You spent 32% more on dining out. Reducing it by 20% can save
                  you ₹2,300
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span>
                    <SquareChartGantt className="size-5 sm:size-7 text-primary shrink-0" />
                  </span>
                  Cancel unused subscriptions. You can save ₹1,200 monthly
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span>
                    <SquareChartGantt className="size-5 sm:size-7 text-primary shrink-0" />
                  </span>
                  Consider using public transport 2 more times a week. Save
                  around ₹1,000
                </li>
                <li className="flex gap-2 sm:gap-3">
                  <span>
                    <SquareChartGantt className="size-5 sm:size-7 text-primary shrink-0" />
                  </span>
                  Total potential savings: ₹4,500-₹5,000
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-1 mx-3 sm:mx-5 mt-4 md:mt-0 mb-2 md:mb-4">
            <div className="bg-white border rounded-full text-xs sm:text-sm pl-3 py-2 text-gray-400 w-[95%]">
              Ask anything about your finances...
            </div>
            <ArrowRight className="text-white rounded-full bg-primary size-8 py-2 px-2 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiFeature;
