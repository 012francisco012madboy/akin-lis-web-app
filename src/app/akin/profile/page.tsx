import Avatar from "@/components/avatar";
import { Button } from "@/components/button";
import { AppLayout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { View } from "@/components/view";
import { MOCK_LOGGED_USER } from "@/mocks/logged-user";
import { Settings } from "lucide-react";

interface IProfile {}

export default function Profile({}: IProfile) {
  const user = {
    avatar: MOCK_LOGGED_USER.avatar,
    name: MOCK_LOGGED_USER.fullName,
    role: MOCK_LOGGED_USER.role,
    phoneNumber: MOCK_LOGGED_USER.phoneNumber,
    email: MOCK_LOGGED_USER.email,
  };

  return (
    <View.Vertical className="h-screen bg-gray-100">
      {/* Header */}
      <AppLayout.ContainerHeader label="Perfil do Usuário" />

      {/* Card Principal */}
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              userName={user.name}
              image={user.avatar}
              className="size-40 border-4 border-gray-300"
            />
            <Button.Primary
              className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full"
              aria-label="Alterar Avatar"
            >
              <Settings size={16} />
            </Button.Primary>
          </div>

          {/* Informações Básicas */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.role}</p>
          </div>
        </div>

        {/* Detalhes do Perfil */}
        <div className="mt-8 space-y-6">
          <ProfileDetail label="Número de Telefone" value={user.phoneNumber} />
          <ProfileDetail label="Email" value={user.email} />
          <ProfileDetail label="Senha" value="*********" />
        </div>

        {/* Ações */}
        <div className="flex justify-end mt-8 gap-4">
          <Button.Primary className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            Redefinir Senha
          </Button.Primary>
          <Button.Primary className="bg-blue-600 hover:bg-blue-700">
            Salvar Alterações
          </Button.Primary>
        </div>
      </div>
    </View.Vertical>
  );
}

// Componente de detalhe do perfil
function ProfileDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
      <p className="font-medium text-gray-700">{label}</p>
      <Input
        value={value}
        placeholder={label}
        className="w-full md:w-1/2 mt-2 md:mt-0"
      />
    </div>
  );
}
