import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabaseServer";
import PropertyTable from "@/components/admin/PropertyTable";

export default async function AdminPropertiesPage() {
  const supabase = await createServiceRoleClient();
  const { data: apartments } = await supabase
    .from("apartments")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
        <h1 className="text-xl font-bold">Properties</h1>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 bg-admin-primary text-white text-sm font-bold rounded-admin-lg px-4 py-2 hover:bg-admin-primary/90 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Property
        </Link>
      </div>

      <div className="p-8">
        <PropertyTable apartments={apartments ?? []} />
      </div>
    </div>
  );
}
