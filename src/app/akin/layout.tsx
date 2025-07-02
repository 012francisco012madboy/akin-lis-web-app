"use client";
import { Suspense, useState } from "react";
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

interface IDashboard {
  children: React.ReactNode;
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
function SidebarContentWrapper({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();

  return (
    <SidebarInset className={`flex px-1 transition-all duration-300 ${state === "expanded" ? "" : ""}`}>
      <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
      </header>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </SidebarInset>
  );
}