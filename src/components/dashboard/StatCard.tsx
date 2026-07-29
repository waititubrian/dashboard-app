type StatCardProps = {
  title: string;
  value: number | string;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-lg border p-6 shadow">
      <h2 className="text-gray-500">{title}</h2>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
