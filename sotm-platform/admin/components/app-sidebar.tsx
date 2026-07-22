"use client";

import { API_URL } from "@/lib/api";
import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GalleryVerticalEnd,
  LibraryBig,
  User,
  LogOut,
  Users,
  Tag,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await fetch(
          // `${API_URL}/auth/validate`,
          `${API_URL}/auth/validate`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsSuperAdmin(data.user.isSuperAdmin || false);
        }
      } catch (error) {
        console.error("Failed to check admin status:", error);
      }
    };

    checkSuperAdmin();
  }, []);

  const data = {
    navMain: [
      {
        title: "Messages",
        url: "/admin/messages",
        icon: GalleryVerticalEnd,
        items: [
          {
            title: "All Messages",
            url: "/admin/messages",
          },
          {
            title: "Upload Message",
            url: "/admin/messages/create",
          },
        ],
      },
      {
        title: "Speakers",
        url: "/admin/messages/speakers",
        icon: User,
      },
      {
        title: "Series",
        url: "/admin/messages/series",
        icon: LibraryBig,
      },
      {
        title: "Categories",
        url: "/admin/messages/categories",
        icon: Tag,
      },
      {
        title: "Admins",
        url: "/admin/admins",
        icon: Users,
        superAdminOnly: true,
        items: [
          {
            title: "All Admins",
            url: "/admin/admins",
          },
          {
            title: "Create Admin",
            url: "/admin/create-admin",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Admin Panel</span>
                  <span className="">GLT Sermons</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map(
              (item) =>
                // Only show superAdminOnly items to super admins
                (!item.superAdminOnly || isSuperAdmin) && (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className="font-medium flex items-center gap-2"
                      >
                        {item.icon && <item.icon className="size-4" />}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={item.url}>{item.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                )
            )}

            {/* Remove the separate Create Admin item since it's now a sub-item */}

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/auth/login"
                  onClick={() => {
                    localStorage.removeItem("access_token");
                  }}
                  className="font-medium flex items-center gap-2"
                >
                  <LogOut className="size-4" />
                  Logout
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
