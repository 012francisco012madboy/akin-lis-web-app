"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState } from "react"
import {
  Search,
  Calendar,
  Clock,
  DollarSign,
  User,
  UserCheck,
  Grid3X3,
  List,
  Pencil,
  Play,
  BadgeIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Toggle } from "@/components/ui/toggle"
import { Label } from "@/components/ui/label"

interface ExamType {
  nome: string
  preco: number
}

interface Agendamento {
  id_chefe_alocado: string
}

interface ExamData {
  id: string
  data_agendamento: string
  hora_agendamento: string
  status: string
  status_pagamento: string
  id_tecnico_alocado: string
  id_tipo_exame: string
  Tipo_Exame: ExamType
  Agendamento?: Agendamento
}

interface ResponseData {
  data: ExamData[]
}

const SkeletonCard = () => (
  <Card className="mb-4">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-20" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Separator />
      <div className="flex justify-end">
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
)

const SkeletonList = () => (
  <Card className="mb-2">
    <CardContent className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
)

const ExamCard = ({
  exam,
  onEdit,
  onStart,
  canStart,
  techName,
  chiefName,
}: {
  exam: ExamData
  onEdit: (exam: any) => void
  onStart: (examId: string) => void
  canStart: boolean
  techName: string
  chiefName: string
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "concluido":
        return "bg-green-100 text-green-800 border-green-200"
      case "em_andamento":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pago":
        return "bg-green-100 text-green-800 border-green-200"
      case "pendente":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">{exam.Tipo_Exame.nome}</h3>
            <Button variant="ghost" size="sm" onClick={() => onEdit(exam)} className="h-8 w-8 p-0">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <Badge className={getStatusColor(exam.status)}>{exam.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Data:</span>
              <span>{exam.data_agendamento}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Horário:</span>
              <span>{exam.hora_agendamento}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Preço:</span>
              <span className="font-semibold">
                {exam.Tipo_Exame.preco.toLocaleString("pt-ao", {
                  style: "currency",
                  currency: "AOA",
                })}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <BadgeIcon className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Pagamento:</span>
              <Badge variant="outline" className={getPaymentStatusColor(exam.status_pagamento)}>
                {exam.status_pagamento}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <UserCheck className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Chefe:</span>
              <span className="truncate">{chiefName}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Técnico:</span>
              <span className="truncate">{techName}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end">
          {canStart && (
            <Button onClick={() => onStart(exam.id)} className="bg-teal-600 hover:bg-teal-700">
              <Play className="h-4 w-4 mr-2" />
              Começar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const ExamListItem = ({
  exam,
  onEdit,
  onStart,
  canStart,
  techName,
  chiefName,
}: {
  exam: ExamData
  onEdit: (exam: any) => void
  onStart: (examId: string) => void
  canStart: boolean
  techName: string
  chiefName: string
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "concluido":
        return "bg-green-100 text-green-800 border-green-200"
      case "em_andamento":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="mb-2 hover:shadow-sm transition-shadow">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-gray-900 truncate">{exam.Tipo_Exame.nome}</h4>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{exam.data_agendamento}</span>
              <span>{exam.hora_agendamento}</span>
              <span className="font-medium">
                {exam.Tipo_Exame.preco.toLocaleString("pt-ao", {
                  style: "currency",
                  currency: "AOA",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(exam.status)}>{exam.status}</Badge>
            <Button variant="ghost" size="sm" onClick={() => onEdit(exam)} className="h-8 w-8 p-0">
              <Pencil className="h-4 w-4" />
            </Button>
            {canStart && (
              <Button size="sm" onClick={() => onStart(exam.id)} className="bg-teal-600 hover:bg-teal-700">
                <Play className="h-4 w-4 mr-1" />
                Começar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const UpcomingExams = () => {
  const { id } = useParams()
  const [filter, setFilter] = useState("")
  const [viewMode, setViewMode] = useState<"card" | "list">("card")

  // Mock queries - replace with your actual queries
  const { data, isPending } = useQuery({
    queryKey: ["next-exam"],
    queryFn: async () => {
      // Mock data
      return {
        data: {
          data: [
            {
              id: "1",
              data_agendamento: "2024-01-15",
              hora_agendamento: "09:00",
              status: "PENDENTE",
              status_pagamento: "PAGO",
              id_tecnico_alocado: "tech1",
              id_tipo_exame: "exam1",
              Tipo_Exame: {
                nome: "Hemograma Completo",
                preco: 15000,
              },
              Agendamento: {
                id_chefe_alocado: "chief1",
              },
            },
          ],
        },
      }
    },
  })

  const userName = useQuery({
    queryKey: ["user-name"],
    queryFn: async () => {
      return {
        data: {
          nome_completo: "João Silva Santos",
        },
      }
    },
  })

  const filteredData = filter
    ? data?.data.data.filter((exam) => exam.Tipo_Exame.nome.toLowerCase().includes(filter.toLowerCase()))
    : data?.data.data

  const handleEdit = (exam: any) => {
    console.log("Edit exam:", exam)
  }

  const handleStart = (examId: string) => {
    console.log("Start exam:", examId)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Patient Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-teal-100 text-teal-700">
                    {userName.data?.data.nome_completo ? getInitials(userName.data.data.nome_completo) : "PA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Paciente</Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {userName.data?.data.nome_completo || "Carregando..."}
                  </p>
                </div>
              </div>

              {/* Search and View Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar exames..."
                    className="pl-10 w-full sm:w-64"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <Toggle
                    pressed={viewMode === "card"}
                    onPressedChange={() => setViewMode("card")}
                    className="data-[state=on]:bg-white data-[state=on]:shadow-sm"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Toggle>
                  <Toggle
                    pressed={viewMode === "list"}
                    onPressedChange={() => setViewMode("list")}
                    className="data-[state=on]:bg-white data-[state=on]:shadow-sm"
                  >
                    <List className="h-4 w-4" />
                  </Toggle>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exams Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Próximos Exames</h2>
            <Badge variant="outline" className="text-sm">
              {filteredData?.length || 0} exames
            </Badge>
          </div>

          {isPending ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (viewMode === "card" ? <SkeletonCard key={i} /> : <SkeletonList key={i} />))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredData?.map((exam) =>
                viewMode === "card" ? (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onEdit={handleEdit}
                    onStart={handleStart}
                    canStart={true}
                    techName="Dr. Maria Silva"
                    chiefName="Dr. João Santos"
                  />
                ) : (
                  <ExamListItem
                    key={exam.id}
                    exam={exam}
                    onEdit={handleEdit}
                    onStart={handleStart}
                    canStart={true}
                    techName="Dr. Maria Silva"
                    chiefName="Dr. João Santos"
                  />
                ),
              )}
            </div>
          )}

          {filteredData?.length === 0 && !isPending && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum exame encontrado</h3>
                <p className="text-gray-600">
                  {filter ? "Tente ajustar os filtros de busca." : "Não há exames agendados para este paciente."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpcomingExams