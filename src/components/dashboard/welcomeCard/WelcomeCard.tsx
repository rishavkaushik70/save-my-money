import Image from "next/image";
import type { User } from "@/types/auth";
type WelcomeCardProps = {
  user: User;
  progress: number;
};
const WelcomeCard = ({ user, progress }: WelcomeCardProps) => {
  return (
    <main>
      <div className="bg-white rounded-md p-5">
        <div className="flex w-5xl justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">
              Welcome back, {user.name ?? "there"}! 👋
            </h1>
            <p className="text-md text-gray-500 max-w-sm">
              Let's set up your workspace and take control of your finances.
            </p>
            <div className="mt-auto flex flex-col justify-center gap-3 w-full">
              <span className="font-semibold">Setup Progress</span>
              <div className="flex gap-3 justify-center items-center">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-semibold w-40">{progress}% Complete</span>
              </div>
            </div>
          </div>
          <div>
            <Image
              src={"/checklist.svg"}
              height={200}
              width={200}
              alt="Checklist"
            ></Image>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WelcomeCard;
