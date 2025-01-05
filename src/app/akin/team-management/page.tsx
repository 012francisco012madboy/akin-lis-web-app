"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Technician {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: "Ocupado" | "Livre";
  patient?: string;
  exam?: string;
  totalExams: number;
  avgTime: string;
  materialsUsed: string[];
}

const initialTechnicians: Technician[] = [
  {
    id: "1",
    name: "João Silva",
    role: "Técnico de Laboratório",
    email: "joao.silva@example.com",
    phone: "+244 912 345 678",
    status: "Livre",
    totalExams: 50,
    avgTime: "15m",
    materialsUsed: ["Luvas", "Reagente A", "Tubo de ensaio"],
  },
  {
    id: "2",
    name: "Maria Oliveira",
    role: "Técnica de Radiologia",
    email: "maria.oliveira@example.com",
    phone: "+244 923 456 789",
    status: "Ocupado",
    totalExams: 75,
    avgTime: "20m",
    materialsUsed: ["Avental de chumbo", "Placa de radiografia"],
  },
  {
    id: "3",
    name: "Carlos Fernandes",
    role: "Técnico de Hematologia",
    email: "carlos.fernandes@example.com",
    phone: "+244 934 567 890",
    status: "Livre",
    totalExams: 40,
    avgTime: "18m",
    materialsUsed: ["Microscópio", "Lâmina de sangue", "Corante"],
  },
  {
    id: "4",
    name: "Ana Costa",
    role: "Técnica de Microbiologia",
    email: "ana.costa@example.com",
    phone: "+244 945 678 901",
    status: "Ocupado",
    totalExams: 65,
    avgTime: "25m",
    materialsUsed: ["Placa de Petri", "Meio de cultura", "Bico de Bunsen"],
  },
  {
    id: "5",
    name: "Pedro Sousa",
    role: "Técnico de Patologia",
    email: "pedro.sousa@example.com",
    phone: "+244 956 789 012",
    status: "Livre",
    totalExams: 55,
    avgTime: "22m",
    materialsUsed: ["Centrífuga", "Faca histológica", "Bloco de parafina"],
  },
];

const breadcrumbItems = [
  { label: "Gestão de Equipe", link: "/team-management" },
];

export default function TeamManagement() {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editTechnician, setEditTechnician] = useState<Technician | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "Ocupado" | "Livre">("");

  const handleDelete = (id: string) => {
    setTechnicians((prev) => prev.filter((tech) => tech.id !== id));
    ___showErrorToastNotification({ message: "Técnico removido com sucesso!" });
  };

  const handleSave = (technician: Technician) => {
    if (editTechnician) {
      setTechnicians((prev) => prev.map((tech) => (tech.id === technician.id ? technician : tech)));
    } else {
      setTechnicians((prev) => [...prev, { ...technician, id: Date.now().toString() }]);
    }
    setFormModalOpen(false);
    ___showSuccessToastNotification({ message: `Técnico ${editTechnician ? "editado" : "cadastrado"} com sucesso!` });
  };

  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus ? tech.status === filterStatus : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="">
      <CustomBreadcrumb items={breadcrumbItems} borderB />

      <div className="mt-3 flex flex-col md:flex-row md:items-center gap-4">
        <Input
          placeholder="Pesquisar técnico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3"
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
        <Button className="bg-akin-turquoise hover:bg-akin-turquoise/80 " onClick={() => setFormModalOpen(true)}>Cadastrar Técnico</Button>
        {/* <Button variant={"outline"} className=" border-akin-turquoise hover:bg-akin-turquoise hover:text-white "  onClick={() => setFormModalOpen(true)}>Criar Equipe</Button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredTechnicians.map((technician) => (
          <Card key={technician.id}>
            <CardHeader className="flex justify-between relative">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src=""/>
                  <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{technician.name}</h2>
                  <p className="text-sm text-gray-500">{technician.role}</p>
                </div>
              </div>
              <Popover>
                <PopoverTrigger>
                  <MoreHorizontal className="size-5 cursor-pointer absolute top-5 right-5" />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(technician.id)}
                    >
                      Remover
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setEditTechnician(technician);
                        setFormModalOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent>
              <p>Email: {technician.email}</p>
              <p>Contato: {technician.phone}</p>
              <p>
                Status: <span className={`font-bold ${technician.status === "Ocupado" ? "text-red-500" : "text-green-500"}`}>{technician.status}</span>
              </p>
            </CardContent>
            <CardFooter className="flex flex-col xl:flex-row justify-between gap-2">
              <Button className="w-full" variant="outline">Mensagem</Button>
              <Button className="w-full" variant="outline">Chamada</Button>
              <Button className="w-full bg-akin-turquoise hover:bg-akin-turquoise/80" onClick={() => {
                setSelectedTechnician(technician);
                setModalOpen(true);
              }}>Ver Mais</Button>

            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedTechnician && (
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <h2>{selectedTechnician.name}</h2>
            </DialogHeader>
            <div>
              {selectedTechnician.status === "Ocupado" && (
                <div>
                  <p><strong>Paciente:</strong> {selectedTechnician.patient}</p>
                  <p><strong>Exame:</strong> {selectedTechnician.exam}</p>
                </div>
              )}
              <p><strong>Total de Exames:</strong> {selectedTechnician.totalExams}</p>
              <p><strong>Tempo Médio:</strong> {selectedTechnician.avgTime}</p>
              <p><strong>Materiais Usados:</strong> {selectedTechnician.materialsUsed.join(", ")}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setModalOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

function FormModal({ open, technician, onClose, onSave }: any) {
  const [formData, setFormData] = useState<Technician>(
    technician || { id: "", name: "", role: "", email: "", phone: "", status: "Livre", totalExams: 0, avgTime: "", materialsUsed: [] }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2>{technician ? "Editar Técnico" : "Cadastrar Técnico"}</h2>
        </DialogHeader>
        <div>
          <Input name="name" placeholder="Nome" value={formData.name} onChange={handleChange} className="mb-4" />
          <Input name="role" placeholder="Cargo" value={formData.role} onChange={handleChange} className="mb-4" />
          <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="mb-4" />
          <Input name="phone" placeholder="Telefone" value={formData.phone} onChange={handleChange} className="mb-4" />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="ghost">Cancelar</Button>
          <Button onClick={() => onSave(formData)}>{technician ? "Salvar" : "Cadastrar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
