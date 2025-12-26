type Props = {
  title: string;
  value: string;
};

export default function DashboardCard({ title, value }: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm text-gray-500">
        {title}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </h2>
    </div>
  );
}
