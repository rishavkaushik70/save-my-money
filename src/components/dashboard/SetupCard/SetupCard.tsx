import { Mail, SquarePlus, Target, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";
import { AddGoalDialog } from "@/components/goals/GoalsDialogbox/Dialogbox";

type RecentTransactionProps = {
  hasTransaction: boolean;
  hasGoals: boolean;
};
const SetupCard = ({ hasTransaction, hasGoals }: RecentTransactionProps) => {
  return (
    <div className="flex flex-col justify-start gap-7 rounded-md bg-white p-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">Complete your setup</h1>
        <p className="text-sm text-gray-500">
          Finish these steps to unlock the full experience
        </p>
      </div>
      <div className="border rounded-md">
        <div className="flex gap-2 px-2 py-3 justify-between border-b items-center">
          <div className="flex gap-3">
            <span className="px-2 py-2 bg-primary/10 text-primary rounded-md flex items-center justify-center">
              <SquarePlus />
            </span>
            <div>
              <h1 className="font-bold">Add your first transaction</h1>
              <p className="text-sm text-gray-500">
                Start by adding your income or expense
              </p>
            </div>
          </div>
          {hasTransaction ? (
            <Button
              disabled
              className="bg-transparent text-primary border border-primary"
            >
              Completed
            </Button>
          ) : (
            <AddTransactionDialog>
              <Button className="bg-transparent text-primary border border-primary hover:text-white">
                Add Now
              </Button>
            </AddTransactionDialog>
          )}
        </div>
        <div className="flex gap-2 px-2 py-3 justify-between border-b items-center">
          <div className="flex gap-3">
            <span className="px-2 py-2 bg-blue-500/20 text-blue-500 rounded-md flex items-center justify-center">
              <Target />
            </span>
            <div>
              <h1 className="font-bold">Create your first goal</h1>
              <p className="text-sm text-gray-500">
                Set a financial goal and stay motivated
              </p>
            </div>
          </div>
          {hasGoals ? (
            <Button
              disabled
              className="bg-transparent text-primary border border-primary"
            >
              Completed
            </Button>
          ) : (
            <AddGoalDialog>
              <Button
                className={
                  "bg-transparent text-primary border border-primary hover:text-white"
                }
              >
                Create Goal
              </Button>
            </AddGoalDialog>
          )}
        </div>
        <div className="flex gap-2 px-2 py-3 justify-between items-center border-b">
          <div className="flex gap-3">
            <span className="px-2 py-2 bg-yellow-400/30 text-yellow-600 border-b rounded-md flex items-center justify-center">
              <User />
            </span>
            <div>
              <h1 className="font-bold">Complete your profile</h1>
              <p className="text-sm text-gray-500">
                Tell us a bit more about yourself
              </p>
            </div>
          </div>
          <Button
            className={
              "bg-transparent text-primary border border-primary hover:text-white"
            }
          >
            Complete
          </Button>
        </div>
        <div className="flex gap-2 px-2 py-3 justify-between items-center">
          <div className="flex gap-3">
            <span className="px-2 py-2 bg-purple-300/40 text-purple-500 rounded-md flex items-center justify-center">
              <Mail />
            </span>
            <div>
              <h1 className="font-bold">Verify your email</h1>
              <p className="text-sm text-gray-500">
                Confirm your email to secure your account
              </p>
            </div>
          </div>
          <Button
            className={
              "bg-transparent text-primary border border-primary hover:text-white"
            }
          >
            Verify Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetupCard;
