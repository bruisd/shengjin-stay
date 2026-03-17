import Link from "next/link";
import PropertyForm from "@/components/admin/PropertyForm";

export default function AdminNewPropertyPage() {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex items-center gap-4 px-8 py-4 border-b border-slate-200">
        <Link
          href="/admin/properties"
          className="text-slate-400 hover:text-slate-900 transition-colors"
          title="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold">Add Property</h1>
      </div>
      <div className="p-8 overflow-y-auto">
        <PropertyForm />
      </div>
    </div>
  );
}
