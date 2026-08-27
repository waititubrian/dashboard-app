import { Card, CardContent } from "@/components/ui/card";

interface RevenueStatsProps {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export default function RevenueStats({
  totalRevenue,
  totalOrders,
  averageOrderValue,
}: RevenueStatsProps) {
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-3">
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">Total Revenue</p>

          <h2 className="mt-2 text-3xl font-bold">
            KSh {totalRevenue.toLocaleString()}
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">Completed Orders</p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalOrders.toLocaleString()}
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">Average Order Value</p>

          <h2 className="mt-2 text-3xl font-bold">
            KSh{" "}
            {averageOrderValue.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}
