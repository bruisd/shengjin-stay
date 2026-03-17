import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isLoginPage = pathname === "/admin/login";

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in and not on login page → redirect
  if (!user && !isLoginPage) {
    redirect("/admin/login");
  }

  // Login page or no user → just render children (login form)
  if (!user || isLoginPage) {
    return (
      <html lang="en">
        <body className="font-admin min-h-screen bg-slate-50 text-slate-900">
          {children}
        </body>
      </html>
    );
  }

  // Authenticated → full admin shell
  return (
    <html lang="en">
      <body className="font-admin min-h-screen bg-white text-slate-900">
        <div className="flex h-screen w-full overflow-hidden">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
