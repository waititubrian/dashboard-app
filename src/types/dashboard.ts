export interface DashboardStats {
  users: number;
  activeUsers: number;
  orders: number;
  revenue: number;
  products: number;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}