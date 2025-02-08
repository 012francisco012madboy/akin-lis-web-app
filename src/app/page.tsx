"use client"
import Image from "next/image";
import ImageAkinDemo from "@/assets/images/akin-demo.png";
import { Login } from "@/components/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <section className="grid md:grid-cols-3 min-h-screen">
        {/* Formulário de Login */}
        <Login />

        {/* Imagem do lado direito */}
        <aside className="col-span-2 hidden md:flex flex-col justify-center items-end">
          <Image
            src={ImageAkinDemo}
            alt="Akin Demo"
            className="w-full"
          />
        </aside>
      </section>
    </QueryClientProvider>
  );
}0