import { FaStar } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

const Testimonials = () => {
  return (
    <div
      id="testimonial"
      className="w-[90%] mt-10 mx-auto grid grid-cols-4 mb-10 gap-3"
    >
      <div className="px-5 flex flex-col gap-3 py-5 w-full shadow-md rounded shadow-gray-300 bg-gray-100">
        <div className="flex gap-1">
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
        </div>
        <div className="font-bold text-gray-500 w-[80%] text-sm">
          "SaveMyMoney helped me save ₹12,000 in just one month! The AI insights
          are game-changer."
        </div>
        <div className="flex items-center gap-2">
          <span className="border rounded-full px-2 py-2 bg-primary/20">
            <FaUserAlt className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold">Ankit Sharma</span>
            <span className="text-gray-500">Freelancer</span>
          </div>
        </div>
      </div>
      <div className="px-5 flex flex-col gap-3 py-5 w-full shadow-md rounded shadow-gray-300 bg-gray-100">
        <div className="flex gap-1">
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
        </div>
        <div className="font-bold text-gray-500 w-[80%] text-sm">
          "The dashboard is beautiful and the AI recommendations are spot on.
          Highly recommended!"
        </div>
        <div className="flex items-center gap-2">
          <span className="border rounded-full px-2 py-2 bg-primary/20">
            <FaUserAlt className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold">Rohit Mehta</span>
            <span className="text-gray-500">Freelancer</span>
          </div>
        </div>
      </div>
      <div className="px-5 flex flex-col gap-3 py-5 w-full shadow-md rounded shadow-gray-300 bg-gray-100">
        <div className="flex gap-1">
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
        </div>
        <div className="font-bold text-gray-500 w-[80%] text-sm">
          "Finally, a finance app that is easy to use and actually helps me
          understand my spending."
        </div>
        <div className="flex items-center gap-2">
          <span className="border rounded-full px-2 py-2 bg-primary/20">
            <FaUserAlt className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold">Priya Verma</span>
            <span className="text-gray-500">Product Manager</span>
          </div>
        </div>
      </div>
      <div className="px-5 flex flex-col gap-3 py-5 w-full shadow-md rounded shadow-gray-300 bg-gray-100">
        <div className="flex gap-1">
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
          <FaStar className="text-yellow-500" />
        </div>
        <div className="font-bold text-gray-500 w-[80%] text-sm">
          "Best investment I made for my personal finance. Total control in my
          hands."
        </div>
        <div className="flex items-center gap-2">
          <span className="border rounded-full px-2 py-2 bg-primary/20">
            <FaUserAlt className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold">Neha Gupta</span>
            <span className="text-gray-500">Entreprenur</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
