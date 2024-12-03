"use client";
import React, { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { APP_CONFIG } from "@/config/app";
import { usePathname } from "next/navigation";
import { View } from "@/components/view";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface ISchedule {
  children: React.ReactNode;
}

const breadcumbItem = [
  {
    label: "Agendamento"
  }
];

export default function Schedule({ children }: ISchedule) {
  const pathname = usePathname();
  const items = APP_CONFIG.ROUTES.SCHEDULE;

  // Encontra o item que corresponde ao pathname atual
  const activeTab = items.find((item) => pathname === item.path)?.path || items[0].path;

  return (
    <View.Vertical className="gap-4 h-screen">
      <div className="flex flex-col md:flex-row justify-start w-full md:justify-between md:items-center">
        <CustomBreadcrumb items={breadcumbItem} />

        <Tabs defaultValue={activeTab} className="w-[400px] flex md:justify-end">
          <TabsList>
            {items.map((item) => (
              <Link href={item.path} key={item.path}>
                <TabsTrigger value={item.path} className="data-[state=active]:bg-akin-turquoise data-[state=active]:text-white font-semibold" >{item.label}</TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
        {/* 
        <TabMenu
          className="text-gray-700 *:gap-0 bg-gray-50 rounded-md"
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)} // Atualiza o índice ativo
        /> */}
      </div>
      <hr />
      <View.Scroll>
        {children}
      </View.Scroll>
    </View.Vertical>
  );
}
