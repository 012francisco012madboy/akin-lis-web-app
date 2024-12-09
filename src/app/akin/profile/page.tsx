"use client"
import { Settings, Key, Mail, Phone } from "lucide-react";
import { MOCK_LOGGED_USER } from "@/mocks/logged-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { useQuery } from "@tanstack/react-query";
import { ___api } from "@/lib/axios";

interface UserData {
  nome: string,
  email: string,
  senha: string,
  tipo: string,
  status: string
}

const userr = {
  avatar: MOCK_LOGGED_USER.avatar,
  name: MOCK_LOGGED_USER.fullName,
  role: MOCK_LOGGED_USER.role,
  phoneNumber: MOCK_LOGGED_USER.phoneNumber,
  email: MOCK_LOGGED_USER.email,
};

export default function Profile() {
  const { user } = useAuthStore()
  const { data , isPending} = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      return await ___api.get<UserData>(`/users/${user?.id}`);
    }
  })
   
  if(isPending){
    return(
      <div> Carregando Informações...</div>
    )
  }


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-semibold text-gray-800">Perfil do Usuário</h1>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-6 p-4">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={userr.avatar}
                  alt={userr.name}
                  className="w-20 h-20 border-2 border-gray-300 rounded-full"
                />
              </Avatar>
              <div>
                <CardTitle>{data ? data.data.nome : "Nome do usuario"}</CardTitle>
                <p className="text-gray-500">{data ? data.data.tipo : "Acesso do usuario"}</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Settings size={18} />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs for Details */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Informações */}
          <TabsContent value="info">
            <Card className="mt-4">
              <CardContent>
                <ProfileDetail
                  label="Número de Telefone"
                  value={userr.phoneNumber}
                  icon={<Phone size={18} />}
                />
                <ProfileDetail
                  label="Email"
                  value={data ? data.data.email : "Email do usuario"}
                  icon={<Mail size={18} />}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings">
            <Card className="mt-4">
              <CardContent>
                <ProfileDetail
                  label="Senha"
                  value="*********"
                  icon={<Key size={18} />}
                />
                <div className="flex justify-end mt-4 gap-4">
                  <Button variant="secondary">Redefinir Senha</Button>
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Componente de detalhe do perfil
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
    <div className="flex items-center gap-4 py-2 border-b last:border-none">
      {icon && <div className="text-gray-500">{icon}</div>}
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <Input value={value} readOnly className="bg-gray-50" />
      </div>
    </div>
  );
}
