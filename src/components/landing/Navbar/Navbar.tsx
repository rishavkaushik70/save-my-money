"use client";

import { Button } from "@/components/ui/button";
import { Bot, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="relative">
      <div className="flex justify-between md:justify-around mx-auto pt-3 items-center max-w-[95%] md:max-w-[90%] px-2 md:px-0">
        {/* LOGO */}
        <Link href={"/"} onClick={() => setMobileNavOpen(false)}>
          <div>
            <span className="text-primary text-xl font-bold flex gap-2 items-center">
              <Bot className="size-8 sm:size-10 -rotate-7" /> SaveMyMoney
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS (md and up) */}
        <div className="hidden md:flex">
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

        {/* DESKTOP AUTH BUTTONS (md and up) */}
        <div className="hidden md:flex gap-10 items-center">
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

        {/* MOBILE HAMBURGER BUTTON (< md) */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileNavOpen ? (
              <X className="size-6 text-gray-700" />
            ) : (
              <Menu className="size-6 text-gray-700" />
            )}
          </Button>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE MENU (< md) */}
      {mobileNavOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b shadow-lg z-50 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4 p-6 font-semibold">
            <Link
              href={"#features"}
              onClick={() => setMobileNavOpen(false)}
              className="py-1 text-gray-700 hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href={"#howItWorks"}
              onClick={() => setMobileNavOpen(false)}
              className="py-1 text-gray-700 hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href={"/#pricing"}
              onClick={() => setMobileNavOpen(false)}
              className="py-1 text-gray-700 hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href={"/#testimonial"}
              onClick={() => setMobileNavOpen(false)}
              className="py-1 text-gray-700 hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href={"/"}
              onClick={() => setMobileNavOpen(false)}
              className="py-1 text-gray-700 hover:text-primary transition-colors"
            >
              FAQ
            </Link>

            <div className="flex flex-col gap-3 pt-3 border-t mt-2">
              <Link href={"/sign-in"} onClick={() => setMobileNavOpen(false)}>
                <Button variant="outline" className="w-full font-semibold">
                  Log in
                </Button>
              </Link>
              <Link href={"/sign-up"} onClick={() => setMobileNavOpen(false)}>
                <Button className="w-full font-semibold">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
