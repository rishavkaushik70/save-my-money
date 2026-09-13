import Image from "next/image";
import type { User } from "@/types/auth";
type WelcomeCardProps = {
  user: User;
  progress: number;
};
const WelcomeCard = ({ user, progress }: WelcomeCardProps) => {
  return (
    <div>
      <div className="bg-white rounded-md p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row w-full md:w-5xl justify-between gap-6 md:gap-0">
          <div className="flex flex-col gap-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome back, {user.name ?? "there"}! 👋
            </h1>
            <p className="text-sm sm:text-md text-gray-500 max-w-sm">
              Let&apos;s set up your workspace and take control of your finances.
            </p>
            <div className="mt-4 md:mt-auto flex flex-col justify-center gap-2 sm:gap-3 w-full">
              <span className="font-semibold text-sm sm:text-base">Setup Progress</span>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-semibold text-sm whitespace-nowrap">{progress}% Complete</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block shrink-0 self-center">
            <Image
              src={"/checklist.svg"}
              height={200}
              width={200}
              alt="Checklist"
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
