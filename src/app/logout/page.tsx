"use client";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { redirect } from "next/navigation";


export default function Logout() {
  useAuthStore().logout();

  redirect('/');
}
