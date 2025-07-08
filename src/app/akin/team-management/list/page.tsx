"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  Users,
  Activity
} from "lucide-react";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormModal } from "../formModalToCreate";
import TechnicianDialog from "../technician-dialog";
import { teamManagementRoutes } from "@/Api/Routes/Team-management";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dados fictícios para demonstração
const MOCK_TECHNICIANS: ITeamManagement[] = [
  {
    id: "1",
    nome_completo: "Ana Silva Santos",
    usuario: { id: "1", nome: "ana.silva", email: "ana.silva@osapicare.com", hash: "", hashedRt: "", tipo: "TECNICO", status: "ATIVO", criado_aos: "2024-01-15", atualizado_aos: "2024-07-08" },
    cargo: "Técnico Sênior",
    email: "ana.silva@osapicare.com",
    contacto_telefonico: "+244 923 456 789",
    status: "ATIVO",
    id_unidade_saude: "1",
    data_nascimento: "1985-03-12",
    numero_identificacao: "123456789LA",
    id_sexo: 2,
    senha: "",
    tipo: "TECNICO",
    especialidade: "Hematologia",
    turno: "Manhã",
    exames_realizados: 342,
    eficiencia: 95,
    ultimo_acesso: "2024-07-08 09:30"
  },
  {
    id: "2",
    nome_completo: "João Santos Pereira",
    usuario: { id: "2", nome: "joao.santos", email: "joao.santos@osapicare.com", hash: "", hashedRt: "", tipo: "TECNICO", status: "ATIVO", criado_aos: "2024-02-20", atualizado_aos: "2024-07-08" },
    cargo: "Técnico",
    email: "joao.santos@osapicare.com",
    contacto_telefonico: "+244 934 567 890",
    status: "ATIVO",
    id_unidade_saude: "1",
    data_nascimento: "1990-07-25",
    numero_identificacao: "987654321LA",
    id_sexo: 1,
    senha: "",
    tipo: "TECNICO",
    especialidade: "Microbiologia",
    turno: "Tarde",
    exames_realizados: 278,
    eficiencia: 89,
    ultimo_acesso: "2024-07-08 14:15"
  },
  {
    id: "3",
    nome_completo: "Maria José Fernandes",
    usuario: { id: "3", nome: "maria.jose", email: "maria.jose@osapicare.com", hash: "", hashedRt: "", tipo: "TECNICO", status: "ATIVO", criado_aos: "2024-01-10", atualizado_aos: "2024-07-08" },
    cargo: "Técnico",
    email: "maria.jose@osapicare.com",
    contacto_telefonico: "+244 945 678 901",
    status: "ATIVO",
    id_unidade_saude: "1",
    data_nascimento: "1988-11-30",
    numero_identificacao: "456789123LA",
    id_sexo: 2,
    senha: "",
    tipo: "TECNICO",
    especialidade: "Bioquímica",
    turno: "Manhã",
    exames_realizados: 305,
    eficiencia: 92,
    ultimo_acesso: "2024-07-08 08:45"
  },
  {
    id: "4",
    nome_completo: "Carlos Lima Rodrigues",
    usuario: { id: "4", nome: "carlos.lima", email: "carlos.lima@osapicare.com", hash: "", hashedRt: "", tipo: "TECNICO", status: "INATIVO", criado_aos: "2024-03-05", atualizado_aos: "2024-07-06" },
    cargo: "Técnico Júnior",
    email: "carlos.lima@osapicare.com",
    contacto_telefonico: "+244 956 789 012",
    status: "INATIVO",
    id_unidade_saude: "1",
    data_nascimento: "1995-05-18",
    numero_identificacao: "789123456LA",
    id_sexo: 1,
    senha: "",
    tipo: "TECNICO",
    especialidade: "Parasitologia",
    turno: "Noite",
    exames_realizados: 156,
    eficiencia: 78,
    ultimo_acesso: "2024-07-06 22:00"
  }
];

