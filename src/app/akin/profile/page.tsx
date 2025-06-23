"use client"
import { Settings, Key, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { _axios } from "@/Api/axios.config";
import { userRoutes } from "@/Api/Routes/User";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";

export interface UserData {
  nome: string,
  email: string,
  senha: string,
  tipo: string,
  status: string
}

export default function Profile() {
  const { user, logout } = useAuthStore();

  const { data, isPending } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      return await _axios.get<UserData>(`/users/${user?.id}`);
    }
  });

  const deleteUser = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: async () => {
      if (!user?.id) throw new Error("User ID is required");
      return await userRoutes.deleteUser(user.id);
    },
    onSuccess: () => {
      ___showSuccessToastNotification({
        message: "Conta excluída com sucesso.",
      })
      logout();
      window.location.href = "/";
    },
    onError: () => {
      ___showErrorToastNotification({
        message: "Erro ao excluir conta. Tente novamente mais tarde.",
      })
    }
  })

  if (isPending) {
    return <div className="p-8 text-center text-gray-500">Carregando Informações...</div>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <Card className="mb-6 rounded-xl shadow-sm">
          <CardHeader className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-md ring-2 ring-primary">
                <AvatarImage src={""} alt={data?.data.nome} />
              </Avatar>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-0 right-0 bg-white hover:bg-gray-100 rounded-full p-1 shadow"
              >
                <Settings size={18} />
              </Button>
            </div>
            <div className="text-center">
              <CardTitle className="text-lg">{data?.data.nome || "Nome do Usuário"}</CardTitle>
              <p className="text-sm text-gray-500">{data?.data.tipo || "Tipo de acesso"}</p>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Informações Tab */}
          <TabsContent value="info">
            <Card className="rounded-xl">
              <CardContent className="space-y-4 py-6">
                {/* <ProfileDetail
                  label="Número de Telefone"
                  value={data?.data.}
                  icon={<Phone size={18} />}
                /> */}
                <ProfileDetail
                  label="Email"
                  value={data?.data.email || "Email do Usuário"}
                  icon={<Mail size={18} />}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="settings">
            <Card className="rounded-xl mt-4">
              <CardContent className="space-y-4 py-6">
                <ProfileDetail
                  label="Senha"
                  value="*********"
                  icon={<Key size={18} />}
                />

                <div>
                  <Button variant="destructive" onClick={async () => {
                    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
                      await deleteUser.mutate();
                      return;
                    }
                  }}
                  >
                    {deleteUser.isPending ? "Excluindo..." : "Excluir Conta"}
                  </Button>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Redefinir Senha</Button>
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
}

function ProfileDetail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b pb-4 last:border-none">
      <div className="text-gray-500">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <Input value={value} readOnly className="bg-gray-50 text-sm" />
      </div>
    </div>
  );
}
