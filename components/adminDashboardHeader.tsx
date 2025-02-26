export default function AdminDashboardHeader({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b pb-2 flex justify-between items-center mb-6">
      <h1 className="text-2xl">{text}</h1>
      <div>{children}</div>
    </div>
  );
}
