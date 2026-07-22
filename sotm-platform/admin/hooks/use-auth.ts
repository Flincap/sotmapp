"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(token?: string) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function validateToken() {
      try {
        const authToken = token || localStorage.getItem("access_token");
        if (!authToken) {
          setIsAdmin(false);
          router.push("/unauthorized");
          return;
        }
        const response = await fetch(`${API_URL}/auth/validate`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
          throw new Error(`Token validation failed (${response.status})`);
        }
        const data = await response.json();
        setIsAdmin(Boolean(data?.user?.isAdmin));
        setIsSuperAdmin(Boolean(data?.user?.isSuperAdmin));
        if (!data?.user?.isAdmin) {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAdmin(false);
        router.push("/unauthorized");
      } finally {
        setIsLoading(false);
      }
    }

    validateToken();
  }, [router, token]);

  return { isAdmin, isSuperAdmin, isLoading };
}
