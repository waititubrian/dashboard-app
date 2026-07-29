import Dashboard from "@/components/dashboard/Dashboard";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <main className="p-10">
      <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>

      <Dashboard stats={stats} />
    </main>
  );
}
