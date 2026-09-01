import { ArrowRight, Bot } from "lucide-react";
import { FaSquareTwitter } from "react-icons/fa6";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-[95%] mx-auto flex px-20 border rounded-md bg-gray-200/30 border-gray-50">
      <div className="flex flex-col w-[20%] gap-2 py-3">
        <div>
          <span className="text-primary text-sm font-bold flex gap-2 items-center">
            {" "}
            <Bot className="size-10 -rotate-7" /> SaveMyMoney
          </span>
        </div>
        <div className="text-[12px] text-gray-500 font-semibold w-[70%]">
          AI powererd personal finance management for a better future.
        </div>
        <div className="flex gap-3 text-xl w-fit cursor-pointer">
          <FaSquareTwitter className="border py-1 px-1 size-8 rounded-full bg-gray-300" />
          <FaSquareInstagram className="border py-1 px-1 size-8 rounded-full bg-gray-300" />
          <FaGithub className="border py-1 px-1 size-8 rounded-full bg-gray-300" />
          <FaLinkedin className="border py-1 px-1 size-8 rounded-full bg-gray-300" />
        </div>
      </div>
      <div className="flex flex-col w-[20%] py-3">
        <ul>
          <li className="font-bold mb-2">Product</li>
          <li className="text-gray-500 text-sm">Features</li>
          <li className="text-gray-500 text-sm">Pricing</li>
          <li className="text-gray-500 text-sm">Security</li>
          <li className="text-gray-500 text-sm">Changelog</li>
        </ul>
      </div>
      <div className="flex flex-col w-[20%] py-3">
        <ul>
          <li className="font-bold mb-2">Company</li>
          <li className="text-gray-500 text-sm">About us</li>
          <li className="text-gray-500 text-sm">Blog</li>
          <li className="text-gray-500 text-sm">Careers</li>
          <li className="text-gray-500 text-sm">Contact</li>
        </ul>
      </div>
      <div className="flex flex-col w-[20%] py-3">
        <ul>
          <li className="font-bold mb-2">Support</li>
          <li className="text-gray-500 text-sm">Help center</li>
          <li className="text-gray-500 text-sm">Privacy policy</li>
          <li className="text-gray-500 text-sm">Terms of service</li>
          <li className="text-gray-500 text-sm">FAQs</li>
        </ul>
      </div>
      <div className="flex flex-col w-[20%] py-3">
        <p className="font-bold mb-2">Stay Updated</p>
        <p className="text-gray-500 text-sm">
          Get tips on saving money and financial management
        </p>
        <div className="flex items-center justify-center w-full h-fit mt-4 gap-3">
          <input
            type="text"
            className="border rounded-md placeholder:pl-5 placeholder:text-sm h-full w-full"
            placeholder="Enter your email.."
          />
          <button className="cursor-pointer">
            <ArrowRight className="text-white rounded-full bg-primary size-8 py-2 px-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
