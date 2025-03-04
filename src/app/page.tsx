"use client"
import Image from "next/image";
import ImageAkinDemo from "@/assets/images/akin-demo.png";
import { Login } from "@/components/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { APP_CONFIG } from "@/config/app";

const queryClient = new QueryClient()
export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* grid md:grid-cols-3 min-h-screen */}
      <section className="flex justify-center items-center">
        {/* Formulário de Login */}
        <Login />

        {/* Imagem do lado direito */}
        {/*className="col-span-2 hidden md:flex flex-col justify-center items-end"  */}
        <aside className=" flex items-center justify-center" >
          {/* <Image
            src={ImageAkinDemo}
            alt="Akin Demo"
            className="w-full"
          /> */}

          {/* <Image src={APP_CONFIG.LOGO} alt="Akin logo" width={200} height={200} /> */}
        </aside>
      </section>
    </QueryClientProvider>
  );
}