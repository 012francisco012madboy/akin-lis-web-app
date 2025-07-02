"use client"

import * as React from "react"
import {
  ArrowLeft,
  Calendar,
  FileText,
  GraduationCap,
  Home,
  Info,
  Mail,
  Phone,
  Settings,
  User,
  Users,
  ChevronRight,
  BookOpen,
  CreditCard,
  Clock,
  HelpCircle,
} from "lucide-react"

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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Define the menu structure with hierarchical data
const menuData = [
  {
    id: "dashboard",
    title: "Meu Painel",
    icon: Home,
    items: [
      { id: "overview", title: "Visão Geral", icon: Home },
      { id: "recent", title: "Atividades Recentes", icon: Clock },
      { id: "notifications", title: "Notificações", icon: Mail },
    ],
  },
  {
    id: "profile",
    title: "Perfil",
    icon: User,
    items: [
      { id: "personal", title: "Dados Pessoais", icon: User },
      { id: "contact", title: "Contato", icon: Phone },
      { id: "documents", title: "Documentos", icon: FileText },
    ],
  },
  {
    id: "schedule",
    title: "Horário",
    icon: Calendar,
    items: [
      { id: "current", title: "Horário Atual", icon: Calendar },
      { id: "history", title: "Histórico", icon: Clock },
      { id: "conflicts", title: "Conflitos", icon: Info },
    ],
  },
  {
    id: "bulletin",
    title: "Boletim",
    icon: GraduationCap,
    items: [
      { id: "grades", title: "Notas", icon: BookOpen },
      { id: "attendance", title: "Frequência", icon: Users },
      { id: "performance", title: "Desempenho", icon: GraduationCap },
    ],
  },
  {
    id: "curriculum",
    title: "Grelha Curricular",
    icon: BookOpen,
    items: [
      { id: "subjects", title: "Disciplinas", icon: BookOpen },
      { id: "requirements", title: "Pré-requisitos", icon: Info },
      { id: "progress", title: "Progresso", icon: GraduationCap },
    ],
  },
  {
    id: "card",
    title: "Cartão",
    icon: CreditCard,
    items: [
      { id: "student-card", title: "Cartão Estudante", icon: CreditCard },
      { id: "balance", title: "Saldo", icon: Info },
      { id: "transactions", title: "Transações", icon: FileText },
    ],
  },
  {
    id: "calls",
    title: "Convocatórias",
    icon: Mail,
    items: [
      { id: "active", title: "Ativas", icon: Mail },
      { id: "pending", title: "Pendentes", icon: Clock },
      { id: "completed", title: "Concluídas", icon: Info },
    ],
  },
  {
    id: "exams",
    title: "Folhas de prova",
    icon: FileText,
    items: [
      { id: "upcoming", title: "Próximas", icon: Calendar },
      { id: "results", title: "Resultados", icon: GraduationCap },
      { id: "archive", title: "Arquivo", icon: FileText },
    ],
  },
  {
    id: "info",
    title: "Informações",
    icon: Info,
    items: [
      { id: "academic", title: "Acadêmicas", icon: GraduationCap },
      { id: "administrative", title: "Administrativas", icon: Settings },
      { id: "general", title: "Gerais", icon: Info },
    ],
  },
  {
    id: "support",
    title: "Suporte",
    icon: HelpCircle,
    items: [
      { id: "help", title: "Ajuda", icon: HelpCircle },
      { id: "contact-support", title: "Contatar Suporte", icon: Phone },
      { id: "faq", title: "FAQ", icon: Info },
    ],
  },
]

interface HierarchicalSidebarProps {
  className?: string
}

export function HierarchicalSidebar({ className }: HierarchicalSidebarProps) {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<string>("dashboard")

  // Get the currently active menu data
  const activeMenuData = activeMenu ? menuData.find((item) => item.id === activeMenu) : null

  // Reorder menu items to put selected item first
  const reorderedMenuData = React.useMemo(() => {
    const selectedIndex = menuData.findIndex((item) => item.id === selectedItem)
    if (selectedIndex === -1) return menuData

    const selected = menuData[selectedIndex]
    const others = menuData.filter((_, index) => index !== selectedIndex)
    return [selected, ...others]
  }, [selectedItem])

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId)
    setSelectedItem(menuId)
  }

  const handleSubMenuClick = (subItemId: string) => {
    // Handle submenu item selection
    console.log("Selected submenu item:", subItemId)
  }

  const handleBackClick = () => {
    setActiveMenu(null)
  }

  return (
    <Sidebar className={cn("border-r", className)}>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Portal do IPIL</span>
            <span className="text-xs text-muted-foreground">Sistema Acadêmico</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {activeMenu ? (
            // Submenu view
            <>
              <SidebarGroupLabel className="px-6 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackClick}
                  className="h-8 w-full justify-start gap-2 px-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {activeMenuData?.items.map((subItem) => (
                    <SidebarMenuItem key={subItem.id}>
                      <SidebarMenuButton
                        onClick={() => handleSubMenuClick(subItem.id)}
                        className="w-full justify-start gap-3 px-6 py-3 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          ) : (
            // Main menu view
            <SidebarGroupContent>
              <SidebarMenu>
                {reorderedMenuData.map((item, index) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleMenuClick(item.id)}
                      className={cn(
                        "w-full justify-between gap-3 px-6 py-3 hover:bg-orange-50 hover:text-orange-600",
                        selectedItem === item.id &&
                          index === 0 &&
                          "bg-orange-500 text-white hover:bg-orange-600 hover:text-white",
                        selectedItem === item.id && index === 0 && "[&_svg]:text-white",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.items && <ChevronRight className="h-4 w-4" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
