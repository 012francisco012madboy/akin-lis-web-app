# Implementação da Nova Sidebar Hierárquica Expandível

## Mudanças Implementadas

### 1. Novo Componente ExpandableAppSidebar
- **Arquivo**: `src/components/layout/sidebarConfig/expandable-app-sidebar.tsx`
- **Funcionalidades**:
  - Sidebar hierárquica que expande submenus em tela cheia
  - Botão "Voltar" para retornar ao menu principal
  - Mantém as autorizações de acesso baseadas no papel do usuário
  - Auto-seleção do item ativo baseado na rota atual
  - Suporte para itens com e sem submenus

### 2. Layout Principal Atualizado
- **Arquivo**: `src/app/akin/layout.tsx`
- **Mudanças**:
  - Substituição do `AppSidebar` pelo `ExpandableAppSidebar`
  - Mantém a funcionalidade do chatbot flutuante
  - Preserva todas as outras funcionalidades existentes

### 3. Layout Opcional Expandível
- **Arquivo**: `src/components/layout/sidebarConfig/expandable-sidebar-layout.tsx`
- **Funcionalidades**:
  - Layout alternativo que pode ser usado em páginas específicas
  - Inclui breadcrumbs personalizados
  - Header responsivo com trigger da sidebar

## Características da Nova Sidebar

### Autorizações de Acesso Mantidas
- **CHEFE**: Acesso completo a todas as funcionalidades
- **TECNICO**: Acesso limitado conforme configuração original
- **RECEPCIONISTA**: Acesso específico para suas funções

### Comportamento Hierárquico
1. **Menu Principal**: Mostra todos os itens principais do sistema
2. **Expansão**: Clique em um item com submenus expande em tela cheia
3. **Navegação**: Itens sem submenus navegam diretamente
4. **Voltar**: Botão para retornar ao menu principal
5. **Estado Ativo**: Destaque automático do item/submenu atual

### Estrutura de Dados
```typescript
interface MenuItem {
  id: string
  title: string
  icon: LucideIcon
  path: string
  access: string[]
  items?: SubMenuItem[]
}
```

## Como Usar

### Uso Automático
A nova sidebar já está ativa no layout principal (`/akin/*`). Todas as rotas dentro do sistema AKIN automaticamente usarão a nova sidebar expandível.

### Uso Opcional
Para páginas específicas que precisem de um layout customizado:

```tsx
import { ExpandableSidebarLayout } from "@/components/layout/sidebarConfig/expandable-sidebar-layout"

export default function MinhaPage() {
  return (
    <ExpandableSidebarLayout>
      {/* Conteúdo da página */}
    </ExpandableSidebarLayout>
  )
}
```

## Configuração de Menu

O menu continua sendo configurado através do arquivo `src/config/app.ts` na seção `APP_CONFIG.ROUTES.MENU`. A nova implementação:

1. **Transforma automaticamente** a estrutura existente para o formato hierárquico
2. **Filtra itens** baseado no papel do usuário
3. **Mantém compatibilidade** com a configuração atual

## Benefícios da Nova Implementação

1. **Melhor UX**: Navegação mais intuitiva com foco em um menu por vez
2. **Responsividade**: Funciona bem em dispositivos móveis
3. **Manutenibilidade**: Código mais organizado e tipado
4. **Flexibilidade**: Suporte para menus profundos sem poluição visual
5. **Acessibilidade**: Melhor contraste e navegação por teclado

## Compatibilidade

- ✅ Mantém todas as autorizações existentes
- ✅ Preserva rotas e navegação
- ✅ Compatível com componentes existentes
- ✅ Não quebra funcionalidades atuais
- ✅ Chatbot mantido na posição original
