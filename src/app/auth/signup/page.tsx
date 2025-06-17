// "use client";
import { Register } from "@/components/Auth/sign-up/signUp";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { redirect } from "next/navigation";


export default function Sign_Up() {
  // const { user } = useAuthStore();

  // if (user) return redirect("/akin/dashboard");
  
  return (
    <Register />
  )
}