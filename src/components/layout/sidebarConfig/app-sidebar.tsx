"use client"

import type * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { APP_CONFIG } from "@/config/app"
import Cookies from "js-cookie";
import { useAuthStore } from "@/utils/zustand-store/authStore";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "OsapiCare",
      plan: "System",
      image: "/avatars/osapicare.png",
    },
  ],
}

// Simulação do papel do usuário (substitua pelo papel dinâmico do sistema)

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const userRole = Cookies.get("akin-role") || "";
  return (
    <Sidebar collapsible="icon" {...props} className="max-w-[200px] bg-akin-turquoise border-r-akin-turquoise">
      <SidebarHeader className="bg-akin-turquoise text-white">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-akin-turquoise text-white" >
        <NavMain items={APP_CONFIG.ROUTES.MENU} userRole={userRole} />
      </SidebarContent>
      <SidebarFooter className="bg-akin-turquoise text-white">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}