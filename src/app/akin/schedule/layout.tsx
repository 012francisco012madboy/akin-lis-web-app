"use client";
import React, { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { APP_CONFIG } from "@/config/app";
import { useRouter } from "next/navigation";
import { View } from "@/components/view";
import { AppLayout } from "@/components/layout";

interface ISchedule {
  children: React.ReactNode;
}

export default function Schedule({ children }: ISchedule) {
  const [activeIndex, setActiveIndex] = useState(APP_CONFIG.ROUTES.SCHEDULE.length);
  const router = useRouter();

  const items = APP_CONFIG.ROUTES.SCHEDULE.map((item) => ({
    ...item,
    icon: React.createElement(item.icon),
    command: () => router.push(item.path),
  }));

  return (
    <View.Vertical className="gap-4 h-screen">
      <div className="flex justify-between items-center">
        <AppLayout.ContainerHeader noBottomLine label="Agendamento" />
        <TabMenu
          className="text-gray-700 *:gap-0"
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        />
      </div>
      <hr />
      <View.Scroll>
        {children}
      </View.Scroll>
    </View.Vertical>
  );
}
