import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CustomBreadcrumb from "@/components/custom-breadcrumb";

interface LoadingStateProps {
  breadcrumbItems: { label: string; link: string }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: "" | "Ocupado" | "Livre";
  setFilterStatus: (status: "" | "Ocupado" | "Livre") => void;
  setFormModalOpen: (open: boolean) => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  breadcrumbItems,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  setFormModalOpen,
}) => {
  return (
    <div>
      <CustomBreadcrumb items={breadcrumbItems} borderB />

      <div className="mt-3 flex flex-col md:flex-row md:items-center gap-4">
        <Input
          placeholder="Pesquisar técnico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 focus-visible:ring-akin-turquoise"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "" | "Ocupado" | "Livre")}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">Todos</option>
          <option value="Ocupado">Ocupado</option>
          <option value="Livre">Livre</option>
        </select>
        <Button className="bg-akin-turquoise hover:bg-akin-turquoise/80" onClick={() => setFormModalOpen(true)}>
          Cadastrar Técnico
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex justify-between relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </CardContent>
            <CardFooter className="flex flex-col xl:flex-row justify-between gap-2">
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              </div>
              <div className="w-24 h-10 bg-gray-300 rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
