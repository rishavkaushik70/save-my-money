import { Brain, Handshake, ShieldCheck } from "lucide-react";

const Highlights = () => {
  return (
    <div className="w-full max-w-6xl md:w-6xl mt-10 md:mt-15 flex flex-col sm:flex-row gap-6 md:gap-0 justify-around items-start sm:items-center mx-auto px-6 md:px-0">
      <div className="flex gap-2 items-center">
        <span>
          <ShieldCheck className="text-primary size-9" />
        </span>
        <div className="flex flex-col text-left">
          <span className="font-bold text-sm">Bank-level Security</span>
          <span className="text-gray-500 text-sm">
            Your data is 100% secure
          </span>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <span>
          <Brain className="text-primary size-9" />
        </span>
        <div className="flex flex-col text-left">
          <span className="font-bold text-sm">AI-Powered Insights</span>
          <span className="text-gray-500 text-sm">
            Smarter financial decisions
          </span>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <span>
          <Handshake className="text-primary size-9" />
        </span>
        <div className="flex flex-col text-left">
          <span className="font-bold text-sm">Trusted by 10k+</span>
          <span className="text-gray-500 text-sm">Users worldwide</span>
        </div>
      </div>
    </div>
  );
};

export default Highlights;
