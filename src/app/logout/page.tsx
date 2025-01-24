"use client";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { useAuthRoleStore } from "@/utils/zustand-store/userRoleStore";
import { redirect } from "next/navigation";


export default function Logout() {

  useAuthRoleStore().clearRole()
  useAuthStore().logout();

  redirect('/');
}
