"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
  userRole,
}: {
  items: {
    label: string;
    icon?: LucideIcon;
    path: string;
    access: string[];
    subItems?: { label: string; path: string; access: string[] }[];
  }[];
  userRole: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu>
        {items
          .filter((item) => item.access.includes(userRole))
          .map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Collapsible
                key={item.label}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.label} className={isActive ? "bg-sidebar-accent text-black rounded-md" : ""}>
                      <Link href={item.path} className="flex items-center size-[20px] ">
                        {item.icon && <item.icon />}
                      </Link>
                      <Link href={item.path} className="flex items-center ">
                        <span>{item.label}</span>
                      </Link>

                      {item.subItems && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 hover:bg-gray-200  hover:rounded-md hover:size-5" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.subItems && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems
                          .filter((subItem) => subItem.access.includes(userRole))
                          .map((subItem) => {
                            const isSubActive = pathname.startsWith(subItem.path);
                            return (
                              <SidebarMenuSubItem key={subItem.label} className={isSubActive ? "bg-sidebar-accent text-black rounded-md": ""}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.path} className={isSubActive ? "text-black": "text-white"}>
                                    <span>{subItem.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
      </SidebarMenu>
    </SidebarGroup>
  );
}