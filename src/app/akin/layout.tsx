"use client";
import { AppLayout } from "@/components/layout";
import { MessageCircleMore } from "lucide-react";
import { Suspense } from "react";
import Loading from "../loading";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebarConfig/app-sidebar";

interface IDashboard {
  children: React.ReactNode;
}
const queryClient = new QueryClient()
export default function Akin({ children }: IDashboard) {

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset
          className={`flex px-1 transition-all duration-300`}
        >
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}