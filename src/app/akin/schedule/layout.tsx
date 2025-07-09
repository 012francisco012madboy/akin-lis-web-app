"use client";
import React from "react";
import { View } from "@/components/view";
import { _axios } from "@/Api/axios.config";
interface ISchedule {
  children: React.ReactNode;
}

export default function Schedule({ children }: ISchedule) {

  return (
    <View.Vertical className="gap-4 h-screen overflow-hidden">
      <View.Scroll>{children}</View.Scroll>
    </View.Vertical>
  );
}