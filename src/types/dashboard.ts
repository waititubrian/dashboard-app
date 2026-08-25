export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface RecentOrder {
  id: number;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
}
