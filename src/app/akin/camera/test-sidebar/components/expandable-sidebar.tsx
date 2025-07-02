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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Collapsible } from "@/components/ui/collapsible"

// Define the menu structure with hierarchical data
const menuData = [
  {
    id: "dashboard",
    title: "Meu Painel",
    icon: Home,
    items: [
      { id: "overview", title: "Visão Geral", icon: Home, url: "/dashboard/overview" },
      { id: "recent", title: "Atividades Recentes", icon: Clock, url: "/dashboard/recent" },
      { id: "notifications", title: "Notificações", icon: Mail, url: "/dashboard/notifications" },
      { id: "analytics", title: "Análises", icon: Info, url: "/dashboard/analytics" },
    ],
  },
  {
    id: "profile",
    title: "Perfil",
    icon: User,
    items: [
      { id: "personal", title: "Dados Pessoais", icon: User, url: "/profile/personal" },
      { id: "contact", title: "Informações de Contato", icon: Phone, url: "/profile/contact" },
      { id: "documents", title: "Documentos", icon: FileText, url: "/profile/documents" },
      { id: "security", title: "Segurança", icon: Settings, url: "/profile/security" },
    ],
  },
  {
    id: "schedule",
    title: "Horário",
    icon: Calendar,
    items: [
      { id: "current", title: "Horário Atual", icon: Calendar, url: "/schedule/current" },
      { id: "history", title: "Histórico de Horários", icon: Clock, url: "/schedule/history" },
      { id: "conflicts", title: "Conflitos", icon: Info, url: "/schedule/conflicts" },
      { id: "planning", title: "Planejamento", icon: Settings, url: "/schedule/planning" },
    ],
  },
  {
    id: "bulletin",
    title: "Boletim",
    icon: GraduationCap,
    items: [
      { id: "grades", title: "Notas por Disciplina", icon: BookOpen, url: "/bulletin/grades" },
      { id: "attendance", title: "Frequência", icon: Users, url: "/bulletin/attendance" },
      { id: "performance", title: "Desempenho Geral", icon: GraduationCap, url: "/bulletin/performance" },
      { id: "reports", title: "Relatórios", icon: FileText, url: "/bulletin/reports" },
    ],
  },
  {
    id: "curriculum",
    title: "Grelha Curricular",
    icon: BookOpen,
    items: [
      { id: "subjects", title: "Disciplinas Obrigatórias", icon: BookOpen, url: "/curriculum/subjects" },
      { id: "electives", title: "Disciplinas Optativas", icon: Settings, url: "/curriculum/electives" },
      { id: "requirements", title: "Pré-requisitos", icon: Info, url: "/curriculum/requirements" },
      { id: "progress", title: "Progresso Curricular", icon: GraduationCap, url: "/curriculum/progress" },
    ],
  },
  {
    id: "card",
    title: "Cartão",
    icon: CreditCard,
    items: [
      { id: "student-card", title: "Cartão do Estudante", icon: CreditCard, url: "/card/student" },
      { id: "balance", title: "Consultar Saldo", icon: Info, url: "/card/balance" },
      { id: "transactions", title: "Histórico de Transações", icon: FileText, url: "/card/transactions" },
      { id: "recharge", title: "Recarregar Cartão", icon: Settings, url: "/card/recharge" },
    ],
  },
  {
    id: "calls",
    title: "Convocatórias",
    icon: Mail,
    items: [
      { id: "active", title: "Convocatórias Ativas", icon: Mail, url: "/calls/active" },
      { id: "pending", title: "Pendentes de Resposta", icon: Clock, url: "/calls/pending" },
      { id: "completed", title: "Respondidas", icon: Info, url: "/calls/completed" },
      { id: "archive", title: "Arquivo", icon: FileText, url: "/calls/archive" },
    ],
  },
  {
    id: "exams",
    title: "Folhas de Prova",
    icon: FileText,
    items: [
      { id: "upcoming", title: "Próximas Avaliações", icon: Calendar, url: "/exams/upcoming" },
      { id: "results", title: "Resultados", icon: GraduationCap, url: "/exams/results" },
      { id: "schedule", title: "Calendário de Provas", icon: Clock, url: "/exams/schedule" },
      { id: "archive", title: "Arquivo de Provas", icon: FileText, url: "/exams/archive" },
    ],
  },
  {
    id: "info",
    title: "Informações",
    icon: Info,
    items: [
      { id: "academic", title: "Informações Acadêmicas", icon: GraduationCap, url: "/info/academic" },
      { id: "administrative", title: "Procedimentos Administrativos", icon: Settings, url: "/info/administrative" },
      { id: "general", title: "Informações Gerais", icon: Info, url: "/info/general" },
      { id: "news", title: "Notícias e Avisos", icon: Mail, url: "/info/news" },
    ],
  },
  {
    id: "support",
    title: "Suporte",
    icon: HelpCircle,
    items: [
      { id: "help", title: "Central de Ajuda", icon: HelpCircle, url: "/support/help" },
      { id: "contact-support", title: "Contatar Suporte", icon: Phone, url: "/support/contact" },
      { id: "faq", title: "Perguntas Frequentes", icon: Info, url: "/support/faq" },
      { id: "tutorials", title: "Tutoriais", icon: BookOpen, url: "/support/tutorials" },
    ],
  },
]

interface ExpandableSidebarProps {
  className?: string
}

export function ExpandableSidebar({ className }: ExpandableSidebarProps) {
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<string>("dashboard")
  const [selectedSubItem, setSelectedSubItem] = React.useState<string | null>(null)

  const handleMenuClick = (menuId: string) => {
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
  }

  const handleSubMenuClick = (subItemId: string, url: string) => {
    setSelectedSubItem(subItemId)
    console.log("Navigating to:", url)
    // Here you would typically handle navigation
  }

  const handleBackClick = () => {
    setExpandedMenu(null)
    setSelectedSubItem(null)
  }

  const expandedMenuData = expandedMenu ? menuData.find((item) => item.id === expandedMenu) : null

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
        {expandedMenu ? (
          // Expanded submenu view
          <div className="flex flex-col">
            {/* Selected menu item at top */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleBackClick}
                      className="w-full justify-start gap-3 px-6 py-3 bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Voltar para Menu Principal</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Current menu header */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 py-2 text-orange-600 font-semibold">
                <div className="flex items-center gap-2">
                  {expandedMenuData?.icon && <expandedMenuData.icon className="h-4 w-4" />}
                  {expandedMenuData?.title}
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {expandedMenuData?.items.map((subItem) => (
                    <SidebarMenuItem key={subItem.id}>
                      <SidebarMenuButton
                        onClick={() => handleSubMenuClick(subItem.id, subItem.url)}
                        className={cn(
                          "w-full justify-start gap-3 px-8 py-3 hover:bg-orange-50 hover:text-orange-600",
                          selectedSubItem === subItem.id && "bg-orange-100 text-orange-700 font-medium",
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ) : (
          // Main menu view
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuData.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <Collapsible>
                      <SidebarMenuButton
                        onClick={() => handleMenuClick(item.id)}
                        className={cn(
                          "w-full justify-between gap-3 px-6 py-3 hover:bg-orange-50 hover:text-orange-600",
                          selectedItem === item.id && "bg-orange-500 text-white hover:bg-orange-600 hover:text-white",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </SidebarMenuButton>
                    </Collapsible>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
