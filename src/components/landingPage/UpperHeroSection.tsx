import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, SquareArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const UpperHeroSection = () => {
  return (
    <div className="flex flex-col items-center relative mx-auto w-6xl">
      <Badge className="bg-primary/10 w-fit text-left text-primary text-sm font-bold py-3 px-5 absolute -top-14 left-56">
        {" "}
        <Zap className="-rotate-20 text-yellow-500" />
        AI-Powered Personal Finance
      </Badge>
      <h1 className="max-w-6xl text-5xl font-bold md:text-6xl lg:text-8xl">
        Take Control of
      </h1>
      <h1 className="max-w-6xl text-5xl font-bold md:text-6xl lg:text-8xl">
        Your <span className="text-primary">Money</span> with AI.
      </h1>
      <p className="mt-10 text-gray-500 font-semibold w-[70%] text-xl">
        Track your income, expenses and financial goals in one beautiful
        dashboard. Get AI-powered insights to save smarter and grow your wealth.
      </p>

      <div className="mt-10 flex gap-30">
        <Link href={"/"}>
          <Button
            className={
              "shadow-md shadow-gray-500 border-none font-semibold hover:bg-primary/80 w-full"
            }
          >
            Start Tracking Free <SquareArrowRight className="size-5" />{" "}
          </Button>
        </Link>
        <Link href={"/"}>
          <Button
            variant={"ghost"}
            className={"shadow-md shadow-gray-500 font-semibold border-none"}
          >
            View Demo <ArrowRight />{" "}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UpperHeroSection;
