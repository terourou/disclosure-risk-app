export default function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-6xl font-bold">{value}</div>
      <div className="text-sm text-gray-800">{label}</div>
    </div>
  );
}
