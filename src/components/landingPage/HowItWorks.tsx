import Image from "next/image";
import { Badge } from "../ui/badge";
import { ArrowRight, CircleCheck, HandFist } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LowerHtw from "./LowerHtw";

const HowItWorks = () => {
  return (
    <div id="howItWorks">
      <div className="w-[80%] mx-auto grid grid-cols-2 px-7 py-5 bg-primary/5 mb-10 rounded-md justify-">
        <div>
          <Image
            src="/Dashboard 2.png"
            alt="Dashboard Preview"
            height={1200}
            width={800}
            className="shadow-md shadow-gray-300 rounded-md"
          ></Image>
        </div>
        <div className="ml-15 flex flex-col items-start gap-5">
          <span className="mt-3">
            <Badge className="bg-primary/9 text-primary px-3 font-bold">
              <HandFist />
              Powerful Dashboard
            </Badge>
          </span>
          <div className="">
            <h1 className="text-4xl font-extrabold">All Your Finances.</h1>
            <h1 className="text-4xl font-extrabold">
              One Beautiful Dashboard.
            </h1>
          </div>
          <div className="text-gray-500 font-semibold w-[70%]">
            <p>Get a complete overview of your financial health.</p>
            <p>Track income, expenses, budget, goals and more in real time.</p>
          </div>
          <div className="text-gray-500 font-semibold">
            <ul className="space-y-1.5">
              <li>
                {" "}
                <CircleCheck className="inline text-primary/60 mr-2.5" />
                Real-time transaction tracking.
              </li>
              <li>
                {" "}
                <CircleCheck className="inline text-primary/60 mr-2" />{" "}
                Interactive charts and reports.
              </li>
              <li>
                {" "}
                <CircleCheck className="inline text-primary/60 mr-2" /> Goal
                progress and budget alerts
              </li>
              <li>
                {" "}
                <CircleCheck className="inline text-primary/60 mr-2" /> Export
                data anytime
              </li>
            </ul>
          </div>
          <Link href={"/"}>
            <Button
              className={
                "mt-3 shadow-md shadow-gray-500 border-none font-semibold hover:bg-primary/80 w-full"
              }
            >
              Explore Dashboard <ArrowRight className="size-5" />{" "}
            </Button>
          </Link>
        </div>
      </div>
      <LowerHtw />
    </div>
  );
};

export default HowItWorks;
