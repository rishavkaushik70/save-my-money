"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const AppearanceSection = () => {
  return (
    <section className="bg-white rounded-xl border p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Appearance</h2>

        <p className="text-sm text-gray-500">
          Choose how SaveMyMoney looks on your device.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Light */}
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 hover:border-primary hover:text-primary"
        >
          <Sun className="size-6" />
          <span>Light</span>
        </Button>

        {/* Dark */}
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 hover:border-primary hover:text-primary"
        >
          <Moon className="size-6" />
          <span>Dark</span>
        </Button>

        {/* System */}
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 hover:border-primary hover:text-primary"
        >
          <Monitor className="size-6" />
          <span>System</span>
        </Button>
      </div>
    </section>
  );
};

export default AppearanceSection;
