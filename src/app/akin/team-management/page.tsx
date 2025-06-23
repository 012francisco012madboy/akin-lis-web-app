"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormModal } from "./formModalToCreate";
import TechnicianCardGrid from "@/app/akin/team-management/technician-card-grid";
import LoadingState from "@/app/akin/team-management/loading-state";
import TechnicianDialog from "./technician-dialog";
import { teamManagementRoutes } from "@/Api/Routes/Team-management";

const breadcrumbItems = [
  { label: "Gestão de Equipe", link: "/team-management" },
];

export default function TeamManagement() {
  const [technicians, setTechnicians] = useState<ITeamManagement[]>();
  const [selectedTechnician, setSelectedTechnician] = useState<ITeamManagement | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editTechnician, setEditTechnician] = useState<ITeamManagement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "Ocupado" | "Livre">("");

  const TeamManagement = useQuery({
    queryKey: ["teamManagement"],
    queryFn: async () => {
      return (await teamManagementRoutes.getAllLabTechs()).data;
    },
  })

  const teamManagementCreate = useMutation({
    mutationFn: async (data: ITeamManagement) => {
      console.log("Está a ser criado!", data);
      return (await teamManagementRoutes.createLabTech(data));
    },
    onSuccess: () => {
      ___showSuccessToastNotification({ message: "Técnico cadastrado com sucesso!" });
    },
    onError: () => {
      ___showErrorToastNotification({ message: "Erro ao cadastrar técnico!" });
    },
  })

  const teamManagementDelete = useMutation({
    mutationFn: async (id: string) => {
      return (await teamManagementRoutes.deleteLabTech(id));
    },
    onSuccess: () => {
      ___showSuccessToastNotification({ message: "Técnico removido com sucesso!" });
      TeamManagement.refetch();
    },
    onError: () => {
      ___showErrorToastNotification({ message: "Erro ao remover técnico!" });
    },
  });

  const teamManagementUpdate = useMutation({
    mutationFn: async (data: ITeamManagement) => {
      return (await teamManagementRoutes.updateLabTech(data));
    },
    onSuccess: () => {
      ___showSuccessToastNotification({ message: "Técnico atualizado com sucesso!" });
      TeamManagement.refetch();
    },
    onError: () => {
      ___showErrorToastNotification({ message: "Erro ao atualizar técnico!" });
    },
  });

  const handleDelete = (id: string) => {
    teamManagementDelete.mutate(id);
  };

  const handleSave = (data: ITeamManagement) => {
    if (data.id) {
      console.log("Edite Tecnico", data);
      teamManagementUpdate.mutate(data);
    } else {
      console.log("Create Tecnico", data);
      teamManagementCreate.mutate(data);
    }
    setFormModalOpen(false);
  };

  if (TeamManagement.isLoading) {
    return (
      <LoadingState
        breadcrumbItems={breadcrumbItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setFormModalOpen={setFormModalOpen}
      />
    );
  }

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

      <TechnicianCardGrid
        technicians={TeamManagement.data || []}
        handleDelete={handleDelete}
        setEditTechnician={setEditTechnician}
        setFormModalOpen={setFormModalOpen}
        setSelectedTechnician={setSelectedTechnician}
        setModalOpen={setModalOpen}
      />

      {selectedTechnician && (
        <TechnicianDialog
          technician={selectedTechnician}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

      {isFormModalOpen && (
        <FormModal
          open={isFormModalOpen}
          technician={editTechnician}
          onClose={() => {
            setFormModalOpen(false);
            setEditTechnician(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
