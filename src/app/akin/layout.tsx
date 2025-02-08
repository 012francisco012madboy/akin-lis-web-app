"use client";
import { Suspense } from "react";
import Loading from "../loading";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
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
        <SidebarContentWrapper>
          {children}
        </SidebarContentWrapper>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

function SidebarContentWrapper({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();

  return (
    <SidebarInset
      className={`flex px-1 transition-all duration-300 ${state === "expanded" ? "" : ""}`}
    >
      <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger  />
        </div>
      </header>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </SidebarInset>
  );
}