"use client";
import { Suspense, useState } from "react";
import Loading from "../loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebarConfig/app-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleMoreIcon, XIcon } from "lucide-react";

interface IDashboard {
  children: React.ReactNode;
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
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resposta, setResposta] = useState("");

  const handleEnviar = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://34.118.135.69:5000/chefe_laboratorio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto: input }),
      });

      const data = await res.json();
      setResposta(data.resposta || "Sem nenhuma resposta do agente.");
    } catch (error) {
      console.error("Erro ao conectar:", error);
      setResposta("Erro ao conectar com o agente.");
    } finally {
      setIsLoading(false);
      setInput("");
    }
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
            {isLoading ? (
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
            />
            <button
              onClick={handleEnviar}
              className="ml-2 px-3 py-2 bg-akin-turquoise text-white rounded-md hover:bg-akin-turquoise transition-all"
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


{/*"use client";
import { Suspense, useState } from "react";
import Loading from "../loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebarConfig/app-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleMoreIcon, XIcon } from "lucide-react";

interface IDashboard {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default function Akin({ children }: IDashboard) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarContentWrapper>{children}</SidebarContentWrapper>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-akin-turquoise text-white rounded-full shadow-lg hover:bg-akin-turquoise/80  transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <MessageCircleMoreIcon size={24} />
        </motion.button>

        <Chatbot isChatOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

function Chatbot({ isChatOpen, onClose }: { isChatOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resposta, setResposta] = useState("");

  const handleEnviar = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://34.10.126.45:5000/chefe_laboratorio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto: input }),
      });

      const data = await res.json();
      setResposta(data.resposta || "Sem nenhuma resposta do agente.");
    } catch (error) {
      console.error("Erro ao conectar:", error);
      setResposta("Erro ao conectar com o agente.");
    } finally {
      setIsLoading(false);
      setInput("");
    }
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
            {isLoading ? (
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
            />
            <button
              onClick={handleEnviar}
              className="ml-2 px-3 py-2 bg-akin-turquoise text-white rounded-md hover:bg-akin-turquoise transition-all"
            >
              ➤
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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

*/}