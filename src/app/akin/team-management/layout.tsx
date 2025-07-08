"use client";

import { ReactNode } from "react";

interface TeamManagementLayoutProps {
  children: ReactNode;
}

export default function TeamManagementLayout({ children }: TeamManagementLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
