import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Star,
  StarOff,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Bot,
  User,
  Shuffle,
  Eye,
  Save,
  RotateCcw,
  TrendingUp,
  Target,
  Microscope,
  Tag,
  Link,
} from 'lucide-react';
import {
  CellType,
  CellCategory,
  CellCharacteristic,
  Classification,
  AnnotationWithClassification,
  Ontology,
} from '@/types/annotation-system';

interface ClassificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  annotation: AnnotationWithClassification | null;
  ontology: Ontology;
  onSaveClassification: (annotationId: string, classification: Classification) => void;
  onUpdateAnnotation: (annotationId: string, updates: Partial<AnnotationWithClassification>) => void;
  aiSuggestions?: Classification[];
  onRequestAISuggestions: (annotationId: string) => void;
}

export const ClassificationPanel: React.FC<ClassificationPanelProps> = ({
  isOpen,
  onClose,
  annotation,
  ontology,
  onSaveClassification,
  onUpdateAnnotation,
  aiSuggestions,
  onRequestAISuggestions,
}) => {
  const [selectedCellType, setSelectedCellType] = useState<CellType | null>(null);
  const [characteristics, setCharacteristics] = useState<Record<string, string>>({});
  const [confidence, setConfidence] = useState(80);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyPathological, setShowOnlyPathological] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  // Estados para templates e histórico
  const [recentClassifications, setRecentClassifications] = useState<Classification[]>([]);
  const [favoriteTypes, setFavoriteTypes] = useState<string[]>([]);

  // Resetar estado quando anotação muda
  useEffect(() => {
    if (annotation) {
      const currentClassification = annotation.classification;
      if (currentClassification) {
        const cellType = ontology.cellTypes.find(ct => ct.id === currentClassification.cellTypeId);
        setSelectedCellType(cellType || null);
        setCharacteristics(currentClassification.characteristics);
        setConfidence(currentClassification.confidence);
        setNotes(currentClassification.notes || '');
      } else {
        resetForm();
      }

      setTags(annotation.tags || []);
      setPriority(annotation.priority);
    }
  }, [annotation, ontology]);

  const resetForm = () => {
    setSelectedCellType(null);
    setCharacteristics({});
    setConfidence(80);
    setNotes('');
    setTags([]);
    setPriority('medium');
  };

  const filteredCellTypes = ontology.cellTypes.filter(cellType => {
    const matchesSearch = cellType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cellType.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cellType.category.id === selectedCategory;
    const matchesPathological = !showOnlyPathological || cellType.pathological;

    return matchesSearch && matchesCategory && matchesPathological;
  });

  const handleCellTypeSelect = useCallback((cellType: CellType) => {
    setSelectedCellType(cellType);

    // Pré-preencher características obrigatórias
    const defaultCharacteristics: Record<string, string> = {};
    cellType.characteristics.forEach(char => {
      if (char.required && char.possibleValues.length > 0) {
        defaultCharacteristics[char.id] = char.possibleValues[0];
      }
    });
    setCharacteristics(defaultCharacteristics);

    // Ajustar confiança baseado na raridade
    if (cellType.prevalence === 'rare') {
      setConfidence(60);
    } else if (cellType.prevalence === 'uncommon') {
      setConfidence(70);
    } else {
      setConfidence(85);
    }
  }, []);

  const handleCharacteristicChange = (charId: string, value: string) => {
    setCharacteristics(prev => ({
      ...prev,
      [charId]: value
    }));
  };

  const handleSave = () => {
    if (!annotation || !selectedCellType) return;

    const classification: Classification = {
      id: `class_${Date.now()}`,
      cellTypeId: selectedCellType.id,
      confidence,
      characteristics,
      notes: notes.trim() || undefined,
      classifiedBy: 'manual',
      classifiedAt: new Date(),
      status: confidence >= 80 ? 'confirmed' : 'needs_review',
    };

    onSaveClassification(annotation.id, classification);

    // Atualizar anotação com tags e prioridade
    onUpdateAnnotation(annotation.id, {
      tags,
      priority,
      annotationType: 'cell_identification',
    });

    // Adicionar ao histórico de classificações recentes
    setRecentClassifications(prev => [classification, ...prev.slice(0, 9)]);

    onClose();
  };

  const handleApplyAISuggestion = (suggestion: Classification) => {
    const cellType = ontology.cellTypes.find(ct => ct.id === suggestion.cellTypeId);
    if (cellType) {
      setSelectedCellType(cellType);
      setCharacteristics(suggestion.characteristics);
      setConfidence(suggestion.confidence);
      setNotes(suggestion.notes || '');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-600';
    if (conf >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 80) return 'Alta';
    if (conf >= 60) return 'Média';
    return 'Baixa';
  };

  if (!annotation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Microscope className="h-5 w-5" />
            Classificação da Anotação
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[75vh] gap-4">
          {/* Painel esquerdo - Seleção de tipo celular */}
          <div className="w-1/2 border-r pr-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Filtros */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar tipos celulares..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {ontology.categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="pathological"
                      checked={showOnlyPathological}
                      onChange={(e) => setShowOnlyPathological(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="pathological" className="text-sm">
                      Apenas patológicos
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Sugestões de IA */}
              {aiSuggestions && aiSuggestions.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Sugestões de IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aiSuggestions.slice(0, 3).map((suggestion, index) => {
                        const cellType = ontology.cellTypes.find(ct => ct.id === suggestion.cellTypeId);
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50"
                            onClick={() => handleApplyAISuggestion(suggestion)}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{cellType?.name}</p>
                              <p className="text-xs text-gray-500">
                                Confiança: {suggestion.confidence}%
                              </p>
                            </div>
                            <Button size="sm" variant="ghost">
                              Aplicar
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lista de tipos celulares */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Tipos Celulares</h3>
                  <Badge variant="outline">{filteredCellTypes.length}</Badge>
                </div>

                {filteredCellTypes.map(cellType => (
                  <Card
                    key={cellType.id}
                    className={`cursor-pointer transition-all hover:shadow-sm ${selectedCellType?.id === cellType.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                    onClick={() => handleCellTypeSelect(cellType)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: cellType.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{cellType.name}</p>
                            <div className="flex gap-1">
                              {cellType.pathological && (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  Patológico
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {cellType.prevalence === 'common' ? 'Comum' :
                                  cellType.prevalence === 'uncommon' ? 'Incomum' : 'Raro'}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {cellType.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {cellType.category.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Painel direito - Classificação detalhada */}
          <div className="w-1/2 overflow-y-auto">
            {selectedCellType ? (
              <div className="space-y-4">
                {/* Informações do tipo selecionado */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: selectedCellType.color }}
                      />
                      <div>
                        <CardTitle className="text-lg">{selectedCellType.name}</CardTitle>
                        <p className="text-sm text-gray-600">{selectedCellType.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Características */}
                {selectedCellType.characteristics.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Características</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedCellType.characteristics.map(characteristic => (
                        <div key={characteristic.id}>
                          <Label className="text-sm">
                            {characteristic.name}
                            {characteristic.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          <Select
                            value={characteristics[characteristic.id] || ''}
                            onValueChange={(value) => handleCharacteristicChange(characteristic.id, value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              {characteristic.possibleValues.map(value => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            {characteristic.description}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Confiança */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Nível de Confiança</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Confiança: {confidence}%</Label>
                        <Badge variant="outline" className={getConfidenceColor(confidence)}>
                          {getConfidenceLabel(confidence)}
                        </Badge>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={confidence}
                        onChange={(e) => setConfidence(Number(e.target.value))}
                        className="w-full"
                      />
                      <Progress value={confidence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Anotações e Prioridade */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Informações Adicionais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Prioridade</Label>
                      <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="critical">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Notas</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Observações adicionais sobre a classificação..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex gap-2 mt-1 mb-2 flex-wrap">
                        {tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Nova tag..."
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={addTag}>
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Selecione um tipo celular para continuar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2 flex-1">
            {annotation && !aiSuggestions && (
              <Button
                variant="outline"
                onClick={() => onRequestAISuggestions(annotation.id)}
                className="flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                Sugerir com IA
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedCellType}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Classificação
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
