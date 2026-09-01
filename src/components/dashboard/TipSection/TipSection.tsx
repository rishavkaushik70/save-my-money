import { CircleAlert, Info } from "lucide-react";

const TipSection = () => {
  return (
    <div className="w-full rounded-md bg-primary/10 flex justify-start items-center gap-2 px-3 py-4 mt-auto">
      <span>
        <Info className="text-primary" />
      </span>
      <div>
        <p className="text-sm text-primary font-semibold">
          Tip: Add your income first to get an accurate picture of your
          finances.
        </p>
      </div>
    </div>
  );
};

export default TipSection;
