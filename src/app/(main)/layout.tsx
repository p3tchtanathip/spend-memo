"use client";
import Sidebar from "@/components/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Sidebar
        currentPath={pathname}
        onNavigate={(path) => router.push(path)}
        onLogout={() => signOut({ callbackUrl: '/login' })}
      />
      <main style={{ marginLeft: "240px", padding: "36px" }}>
        {children}
      </main>
    </>
  );
}
