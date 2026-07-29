import { getDashboardStatsFromRepository } from "@/repositories/dashboard.repository";

export async function getDashboardStats() {

    return await getDashboardStatsFromRepository();

}