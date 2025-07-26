// Tipos para o sistema avançado de anotações com classificações e ontologias

export interface CellType {
  id: string;
  name: string;
  description: string;
  color: string;
  category: CellCategory;
  characteristics: CellCharacteristic[];
  parentId?: string; // Para hierarquia de tipos de células
  synonyms?: string[];
  prevalence?: 'common' | 'uncommon' | 'rare';
  pathological?: boolean;
}

export interface CellCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  parentCategoryId?: string;
}

export interface CellCharacteristic {
  id: string;
  name: string;
  description: string;
  type: 'morphological' | 'size' | 'color' | 'texture' | 'location' | 'behavior';
  possibleValues: string[];
  required: boolean;
}

export interface Classification {
  id: string;
  cellTypeId: string;
  confidence: number; // 0-100
  characteristics: Record<string, string>; // characteristicId -> value
  notes?: string;
  classifiedBy: 'manual' | 'ai' | 'hybrid';
  classifiedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  status: 'pending' | 'confirmed' | 'rejected' | 'needs_review';
}

export interface Ontology {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  categories: CellCategory[];
  cellTypes: CellType[];
  characteristics: CellCharacteristic[];
  metadata: {
    author: string;
    source?: string;
    references?: string[];
    applicableExamTypes: string[];
  };
}

export interface AnnotationWithClassification {
  id: string;
  figureId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  isOpen: boolean;
  // Novos campos para classificação
  classification?: Classification;
  alternativeClassifications?: Classification[]; // Para múltiplas possibilidades
  annotationType: 'cell_identification' | 'measurement' | 'observation' | 'artifact' | 'quality_assessment';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  linkedAnnotations?: string[]; // IDs de outras anotações relacionadas
}

export interface ExamSession {
  id: string;
  examId: string;
  patientId: string;
  ontologyId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'in_progress' | 'completed' | 'paused' | 'cancelled';
  annotationsCount: number;
  classificationsCount: number;
  aiAssistanceUsed: boolean;
  qualityScore?: number;
  reviewRequired: boolean;
}

export interface StatisticsData {
  totalAnnotations: number;
  classificationsByType: Record<string, number>;
  classificationsByCategory: Record<string, number>;
  confidenceDistribution: {
    high: number; // 80-100%
    medium: number; // 50-79%
    low: number; // 0-49%
  };
  aiVsManualClassifications: {
    ai: number;
    manual: number;
    hybrid: number;
  };
  reviewStatus: {
    pending: number;
    confirmed: number;
    rejected: number;
    needsReview: number;
  };
}

// Tipos para ferramentas de busca e filtros
export interface SearchFilters {
  cellTypes?: string[];
  categories?: string[];
  confidenceRange?: [number, number];
  classificationStatus?: Classification['status'][];
  annotationType?: AnnotationWithClassification['annotationType'][];
  priority?: AnnotationWithClassification['priority'][];
  dateRange?: [Date, Date];
  classifiedBy?: Classification['classifiedBy'][];
}

export interface AnnotationTemplate {
  id: string;
  name: string;
  description: string;
  cellTypeId: string;
  defaultCharacteristics: Record<string, string>;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
}

// Tipos para exportação e relatórios
export interface ExportOptions {
  format: 'json' | 'xml' | 'csv' | 'pdf';
  includeImages: boolean;
  includeClassifications: boolean;
  includeStatistics: boolean;
  anonymize: boolean;
  compressionLevel?: 'none' | 'low' | 'medium' | 'high';
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'required_characteristic' | 'confidence_threshold' | 'cell_count_limit' | 'spatial_relationship';
  parameters: Record<string, any>;
  isActive: boolean;
  severity: 'error' | 'warning' | 'info';
}

export interface QualityMetrics {
  annotationQuality: number; // 0-100
  classificationAccuracy: number; // 0-100
  interAnnotatorAgreement?: number; // 0-100
  completenessScore: number; // 0-100
  consistencyScore: number; // 0-100
  recommendations: string[];
}
