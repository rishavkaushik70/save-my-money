import { Brain, Handshake, ShieldCheck } from "lucide-react";

const LowerHeroSection = () => {
  return (
    <div className="w-6xl mt-15 flex justify-around items-center mx-auto">
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

export default LowerHeroSection;
