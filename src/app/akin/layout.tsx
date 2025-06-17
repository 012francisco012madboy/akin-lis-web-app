"use client";
import { Suspense, useState } from "react";
import Loading from "../loading";
import { QueryClient, QueryClientProvider, useMutation,useQuery } from "@tanstack/react-query";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebarConfig/app-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleMoreIcon, XIcon } from "lucide-react";
import { iaAgentRoutes } from "@/services/Routes/IA_Agent/index.routes";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { _axios } from "@/lib/axios";

interface IDashboard {
  children: React.ReactNode;
}

export interface UserData {
  nome: string,
  email: string,
  senha: string,
  tipo: string,
  status: string
}

const queryClient = new QueryClient();

export default function Akin({ children }: IDashboard) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
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
    </QueryClientProvider>
  );
}

// Componente do Chatbot
function Chatbot({ isChatOpen, onClose }: { isChatOpen: boolean; onClose: () => void }) {
    const { user,token } = useAuthStore()
  const [input, setInput] = useState("");
  const [resposta, setResposta] = useState("");

    const { data, isPending } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      return await _axios.get<UserData>(`/users/${user?.id}`);
    }
  });

  const mutation = useMutation({
    mutationFn: async (texto: string) => {
      
      return iaAgentRoutes.sendMessageToAgent({
        message: texto,
        user_id: user?.id, 
        session_id: token, 
        email: data.email, 
        senha: data.senha, 
      });
    },
    onSuccess: (data) => {
      setResposta(data.resposta || "Sem nenhuma resposta do agente.");
      setInput("");
    },
    onError: (e) => {
console.error("Erro ao enviar mensagem:", e);
      setResposta("Erro ao conectar com o agente.");
    },
  });

  const handleEnviar = () => {
    if (!input.trim()) return;
    mutation.mutate(input);
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 right-6 z-50 w-80 h-96 bg-white shadow-xl rounded-lg border border-gray-300 flex flex-col"
        >
          <header className="flex justify-between items-center p-3 bg-akin-turquoise text-white rounded-t-lg">
            <h2 className="text-sm font-semibold">Chat-kin</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <XIcon size={20} />
            </button>
          </header>
          <div className="p-4 overflow-y-auto flex-1 space-y-2 text-sm">
            <p className="text-gray-500">Comece sua conversa...</p>
            {mutation.isPending ? (
              <p className="text-gray-400">A carregar resposta...</p>
            ) : (
              resposta && <p className="text-gray-700">{resposta}</p>
            )}
          </div>
          <footer className="p-3 border-t border-gray-300 flex">
            <input
              type="text"
              placeholder="Digite uma mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
              onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
              disabled={mutation.isPending}
            />
            <button
              onClick={handleEnviar}
              className="ml-2 px-3 py-2 bg-akin-turquoise text-white rounded-md hover:bg-akin-turquoise transition-all"
              disabled={mutation.isPending}
            >
              ➤
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
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