import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, SquareArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center relative mx-auto w-full max-w-6xl md:w-6xl px-4 md:px-0">
      <Badge className="bg-primary/10 w-fit text-left text-primary text-sm font-bold py-3 px-5 relative md:absolute mb-6 md:mb-0 md:-top-14 md:left-56">
        <Zap className="-rotate-20 text-yellow-500 mr-1.5" />
        AI-Powered Personal Finance
      </Badge>
      <h1 className="max-w-6xl text-4xl sm:text-5xl font-bold md:text-6xl lg:text-8xl">
        Take Control of
      </h1>
      <h1 className="max-w-6xl text-4xl sm:text-5xl font-bold md:text-6xl lg:text-8xl">
        Your <span className="text-primary">Money</span> with AI.
      </h1>
      <p className="mt-6 md:mt-10 text-gray-500 font-semibold w-full sm:w-[85%] md:w-[70%] text-base sm:text-lg md:text-xl">
        Track your income, expenses and financial goals in one beautiful
        dashboard. Get AI-powered insights to save smarter and grow your wealth.
      </p>

      <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-30 w-full sm:w-auto justify-center">
        <Link href={"/sign-up"} className="w-full sm:w-auto">
          <Button
            className={
              "shadow-md shadow-gray-500 border-none font-semibold hover:bg-primary/80 w-full"
            }
          >
            Start Tracking Free <SquareArrowRight className="size-5" />{" "}
          </Button>
        </Link>
        <Link href={"#howItWorks"} className="w-full sm:w-auto">
          <Button variant={"outline"} className={"font-semibold shadow-md w-full sm:w-auto"}>
            View Demo <ArrowRight />{" "}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
