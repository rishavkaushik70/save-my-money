"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, CalendarDays, IndianRupee } from "lucide-react";

const PreferencesSection = () => {
  return (
    <section className="bg-white rounded-xl border p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Preferences</h2>

        <p className="text-sm text-gray-500">
          Customize how SaveMyMoney works for you.
        </p>
      </div>

      <div className="divide-y">
        {/* Currency */}
        <div className="flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-4">
            <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <IndianRupee className="size-5 text-primary" />
            </div>

            <div>
              <p className="font-medium">Currency</p>

              <p className="text-sm text-gray-500">
                Choose your preferred currency.
              </p>
            </div>
          </div>

          <Button variant="outline">INR (₹)</Button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-4">
            <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="size-5 text-primary" />
            </div>

            <div>
              <p className="font-medium">Notifications</p>

              <p className="text-sm text-gray-500">
                Receive reminders and financial updates.
              </p>
            </div>
          </div>

          <Switch defaultChecked />
        </div>

        {/* Goal Reminders */}
        <div className="flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-4">
            <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarDays className="size-5 text-primary" />
            </div>

            <div>
              <p className="font-medium">Goal Reminders</p>

              <p className="text-sm text-gray-500">
                Get reminders about upcoming goals.
              </p>
            </div>
          </div>

          <Switch defaultChecked />
        </div>
      </div>
    </section>
  );
};

export default PreferencesSection;
