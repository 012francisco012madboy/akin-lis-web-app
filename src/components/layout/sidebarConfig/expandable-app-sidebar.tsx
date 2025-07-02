"use client"

import * as React from "react"
import { ArrowLeft, ChevronRight } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Collapsible } from "@/components/ui/collapsible"
import { TeamSwitcher } from "./team-switcher"
import { NavUser } from "./nav-user"
import { APP_CONFIG } from "@/config/app"
import { getAllDataInCookies } from "@/utils/get-data-in-cookies"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { type LucideIcon } from "lucide-react"

// Types
interface SubMenuItem {
  id: string
  title: string
  icon?: LucideIcon
  path: string
  access: string[]
}

interface MenuItem {
  id: string
  title: string
  icon: LucideIcon
  path: string
  access: string[]
  items?: SubMenuItem[]
}

// Transform APP_CONFIG.ROUTES.MENU to expandable format
const transformMenuData = (menuItems: any[], userRole: string): MenuItem[] => {
  return menuItems
    .filter((item) => item.access.includes(userRole))
    .map((item) => ({
      id: item.label.toLowerCase().replace(/\s+/g, '-'),
      title: item.label,
      icon: item.icon,
      path: item.path,
      access: item.access,
      items: item.subItems ? item.subItems
        .filter((subItem: any) => subItem.access.includes(userRole))
        .map((subItem: any) => ({
          id: subItem.label.toLowerCase().replace(/\s+/g, '-'),
          title: subItem.label,
          icon: subItem.icon,
          path: subItem.path,
          access: subItem.access,
        })) : undefined,
    }))
}

const data = {
  teams: [
    {
      name: "OsapiCare",
      plan: "Akin System",
      image: "/avatars/osapicare.png",
    },
  ],
}

interface ExpandableAppSidebarProps extends React.ComponentProps<typeof Sidebar> { }

export function ExpandableAppSidebar({ ...props }: ExpandableAppSidebarProps) {
  const userRole = getAllDataInCookies().userRole
  const pathname = usePathname()
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<string>("")
  const [selectedSubItem, setSelectedSubItem] = React.useState<string | null>(null)

  const menuData = React.useMemo(() =>
    transformMenuData(APP_CONFIG.ROUTES.MENU, userRole),
    [userRole]
  )

  // Auto-select current menu based on pathname
  React.useEffect(() => {
    if (pathname) {
      const currentItem = menuData.find(item =>
        pathname.startsWith(item.path) ||
        (item.items && item.items.some((subItem: SubMenuItem) => pathname.startsWith(subItem.path)))
      )

      if (currentItem) {
        setSelectedItem(currentItem.id)

        // Check if current path is in a submenu
        if (currentItem.items) {
          const currentSubItem = currentItem.items.find((subItem: SubMenuItem) =>
            pathname.startsWith(subItem.path)
          )
          if (currentSubItem) {
            setSelectedSubItem(currentSubItem.id)
          }
        }
      }
    }
  }, [pathname, menuData])

  const handleMenuClick = (menuId: string, hasSubItems: boolean, path: string) => {
    if (hasSubItems) {
      if (expandedMenu === menuId) {
        // If clicking the same menu, collapse it
        setExpandedMenu(null)
        setSelectedSubItem(null)
      } else {
        // Expand the clicked menu
        setExpandedMenu(menuId)
        setSelectedItem(menuId)
        setSelectedSubItem(null)
      }
    } else {
      // For items without subitems, navigate directly
      setSelectedItem(menuId)
      setExpandedMenu(null)
      setSelectedSubItem(null)
    }
  }

  const handleSubMenuClick = (subItemId: string) => {
    setSelectedSubItem(subItemId)
  }

  const handleBackClick = () => {
    setExpandedMenu(null)
    setSelectedSubItem(null)
  }

  const expandedMenuData = expandedMenu ? menuData.find((item) => item.id === expandedMenu) : null

  return (
    <Sidebar collapsible="icon" {...props} className="max-w-[300px] bg-akin-turquoise border-r-akin-turquoise">
      <SidebarHeader className="bg-akin-turquoise text-white">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent className="bg-akin-turquoise text-white">
        {expandedMenu ? (
          // Expanded submenu view
          <div className="flex flex-col">
            {/* Back button */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleBackClick}
                      className="w-full justify-start gap-3 px-6 py-3 bg-akin-turquoise/80 text-white hover:bg-akin-turquoise/60 rounded-md"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Voltar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator className="bg-white/20" />

            {/* Current menu header and subitems */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 py-2 text-white font-semibold">
                <div className="flex items-center gap-2">
                  {expandedMenuData?.icon && <expandedMenuData.icon className="h-4 w-4" />}
                  {expandedMenuData?.title}
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {expandedMenuData?.items?.map((subItem: SubMenuItem) => {
                    const isSubActive = pathname ? pathname.startsWith(subItem.path) : false
                    return (
                      <SidebarMenuItem key={subItem.id}>
                        <SidebarMenuButton
                          asChild
                          onClick={() => handleSubMenuClick(subItem.id)}
                          className={cn(
                            "w-full justify-start gap-3 px-8 py-3 hover:bg-white/10 hover:text-white rounded-md",
                            isSubActive && "bg-sidebar-accent text-black font-medium",
                          )}
                        >
                          <Link href={subItem.path} className="flex items-center gap-3">
                            {subItem.icon && <subItem.icon className="h-4 w-4" />}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ) : (
          // Main menu view
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuData.map((item) => {
                  const isActive = pathname ? pathname.startsWith(item.path) : false
                  const hasSubItems = Boolean(item.items && item.items.length > 0)

                  return (
                    <SidebarMenuItem key={item.id}>
                      <Collapsible>
                        <SidebarMenuButton
                          asChild={!hasSubItems}
                          onClick={() => handleMenuClick(item.id, hasSubItems, item.path)}
                          className={cn(
                            "w-full justify-between gap-3 px-6 py-3 hover:bg-white/10 hover:text-white rounded-md",
                            isActive && "bg-sidebar-accent text-black hover:bg-sidebar-accent hover:text-black",
                          )}
                        >
                          {hasSubItems ? (
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </div>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          ) : (
                            <Link href={item.path} className="flex w-full items-center justify-between">
                              <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </div>
                            </Link>
                          )}
                        </SidebarMenuButton>
                      </Collapsible>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="bg-akin-turquoise text-white">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
