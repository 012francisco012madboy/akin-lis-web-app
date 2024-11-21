import { Input } from "@/components/input";
import { AppLayout } from "@/components/layout";
import { View } from "@/components/view";
import { Search, SquarePen, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import { MOCK_MESSAGES } from "@/mocks/message";
import Avatar from "@/components/avatar";
import { cn } from "@/lib/utils"; // Helper para classes condicionais.

interface IMessage {}

async function getMessages() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return MOCK_MESSAGES;
}

export default async function Message({}: IMessage) {
  const messages = await getMessages();
  return (
    <View.Vertical className="h-screen bg-gray-50">
      {/* Header */}
      {/* <AppLayout.ContainerHeader label="Mensagens" /> */}

      {/* Toolbar */}
      <div className="flex justify-between px-6 py-4 bg-white border-b">
        <Button.Primary icon={<SquarePen className="mr-2" />}>Escrever</Button.Primary>
        <Input.InputFieldIcon
          icon={Search}
          placeholder="Pesquisar Mensagem"
          className="w-full max-w-sm"
        />
      </div>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Sidebar - Message List */}
        <aside className="w-1/3 border-r bg-white">
          <View.Scroll className="h-full">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                avatar={message.avatar}
                name={message.name}
                wasSent="5s atrás"
                message={message.message}
              />
            ))}
          </View.Scroll>
        </aside>

        {/* Main Content - Message Details */}
        <main className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <h2 className="text-lg font-semibold">Selecione uma mensagem</h2>
            <p className="text-sm">Clique em uma mensagem para ver os detalhes aqui.</p>
          </div>
        </main>
      </div>
    </View.Vertical>
  );
}

/**
 * Componente para exibir uma mensagem na lista.
 */
function MessageCard({
  message,
  name,
  wasSent,
  avatar,
}: {
  avatar: string;
  message: string;
  wasSent: string;
  name: string;
}) {
  return (
    <div
      className={cn(
        "flex px-4 py-3 justify-between items-center rounded-lg transition hover:bg-gray-100 cursor-pointer",
        "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-300"
      )}
    >
      {/* Avatar + Message Info */}
      <div className="flex items-center gap-4">
        <Avatar userName={name} image={avatar} size="large" />
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-sm text-gray-600 truncate">{message.substring(0, 30).concat("...")}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-3">
          <Trash2
            size={18}
            className="text-gray-400 hover:text-red-500 transition"
            aria-label="Deletar"
          />
          <Star
            size={18}
            className="text-gray-400 hover:text-yellow-500 transition"
            aria-label="Favoritar"
          />
        </div>
        <p className="text-xs text-gray-400">{wasSent}</p>
      </div>
    </div>
  );
}
