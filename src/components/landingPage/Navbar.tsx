import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-around mx-auto mt-3 items-center max-w-[90%]">
      <Link href={"/"}>
        <div>
          <span className="text-primary text-xl font-bold flex gap-2 items-center">
            {" "}
            <Bot className="size-10 -rotate-7" /> SaveMyMoney
          </span>
        </div>
      </Link>
      <div>
        <ul className="flex gap-10 items-center font-semibold">
          <Link href={"#features"}>
            <li>Features</li>
          </Link>
          <Link href={"#howItWorks"}>
            <li>How It Works</li>
          </Link>
          <Link href={"/#pricing"}>
            <li>Pricing</li>
          </Link>
          <Link href={"/#testimonial"}>
            <li>Testimonials</li>
          </Link>
          <Link href={"/"}>
            <li>FAQ</li>
          </Link>
        </ul>
      </div>
      <div className="flex gap-10 items-center">
        <Link
          href={"/sign-in"}
          className="font-semibold hover:scale-104 transition-all"
        >
          Log in
        </Link>
        <Link href={"/sign-up"}>
          <Button className={"w-35"}>Get Started Free</Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
