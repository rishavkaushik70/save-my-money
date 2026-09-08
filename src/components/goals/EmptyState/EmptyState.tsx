import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center gap-3 bg-white min-h-[calc(100vh-72px)] w-full">
      <div>
        <Image src={"/goals.gif"} height={300} width={500} alt="Goals" />
      </div>
      <div>
        <h1 className="text-4xl font-bold">No goals yet!</h1>
      </div>
      <p className="text-gray-500 text-center">
        Create your first goal and start your journey towards financial freedom
      </p>
      <Button>
        {" "}
        <Plus /> Create Your First Goal
      </Button>
    </div>
  );
};

export default EmptyState;
