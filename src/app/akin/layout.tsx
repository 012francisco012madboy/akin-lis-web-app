"use client";
import { Suspense, useState, type ReactNode } from "react";
import Loading from "../loading";
import QueryProvider from "@/config/tanstack-query/queryClientProvider";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ExpandableAppSidebar } from "@/components/layout/sidebarConfig/expandable-app-sidebar";
import { motion } from "framer-motion";
import { MessageCircleMoreIcon } from "lucide-react";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { APP_CONFIG } from "@/config/app";
import { useMemo } from "react";

// Função para gerar breadcrumbs dinamicamente baseado no path
function generateBreadcrumbs(pathname: string) {
  const breadcrumbs = [
    {
      label: "Sistema AKIN",
      href: "/akin/dashboard",
      isCurrentPage: false
    }
  ];

  // Se estamos na raiz do sistema
  if (!pathname || pathname === "/akin" || pathname === "/akin/" || pathname === "/akin/dashboard") {
    breadcrumbs.push({
      label: "Painel",
      href: "/akin/dashboard",
      isCurrentPage: true
    });
    return breadcrumbs;
  }

  // Encontrar o item do menu correspondente ao path atual
  let currentMenuItem = null;
  let currentSubItem = null;

  // Procurar nos itens principais e subitens
  for (const menuItem of APP_CONFIG.ROUTES.MENU) {
    // Verificar se é um item principal
    if (pathname.startsWith(menuItem.path)) {
      currentMenuItem = menuItem;

      // Se tem subitens, procurar o subitem correspondente
      if (menuItem.subItems) {
        for (const subItem of menuItem.subItems) {
          if (pathname.startsWith(subItem.path)) {
            currentSubItem = subItem;
            break;
          }
        }
      }
      break;
    }
  }

  if (currentMenuItem) {
    // Se encontrou um item principal
    if (currentSubItem) {
      // Se está em um subitem
      breadcrumbs.push({
        label: currentMenuItem.label,
        href: currentMenuItem.path,
        isCurrentPage: false
      });
      breadcrumbs.push({
        label: currentSubItem.label,
        href: currentSubItem.path,
        isCurrentPage: true
      });
    } else {
      // Se está no item principal
      breadcrumbs.push({
        label: currentMenuItem.label,
        href: currentMenuItem.path,
        isCurrentPage: true
      });
    }
  } else {
    // Se não encontrou no menu, gerar baseado nos segmentos da URL
    const segments = pathname.split('/').filter(Boolean);
    let currentPath = "";

    for (let i = 1; i < segments.length; i++) { // Começar de 1 para pular 'akin'
      currentPath += `/${segments[i]}`;
      const isLast = i === segments.length - 1;

      const formattedLabel = segments[i]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label: formattedLabel,
        href: `/akin${currentPath}`,
        isCurrentPage: isLast
      });
    }
  }

  return breadcrumbs;
}

interface IDashboard {
  children: ReactNode;
}

export default function Akin({ children }: IDashboard) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryProvider>
      <SidebarProvider>
        <ExpandableAppSidebar />
        <SidebarContentWrapper>{children}</SidebarContentWrapper>

        {/* Floating Chatbot Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-akin-turquoise text-white rounded-full shadow-lg hover:bg-akin-turquoise/80  transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <MessageCircleMoreIcon size={24} />
        </motion.button>
        {/* Chatbot */}
        <Chatbot isChatOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </SidebarProvider>
    </QueryProvider>
  );
}

// Wrapper para o conteúdo principal
function SidebarContentWrapper({ children }: { children: ReactNode }) {
  const { state } = useSidebar();
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    return generateBreadcrumbs(pathname || "");
  }, [pathname]);

  return (
    <SidebarInset className={`flex-1 flex flex-col transition-all duration-300`}>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.href} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                  {breadcrumb.isCurrentPage ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={breadcrumb.href}
                      className="text-akin-turquoise hover:text-akin-turquoise/80"
                    >
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </SidebarInset>
  );
}