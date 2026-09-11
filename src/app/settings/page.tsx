import Dashboard from "@/components/dashboard/Dashboard";

export const metadata = {
  title: "Settings | ResearchAI",
  description: "Customize your ResearchAI experience and manage your preferences.",
};

export default function SettingsPageRoute() {
  return <Dashboard initialView="settings" />;
}
