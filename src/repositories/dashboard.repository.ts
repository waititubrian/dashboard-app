import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/types/dashboard";

export async function getDashboardStatsFromRepository(): Promise<DashboardStats> {
  const [users, activeUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          active: true,
        },
      }),
      
    ]);

  // const users = totalUses;
  return {
    users,
    activeUsers,
    orders: 0,
    revenue: 0,
    products: 0,
  };
}
