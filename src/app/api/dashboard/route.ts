import { getDashboardStats } from "@/services/dashboard.service";

export async function GET() {
    const stats = await getDashboardStats();

    return Response.json({
        success: true,
        data: stats,
    });
}
