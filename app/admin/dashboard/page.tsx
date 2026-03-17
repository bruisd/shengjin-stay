import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabaseServer";

export default async function AdminDashboardPage() {
  const supabase = await createServiceRoleClient();
  const { data: apartments } = await supabase
    .from("apartments")
    .select("id, is_published");

  const total = apartments?.length ?? 0;
  const published = apartments?.filter((a) => a.is_published).length ?? 0;
  const drafts = total - published;

  const stats = [
    { label: "Total Properties", value: total, color: "text-slate-900" },
    { label: "Published", value: published, color: "text-green-600" },
    { label: "Drafts", value: drafts, color: "text-orange-500" },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      {/* Main */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="rounded-admin-lg p-5 border border-slate-200 bg-white">
              <p className="text-slate-500 text-sm font-medium mb-2">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <Link
          href="/admin/properties"
          className="text-admin-primary font-semibold text-sm hover:underline"
        >
          Manage Properties →
        </Link>
      </div>
    </div>
  );
}