export default function TeamManagementList() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTurno, setFilterTurno] = useState<string>("all");
  const [selectedTechnician, setSelectedTechnician] = useState<ITeamManagement | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editTechnician, setEditTechnician] = useState<ITeamManagement | null>(null);

  const teamManagement = useQuery({
    queryKey: ["teamManagement"],
    queryFn: async () => {
      // Retornar dados fictícios para demonstração
      return MOCK_TECHNICIANS;
    },
  });

  const teamManagementCreate = useMutation({
    mutationFn: async (data: ITeamManagement) => {
      console.log("Criando técnico:", data);
      return { data };
    },
    onSuccess: () => {
      ___showSuccessToastNotification({ message: "Técnico cadastrado com sucesso!" });
      teamManagement.refetch();
    },
    onError: () => {
      ___showErrorToastNotification({ message: "Erro ao cadastrar técnico!" });
    },
  });

  const teamManagementDelete = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deletando técnico:", id);
      return { data: { id } };
    },
    onSuccess: () => {
      ___showSuccessToastNotification({ message: "Técnico removido com sucesso!" });
      teamManagement.refetch();
    },
    onError: () => {
      ___showErrorToastNotification({ message: "Erro ao remover técnico!" });
    },
  });

  const teamManagementUpdate = useMutation({
    mutationFn: async (data: ITeamManagement) => {
      console.log("Atualizando técnico:", data);
      return { data };
    },
    onSuccess: () => {
      ___showSuccessToastNotification({ message: "Técnico atualizado com sucesso!" });
      teamManagement.refetch();
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
      teamManagementUpdate.mutate(data);
    } else {
      teamManagementCreate.mutate(data);
    }
    setFormModalOpen(false);
  };

  const filteredTechnicians = (teamManagement.data || []).filter((tech) => {
    const matchesSearch = tech.nome_completo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.especialidade?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || tech.status === filterStatus;
    const matchesTurno = filterTurno === "all" || tech.turno === filterTurno;

    return matchesSearch && matchesStatus && matchesTurno;
  });

  const getStatusBadge = (status: string) => {
    return status === "ATIVO"
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
      : <Badge variant="secondary">Inativo</Badge>;
  };

  const getTurnoBadge = (turno: string) => {
    const colors = {
      "Manhã": "bg-blue-100 text-blue-800",
      "Tarde": "bg-orange-100 text-orange-800",
      "Noite": "bg-purple-100 text-purple-800"
    };
    return <Badge className={colors[turno as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{turno}</Badge>;
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTechnicians.map((technician) => (
        <Card key={technician.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {technician.nome_completo?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{technician.nome_completo}</h3>
                  <p className="text-sm text-gray-500">{technician.cargo}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setSelectedTechnician(technician);
                    setModalOpen(true);
                  }}>
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setEditTechnician(technician);
                    setFormModalOpen(true);
                  }}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => technician.id && handleDelete(technician.id)}
                  >
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Status</p>
                {getStatusBadge(technician.status || "INATIVO")}
              </div>
              <div>
                <p className="text-gray-500">Turno</p>
                {getTurnoBadge(technician.turno || "Manhã")}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Activity className="h-4 w-4 mr-2" />
                {technician.especialidade}
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {technician.exames_realizados} exames realizados
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Último acesso: {technician.ultimo_acesso}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600">{technician.eficiencia}%</p>
                <p className="text-xs text-gray-500">Eficiência</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const TableView = () => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Técnico</th>
                <th className="text-left p-4 font-medium text-gray-700">Especialidade</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Turno</th>
                <th className="text-left p-4 font-medium text-gray-700">Exames</th>
                <th className="text-left p-4 font-medium text-gray-700">Eficiência</th>
                <th className="text-left p-4 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTechnicians.map((technician, index) => (
                <tr key={technician.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {technician.nome_completo?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{technician.nome_completo}</p>
                        <p className="text-sm text-gray-500">{technician.cargo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{technician.especialidade}</td>
                  <td className="p-4">{getStatusBadge(technician.status || "INATIVO")}</td>
                  <td className="p-4">{getTurnoBadge(technician.turno || "Manhã")}</td>
                  <td className="p-4 text-sm text-gray-600">{technician.exames_realizados}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{technician.eficiencia}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${technician.eficiencia}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          setSelectedTechnician(technician);
                          setModalOpen(true);
                        }}>
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setEditTechnician(technician);
                          setFormModalOpen(true);
                        }}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => technician.id && handleDelete(technician.id)}
                        >
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lista de Técnicos</h1>
          <p className="text-gray-600">Gerencie e visualize todos os técnicos da equipe</p>
        </div>
        <Button
          onClick={() => setFormModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Técnico
        </Button>
      </div>

      {/* Filtros e Controles */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquisar por nome, email ou especialidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTurno} onValueChange={setFilterTurno}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Manhã">Manhã</SelectItem>
                  <SelectItem value="Tarde">Tarde</SelectItem>
                  <SelectItem value="Noite">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{filteredTechnicians.length}</p>
            <p className="text-sm text-gray-600">Total de Técnicos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredTechnicians.filter(t => t.status === "ATIVO").length}
            </p>
            <p className="text-sm text-gray-600">Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(filteredTechnicians.reduce((acc, t) => acc + (t.eficiencia || 0), 0) / filteredTechnicians.length) || 0}%
            </p>
            <p className="text-sm text-gray-600">Eficiência Média</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {filteredTechnicians.reduce((acc, t) => acc + (t.exames_realizados || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total de Exames</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Técnicos */}
      {viewMode === "grid" ? <GridView /> : <TableView />}

      {/* Modais */}
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
