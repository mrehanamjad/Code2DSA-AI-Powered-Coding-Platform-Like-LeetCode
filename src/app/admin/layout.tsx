import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { requireAdminAuth } from "@/lib/require-auth";
import Script from "next/script";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminAuth();

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="pl-64 transition-all duration-300">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </>
  );
}
