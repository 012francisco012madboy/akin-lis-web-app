"use client";

import { useState } from "react";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Item from "./item";
import { APP_CONFIG } from "@/config/app";
import { MenuIcon } from "lucide-react";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { useQuery } from "@tanstack/react-query";
import { _axios } from "@/lib/axios";
import { filterRoutesByAccess } from "@/config/filteredAcessRoutes";

interface UserData {
  nome: string;
  email: string;
  senha: string;
  tipo: string;
  status: string;
}

export default function Menu() {
  const activeSegment = useSelectedLayoutSegment() as string;
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { user } = useAuthStore();

  const { data, isPending } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      return await _axios.get<UserData>(`/users/${user?.id}`);
    },
    staleTime: 1000 * 60 * 5,
  });

  const routes = data ? filterRoutesByAccess(data.data.tipo) : [];

  return (
    <>
      {/* Menu em tela pequena (com Sheet) */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 bg-akin-turquoise text-akin-white-smoke">
          {/* Logo */}
          <Image
            width={108}
            height={40}
            src={APP_CONFIG.LOGO_WHITE}
            alt="Akin logo"
            priority
          />
          {/* Botão para abrir o Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <MenuIcon className="w-6 h-6 cursor-pointer" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-akin-turquoise text-akin-white-smoke"
            >
              <SheetHeader>
                <Image
                  width={108}
                  height={40}
                  src={APP_CONFIG.LOGO_WHITE}
                  alt="Akin logo"
                  priority
                />
              </SheetHeader>
              <nav>
                <ul className="space-y-2 mt-4" role="menu">
                  {isPending
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          className="h-6 w-full bg-akin-light-gray"
                        />
                      ))
                    : routes.map((item, index) => (
                        <Item item={item} key={index} activeSegment={activeSegment} />
                      ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Menu em telas maiores */}
      <aside
        className="hidden md:block bg-akin-turquoise p-4 text-akin-white-smoke w-full min-h-52 h-max md:w-52 md:h-screen fixed space-y-5 md:space-y-0"
        aria-label="Menu lateral de navegação"
      >
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image
            width={108}
            height={40}
            src={APP_CONFIG.LOGO_WHITE}
            alt="Akin logo"
            priority
          />
        </div>

        {/* Navegação */}
        <nav className="">
          <ul
            className="space-y-1.5 mt-10 gap-2 flex flex-col items-start"
            role="menu"
          >
            {isPending
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-10 w-full bg-akin-light-gray"
                  />
                ))
              : routes.map((item, index) => (
                  <Item item={item} key={index} activeSegment={activeSegment} />
                ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
