"use client"
import { Login } from "@/components/login";
import QueryProvider from "@/config/tanstack-query/queryClientProvider";

export default function Home() {
  return (
    <QueryProvider>
      <section className="flex justify-center items-center">
        <Login />
      </section>
    </QueryProvider>
  );
}