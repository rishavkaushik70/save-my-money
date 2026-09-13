import Image from "next/image";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";

const EmptyCard = () => {
  return (
    <div className="h-full bg-white flex justify-center items-center rounded-md flex-col gap-3 p-6">
      <div>
        <Image src={"/sorry.svg"} height={200} width={200} alt="Sorry Gif" />
      </div>
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-2xl font-bold text-center">Nothing to show yet</h1>
        <p className="text-gray-500 w-full max-w-sm px-2 text-center text-sm">
          Add your first transaction to see your balance, reports, and insight
          here
        </p>
      </div>
      <AddTransactionDialog>
        <Button className={"text-white"}>
          <Plus /> Add transaction
        </Button>
      </AddTransactionDialog>
    </div>
  );
};

export default EmptyCard;
