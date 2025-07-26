# Sistema Avançado de Anotações com Classificações e Ontologias

Este sistema aprimorado permite a realização de exames laboratoriais com anotações estruturadas e classificações avançadas de células.

## 🆕 Novas Funcionalidades

### 1. **Ontologias Médicas**
- **Gerenciamento de Ontologias**: Criação, edição e seleção de ontologias específicas para diferentes tipos de exames
- **Categorias Hierárquicas**: Organização de tipos celulares em categorias
- **Características Configuráveis**: Definição de características específicas para cada tipo celular
- **Versionamento**: Controle de versões das ontologias

### 2. **Sistema de Classificação Avançado**
- **Classificação Manual**: Interface intuitiva para classificar células identificadas
- **Sugestões de IA**: Integração com sistemas de inteligência artificial para sugestões automáticas
- **Níveis de Confiança**: Sistema de pontuação para medir a confiança nas classificações
- **Múltiplas Classificações**: Possibilidade de ter classificações alternativas para uma mesma anotação

### 3. **Anotações Estruturadas**
- **Tipos de Anotação**: Classificação das anotações por tipo (identificação celular, medição, observação, etc.)
- **Sistema de Prioridade**: Níveis de prioridade (baixa, média, alta, crítica)
- **Tags e Metadados**: Sistema de tags para organização e busca
- **Anotações Vinculadas**: Possibilidade de vincular anotações relacionadas

### 4. **Estatísticas e Relatórios**
- **Métricas em Tempo Real**: Estatísticas sobre classificações, confiança e progresso
- **Distribuição de Confiança**: Visualização da distribuição dos níveis de confiança
- **Comparação IA vs Manual**: Análise das classificações feitas por IA versus manuais
- **Status de Revisão**: Acompanhamento do status das classificações (pendente, confirmado, rejeitado)

## 🎯 Componentes Principais

### **OntologyManager**
Componente para gerenciar ontologias:
- Navegar e selecionar ontologias existentes
- Criar novas ontologias
- Editar ontologias existentes
- Visualizar detalhes das ontologias

### **ClassificationPanel**
Interface de classificação de células:
- Seleção de tipos celulares
- Configuração de características
- Definição de confiança
- Adição de notas e tags

### **ImageModal Aprimorado**
Modal de anotação expandido com:
- Barra de ferramentas avançada
- Painel de estatísticas
- Integração com ontologias
- Sistema de classificação integrado

## 📊 Tipos de Dados

### **Ontologia**
```typescript
interface Ontology {
  id: string;
  name: string;
  description: string;
  version: string;
  categories: CellCategory[];
  cellTypes: CellType[];
  characteristics: CellCharacteristic[];
  metadata: {
    author: string;
    applicableExamTypes: string[];
  };
}
```

### **Classificação**
```typescript
interface Classification {
  id: string;
  cellTypeId: string;
  confidence: number; // 0-100
  characteristics: Record<string, string>;
  classifiedBy: 'manual' | 'ai' | 'hybrid';
  status: 'pending' | 'confirmed' | 'rejected' | 'needs_review';
}
```

### **Anotação com Classificação**
```typescript
interface AnnotationWithClassification {
  // Campos básicos da anotação
  id: string;
  x: number;
  y: number;
  text: string;
  
  // Novos campos para classificação
  classification?: Classification;
  annotationType: 'cell_identification' | 'measurement' | 'observation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
}
```

## 🚀 Como Usar

### 1. **Selecionando uma Ontologia**
1. Abra o modal de anotação de uma imagem
2. Clique no botão "Ontologia" no cabeçalho
3. Navegue pelas ontologias disponíveis ou crie uma nova
4. Selecione a ontologia adequada para o tipo de exame

### 2. **Criando Anotações Classificadas**
1. Use as ferramentas de desenho para marcar células na imagem
2. Clique no ícone de microscópio na anotação criada
3. Selecione o tipo celular correspondente
4. Configure as características específicas
5. Defina o nível de confiança
6. Adicione tags e notas se necessário
7. Salve a classificação

### 3. **Revisando e Estatísticas**
1. Use o botão "Estatísticas" para visualizar métricas da sessão
2. Monitore a distribuição de confiança das classificações
3. Revise classificações que precisam de atenção especial

## 🔧 Configuração Técnica

### **Dependências Adicionais**
- Tipos TypeScript para sistema de anotações (`@/types/annotation-system`)
- Componentes UI do shadcn/ui
- Ícones do Lucide React

### **Estrutura de Arquivos**
```
src/
├── types/
│   └── annotation-system.ts           # Tipos do sistema
├── app/akin/lab-exams/ready-exam/[patient_id]/
│   ├── components/
│   │   ├── OntologyManager.tsx        # Gerenciador de ontologias
│   │   ├── ClassificationPanel.tsx    # Painel de classificação
│   │   └── selectedCaptureImages.tsx  # Modal de imagens aprimorado
│   └── [exam_id]/
│       └── page.tsx                   # Página principal atualizada
```

## 📈 Benefícios

1. **Padronização**: Uso de ontologias garante consistência nas classificações
2. **Rastreabilidade**: Histórico completo de todas as classificações e revisões
3. **Qualidade**: Sistema de confiança e revisão melhora a precisão
4. **Eficiência**: Sugestões de IA aceleram o processo de classificação
5. **Análise**: Estatísticas detalhadas permitem análise de qualidade
6. **Flexibilidade**: Sistema adaptável a diferentes tipos de exames

## 🔮 Funcionalidades Futuras

- Integração com sistemas LIMS
- Exportação de relatórios em múltiplos formatos
- Sistema de templates de anotação
- Análise comparativa entre examinadores
- Sincronização em tempo real para trabalho colaborativo
- Machine Learning para melhoria contínua das sugestões de IA

## 🛠️ Manutenção e Suporte

Para dúvidas sobre implementação ou uso do sistema, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento.
