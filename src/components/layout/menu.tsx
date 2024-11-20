"use client";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import Item from "./item";
import { APP_CONFIG } from "@/config/app";

export default function Menu() {
  const activeSegment = useSelectedLayoutSegment() as string;

  return (
    <aside
      className="bg-akin-turquoise p-4 text-akin-white-smoke w-52 h-screen fixed"
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
      <nav className="mt-10">
        <ul className="space-y-1.5" role="menu">
          {APP_CONFIG.ROUTES.MENU.map((item, index) => (
            <Item item={item} key={index} activeSegment={activeSegment} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
