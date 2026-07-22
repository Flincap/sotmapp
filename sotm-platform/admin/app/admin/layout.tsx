"use client";

import { API_URL } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminBreadcrumbs } from "@/components/admin/breadcrumbs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Use a ref to track if we've already redirected
  const hasRedirected = React.useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function validateToken() {
      if (hasRedirected.current) return;

      try {
        const authToken = localStorage.getItem("access_token");
        if (!authToken) {
          if (isMounted) {
            setIsAdmin(false);
            setIsLoading(false);
          }

          if (!hasRedirected.current) {
            hasRedirected.current = true;
            router.push("/unauthorized");
          }
          return;
        }

        const response = await fetch(
          // `${API_URL}/auth/validate`,
          `${API_URL}/auth/validate`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setIsAdmin(data.user.isAdmin || false);
            setIsLoading(false);
          }

          if (!data.user.isAdmin && !hasRedirected.current) {
            hasRedirected.current = true;
            router.push("/unauthorized");
          }
        } else {
          // Token is invalid or expired - remove it from localStorage
          localStorage.removeItem("access_token");

          if (isMounted) {
            setIsAdmin(false);
            setIsLoading(false);
          }

          if (!hasRedirected.current) {
            hasRedirected.current = true;
            router.push("/unauthorized");
          }
        }
      } catch (error) {
        // On error, also remove the token as it might be invalid
        localStorage.removeItem("access_token");

        console.error("Auth check failed:", error);
        if (isMounted) {
          setIsAdmin(false);
          setIsLoading(false);
        }

        if (!hasRedirected.current) {
          hasRedirected.current = true;
          router.push("/unauthorized");
        }
      }
    }

    validateToken();

    return () => {
      isMounted = false;
    };
  }, [router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not admin, render a placeholder while redirect happens
  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Redirecting page...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white z-10">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <AdminBreadcrumbs />
            </div>
          </header>
          <main className="flex-1 p-6 bg-white overflow-hidden">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
