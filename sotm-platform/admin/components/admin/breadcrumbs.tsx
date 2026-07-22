"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNameMap: Record<string, string> = {
  admin: "Admin",
  messages: "Messages",
  create: "Create Message",
  edit: "Edit Message",
  speakers: "Speakers",
  admins: "Admins",
  createAdmin: "Create Admin",
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);

  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const name = routeNameMap[segment] || segment;

          const href =
            segment === "edit"
              ? "/admin/messages"
              : `/${segments.slice(0, index + 1).join("/")}`;

          if (isLast) {
            return (
              <BreadcrumbItem key={segment}>
                <BreadcrumbLink
                  href={href}
                  onClick={(e) => handleClick(href, e)}
                >
                  {name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          }

          return (
            <React.Fragment key={segment}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={href}
                  onClick={(e) => handleClick(href, e)}
                >
                  {name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
