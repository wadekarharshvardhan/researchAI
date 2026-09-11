import Dashboard from "@/components/dashboard/Dashboard";

export const metadata = {
  title: "Analytics | ResearchAI",
  description: "Track your research journey, explore insights, and see your knowledge grow.",
};

export default function AnalyticsPageRoute() {
  return <Dashboard initialView="analytics" />;
}
