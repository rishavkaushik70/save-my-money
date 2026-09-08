import type { User } from "@/types/auth";
import ProfileSection from "./Profile/ProfileSection";
import PreferencesSection from "./Preference/PreferencesSection";
import AppearanceSection from "./Appearance/AppearanceSection";
import SecuritySection from "./Security/SecuritySection";
import DangerZone from "./DangerZone/DangerZone";

interface SettingsPageProps {
  user: User;
}

const SettingsPage = ({ user }: SettingsPageProps) => {
  return (
    <main className="w-full bg-gray-100 min-h-[calc(100vh-68px)] px-4 md:px-10 py-6 md:py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your account, preferences and security.
          </p>
        </div>

        <ProfileSection user={user} />

        <PreferencesSection />

        <AppearanceSection />

        <SecuritySection />

        <DangerZone />
      </div>
    </main>
  );
};

export default SettingsPage;
