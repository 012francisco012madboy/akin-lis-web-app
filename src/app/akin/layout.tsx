"use client";
import { AppLayout } from "@/components/layout";
import { MessageCircleMore } from "lucide-react";
import { Suspense, useEffect } from "react";
import Loading from "../loading";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


interface IDashboard {
  children: React.ReactNode;
}
const queryClient = new QueryClient()

export default function Akin({ children }: IDashboard) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (pathname?.startsWith("/akin/") && user === null) {
      router.push("/");
    }
  }, [pathname, user, router]);


  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col md:flex-row h-screen overflow-y-auto md:overflow-hidden bg-gray-50">
        {/* Menu Lateral */}
        <aside className="w-full h-20 md:w-52 bg-akin-turquoise  flex-shrink-0">
          <AppLayout.Menu />
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 flex flex-col md:overflow-y-hidden px-4 py-3 pt-8 md:pt-3">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>

          {/* Botão Flutuante */}
          <div
            className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-akin-turquoise border hover:bg-akin-yellow-light hover:border-akin-turquoise group transition ease-in-out cursor-pointer"
            title="Chat Kin"
          >
            <MessageCircleMore className="text-akin-yellow-light group-hover:text-akin-turquoise" />
          </div>
        </main>
      </div>
    </QueryClientProvider>

  );
}
