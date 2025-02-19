"use client";
import React from "react";
import { APP_CONFIG } from "@/config/app";
import { usePathname } from "next/navigation";
import { View } from "@/components/view";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { _axios } from "@/lib/axios";
import Cookies from "js-cookie";

interface ISchedule {
  children: React.ReactNode;
}

const breadcumbItem = [
  {
    label: "Agendamento",
  },
];

const filterScheduleByAccess = (schedule: string) => {
  return APP_CONFIG.ROUTES.SCHEDULE.filter((route) =>
    route.access?.includes(schedule)
  );
};

export default function Schedule({ children }: ISchedule) {
  // const pathname = usePathname();
  // const userRole = Cookies.get("akin-role") || "";
  // const routes = filterScheduleByAccess(userRole);

  // Encontra o item que corresponde ao pathname atual
  // const activeTab = routes.find((item) => pathname === item.path)?.path || routes[0].path;

  return (
    <View.Vertical className="gap-4 h-screen">
      <div className="flex flex-col md:flex-row justify-start w-full md:justify-between md:items-center">
        <CustomBreadcrumb items={breadcumbItem} />

        {/* <Tabs defaultValue={activeTab} className="w-[400px] flex md:justify-end">
          <TabsList>
            {routes.map((item) => (
              <Link href={item.path} key={item.path}>
                <TabsTrigger
                  value={item.path}
                  className="data-[state=active]:bg-akin-turquoise data-[state=active]:text-white font-semibold"
                >
                  {item.label}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs> */}
      </div>
      <hr />
      <View.Scroll>{children}</View.Scroll>
    </View.Vertical>
  );
}