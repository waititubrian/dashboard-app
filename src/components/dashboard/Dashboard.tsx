"use client";

import { useState } from "react";
import StatCard from "./StatCard";
import { DashboardStats } from "@/types/dashboard";

type DashboardProps = {
  stats: DashboardStats;
};

export default function Dashboard({ stats }: DashboardProps) {
  const [users, setUsers] = useState(stats.users);

  return (
    <div>
      <div className="grid grid-cols-5 gap-6">
        <StatCard title="Users" value={users} />

        <StatCard title="Active Users" value={stats.activeUsers} />

        <StatCard title="Orders" value={stats.orders} />

        <StatCard title="Revenue" value={`Ksh ${stats.revenue}`} />

        <StatCard title="Products" value={stats.products} />
      </div>

      <button
        onClick={() => setUsers(users + 1)}
        className="mt-8 rounded bg-blue-600 px-6 py-3 text-white"
      >
        Increase Users
      </button>
    </div>
  );
}
