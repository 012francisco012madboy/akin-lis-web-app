# Chatbot Melhorado - AKIN

## Visão Geral

O novo chatbot do AKIN foi completamente redesenhado com uma interface profissional baseada no Shadcn UI, oferecendo uma experiência de usuário moderna e intuitiva.

## Características Principais

### 🎨 Design Moderno
- Interface baseada no Shadcn UI
- Gradientes e animações suaves
- Design responsivo e acessível
- Tema consistente com o AKIN

### 🎤 Suporte a Áudio
- Gravação de mensagens de áudio
- Reprodução de áudio integrada
- Indicadores visuais de gravação
- Controles de volume

### 💬 Experiência de Chat Aprimorada
- Indicador de digitação animado
- Avatares para usuário e agente
- Timestamps em todas as mensagens
- Scroll automático para novas mensagens

### 🔧 Funcionalidades Avançadas
- Minimizar/maximizar chat
- Silenciar notificações
- Limpar histórico de conversa
- Estados de loading aprimorados

## Estrutura de Arquivos

```
src/components/chatbot/
├── ChatbotImproved.tsx     # Componente principal
├── TypingIndicator.tsx     # Indicador de digitação
├── chatbot-toast.ts        # Sistema de notificações
├── chatbot.css            # Estilos personalizados
└── index.ts               # Exportações centralizadas

src/hooks/
└── useChatbot.ts          # Hook personalizado para estado

src/Api/Routes/IA_Agent/
└── index.routes.ts        # Rotas atualizadas para FormData
```

## Implementação

### 1. Componente Principal

```tsx
import { Chatbot } from "@/components/chatbot/ChatbotImproved";

export default function Layout() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <div>
      {/* Seu conteúdo */}
      <Chatbot 
        isChatOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}
```

### 2. API Atualizada

A API agora suporta FormData com os seguintes campos:
- `user_id`: ID do usuário
- `session_id`: Token de sessão
- `email`: Email do usuário
- `senha`: Senha do usuário
- `message`: Mensagem de texto
- `audioFile`: Arquivo de áudio (opcional)

```typescript
// Exemplo de uso da nova API
await iaAgentRoutes.sendMessageToAgent({
  user_id: "123",
  session_id: "token",
  email: "user@example.com",
  senha: "password",
  message: "Olá!",
  audioFile: audioFile, // Opcional
}, "chefe_laboratorio");
```

### 3. Hook Personalizado

```tsx
import { useChatbot } from "@/hooks/useChatbot";

function MeuComponente() {
  const { state, actions } = useChatbot();
  
  // Adicionar mensagem
  actions.addMessage({
    sender: "user",
    text: "Olá!",
    type: "text"
  });
  
  // Limpar chat
  actions.clearMessages();
}
```

## Personalização

### Temas e Cores

O chatbot usa variáveis CSS personalizadas que podem ser modificadas:

```css
.chatbot-container {
  --chatbot-primary: theme('colors.akin-turquoise');
  --chatbot-primary-hover: theme('colors.akin-turquoise/80');
  --chatbot-background: white;
  --chatbot-border: theme('colors.gray.200');
}
```

### Notificações

Sistema de toast personalizado para feedback do usuário:

```typescript
import { chatbotToast } from "@/components/chatbot/chatbot-toast";

chatbotToast.success("Mensagem enviada!");
chatbotToast.error("Erro ao enviar mensagem");
chatbotToast.info("Nova funcionalidade disponível");
```

## Acessibilidade

- Suporte completo a navegação por teclado
- Tooltips informativos
- Labels apropriados para screen readers
- Contraste adequado de cores
- Animações respeitam `prefers-reduced-motion`

## Performance

- Lazy loading de componentes
- Memoização de cálculos pesados
- Otimização de re-renders
- Cleanup adequado de recursos

## Compatibilidade

- ✅ Suporte a todos os navegadores modernos
- ✅ API de gravação de áudio (getUserMedia)
- ✅ Responsive design para mobile/tablet
- ✅ Suporte a TypeScript completo

## Próximas Funcionalidades

- [ ] Suporte a anexos de arquivo
- [ ] Comandos rápidos (/help, /clear)
- [ ] Histórico persistente de conversas
- [ ] Integração com notificações push
- [ ] Suporte a markdown nas mensagens
- [ ] Modo escuro/claro

## Solução de Problemas

### Microfone não funciona
- Verificar permissões do navegador
- Usar HTTPS em produção
- Verificar compatibilidade do navegador

### Áudio não reproduz
- Verificar políticas de autoplay do navegador
- Certificar-se que o usuário interagiu com a página

### Performance lenta
- Verificar número de mensagens no histórico
- Considerar implementar paginação
- Otimizar imagens e recursos

## Contribuição

Para contribuir com melhorias no chatbot:

1. Criar branch feature
2. Implementar mudanças
3. Testar em diferentes navegadores
4. Submeter pull request

## Licença

Este componente faz parte do sistema AKIN e segue a mesma licença do projeto principal.
