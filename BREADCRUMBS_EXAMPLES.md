// Teste da lógica de breadcrumbs - Apenas para documentação

const testRoutes = [
  {
    path: "/akin/dashboard",
    expected: ["Painel Geral"]
  },
  {
    path: "/akin/patient",
    expected: ["Pacientes"]
  },
  {
    path: "/akin/patient/123",
    expected: ["Pacientes", "123"]
  },
  {
    path: "/akin/schedule/new",
    expected: ["Agendamentos", "Novo"]
  },
  {
    path: "/akin/schedule/request",
    expected: ["Agendamentos", "Solicitações"]
  },
  {
    path: "/akin/schedule/completed",
    expected: ["Agendamentos", "Confirmados"]
  },
  {
    path: "/akin/stock-control/dashboard",
    expected: ["Gestão de stock", "Painel"]
  },
  {
    path: "/akin/stock-control/product",
    expected: ["Gestão de stock", "Productos"]
  },
  {
    path: "/akin/stock-control/product/edit/123",
    expected: ["Gestão de stock", "Productos", "Edit", "123"]
  },
  {
    path: "/akin/team-management",
    expected: ["Gestão Equipe"]
  },
  {
    path: "/akin/lab-exams",
    expected: ["Exames Laboratoriais"]
  },
  {
    path: "/akin/report",
    expected: ["Gestão de Laudo"]
  }
];

/* 
Exemplos de como os breadcrumbs funcionam:

1. Rota simples sem subItems:
   /akin/patient → "Pacientes"

2. Rota com subItems:
   /akin/schedule/new → "Agendamentos > Novo"

3. Rota com subpáginas:
   /akin/patient/123 → "Pacientes > 123"

4. Rota complexa com subItems e subpáginas:
   /akin/stock-control/product/edit/123 → "Gestão de stock > Productos > Edit > 123"

Algoritmo:
1. Encontra a melhor correspondência no menu (path mais longo)
2. Se é um subItem, mostra: Menu Principal > SubItem
3. Se tem páginas adicionais, adiciona: Menu Principal > SubItem > Página Extra
4. Se não tem subItems, mostra apenas: Menu Principal
5. Para subpáginas não mapeadas, adiciona os segmentos formatados
*/
