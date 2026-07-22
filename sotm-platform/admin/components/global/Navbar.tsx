"use client";

import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="">
      <div className="flex justify-between items-center py-6 px-4 lg:px-0 mx-auto lg:max-w-7xl">
        <Link href={"#"} className="text-2xl font-bold">
          <Image width={88} height={36} src="/SOTM-logo.png" alt="SOTM Logo" />
        </Link>
        <div className="hidden mx-auto">
          <ul className="flex gap-16">
            <li>
              <Link href={"#"}>Home</Link>
            </li>
            <li>
              <Link href={"#"}>Messages</Link>
            </li>
            <li>
              <Link href={"#"}>Resources</Link>
            </li>
          </ul>
        </div>
        <Button className="hidden">Contact Us</Button>
        <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger>
            <Menu className="hidden" />
          </DrawerTrigger>
          <DrawerContent>
            <p>Home</p>
            <p>Messages</p>
            <p>Resources</p>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
