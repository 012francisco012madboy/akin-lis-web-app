"use client";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { redirect } from "next/navigation";

interface ILogout { }

export default function Logout() {
  useAuthStore().logout();

  redirect('/');
}
