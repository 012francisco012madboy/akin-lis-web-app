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

### 4. Breadcrumbs Dinâmicos
- **Arquivo**: `src/app/akin/layout.tsx`
- **Funcionalidades**:
  - Geração automática de breadcrumbs baseada na URL atual
  - Integração com a estrutura do menu para nomes corretos
  - Cache com useMemo para performance
  - Estilização consistente com o tema AKIN

### 5. Hook de Estado Personalizado
- **Arquivo**: `src/hooks/use-sidebar-state.tsx`
- **Funcionalidades**:
  - Gerenciamento de estado da sidebar com localStorage
  - Persistência automática do estado
  - Funções otimizadas com useCallback
  - Limpeza de estado quando necessário

### 6. Layout Opcional Expandível
- **Arquivo**: `src/components/layout/sidebarConfig/expandable-sidebar-layout.tsx`
- **Funcionalidades**:
  - Layout alternativo que pode ser usado em páginas específicas
  - Inclui breadcrumbs personalizados
  - Header responsivo com trigger da sidebar

## Características da Nova Sidebar

### Breadcrumbs Dinâmicos
- **Geração Automática**: Baseado na URL atual e estrutura do menu
- **Navegação Inteligente**: Links funcionais para navegação rápida
- **Performance**: Cache com useMemo para evitar recálculos
- **Integração**: Usa os dados do APP_CONFIG.ROUTES.MENU

### Persistência de Estado
- **LocalStorage**: O estado da sidebar é salvo automaticamente no localStorage
- **Reload Seguro**: Após reload da página, a sidebar mantém o estado expandido
- **URL-Based**: A sidebar se posiciona automaticamente baseado na URL atual
- **Navegação Direta**: URLs de submenus expandem automaticamente o menu pai

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
6. **Auto-Expansão**: Se a URL atual for um submenu, expande automaticamente

### Estrutura de Breadcrumbs

### Exemplos de Breadcrumbs por Rota:

| Rota | Breadcrumbs Gerados |
|------|-------------------|
| `/akin/dashboard` | Painel Geral |
| `/akin/patient` | Pacientes |
| `/akin/schedule/new` | Agendamentos > Novo |
| `/akin/schedule/request` | Agendamentos > Solicitações |
| `/akin/stock-control/dashboard` | Gestão de stock > Painel |
| `/akin/stock-control/product` | Gestão de stock > Productos |
| `/akin/team-management` | Gestão Equipe |
| `/akin/patient/123` | Pacientes > 123 |

### Lógica dos Breadcrumbs:
1. **Item único**: Para páginas principais sem subItems (ex: Pacientes)
2. **Item principal > SubItem**: Para páginas de submenus (ex: Agendamentos > Novo)
3. **Hierarquia profunda**: Para subpáginas não mapeadas (ex: Pacientes > ID do paciente)
4. **Melhor correspondência**: Usa o path mais específico para determinar a hierarquia
5. **Fallback inteligente**: Formata nomes baseado na URL quando não encontra no menu

## Estrutura de Dados
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

## Exemplos de Uso

### Cenário 1: Usuário navega para submenu
1. Usuário acessa `/akin/schedule/new`
2. Sidebar automaticamente expande o menu "Agendamentos"
3. Submenu "Novo" fica destacado
4. Estado é salvo no localStorage

### Cenário 2: Reload da página
1. Usuário está em `/akin/stock-control/product`
2. Usuário recarrega a página (F5)
3. Sidebar mantém o menu "Gestão de stock" expandido
4. Submenu "Productos" continua destacado

### Cenário 3: Navegação direta por URL
1. Usuário cola a URL `/akin/team-management` na barra de endereços
2. Sidebar posiciona no item "Gestão Equipe" (sem expandir, pois não tem submenus)
3. Item fica destacado automaticamente

### Cenário 4: Breadcrumbs dinâmicos
1. Usuário navega para `/akin/stock-control/product`
2. Breadcrumbs mostram: `Gestão de stock > Productos`
3. "Gestão de stock" é clicável para navegação rápida
4. "Productos" é a página atual (não clicável)

### Cenário 5: Navegação por breadcrumbs
1. Usuário está em uma página como `/akin/schedule/new`
2. Breadcrumbs: `Agendamentos > Novo`
3. Usuário clica em "Agendamentos" nos breadcrumbs
4. Navega para `/akin/schedule/new` (path padrão do menu principal)

### Cenário 6: Páginas sem submenus
1. Usuário acessa `/akin/patient`
2. Breadcrumbs mostram apenas: `Pacientes`
3. Não há item pai, então mostra apenas o nome da seção atual

### Uso do Hook Personalizado
```typescript
import { useSidebarState } from "@/hooks/use-sidebar-state"

function MeuComponente() {
  const { 
    expandedMenu, 
    selectedItem, 
    selectedSubItem, 
    updateSidebarState,
    clearSidebarState 
  } = useSidebarState()

  // Expandir um menu programaticamente
  const expandScheduleMenu = () => {
    updateSidebarState({
      expandedMenu: "agendamentos",
      selectedItem: "agendamentos"
    })
  }

  // Limpar estado da sidebar
  const resetSidebar = () => {
    clearSidebarState()
  }
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
