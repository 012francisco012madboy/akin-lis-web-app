import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  Copy,
  Share,
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import {
  Ontology,
  CellType,
  CellCategory,
  CellCharacteristic,
  ValidationRule
} from '@/types/annotation-system';

interface OntologyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentOntology?: Ontology;
  onSelectOntology: (ontology: Ontology) => void;
  onCreateOntology: (ontology: Omit<Ontology, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateOntology: (id: string, updates: Partial<Ontology>) => void;
  onDeleteOntology: (id: string) => void;
}

export const OntologyManager: React.FC<OntologyManagerProps> = ({
  isOpen,
  onClose,
  currentOntology,
  onSelectOntology,
  onCreateOntology,
  onUpdateOntology,
  onDeleteOntology,
}) => {
  const [ontologies, setOntologies] = useState<Ontology[]>([]);
  const [selectedOntology, setSelectedOntology] = useState<Ontology | null>(currentOntology || null);
  const [editingOntology, setEditingOntology] = useState<Ontology | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'edit'>('browse');

  // Estados para criação/edição
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    author: '',
    source: '',
    references: '',
    applicableExamTypes: '',
  });

  const [categories, setCategories] = useState<CellCategory[]>([]);
  const [cellTypes, setCellTypes] = useState<CellType[]>([]);
  const [characteristics, setCharacteristics] = useState<CellCharacteristic[]>([]);

  // Mock data - Em produção, isso viria de uma API
  useEffect(() => {
    const mockOntologies: Ontology[] = [
      {
        id: '1',
        name: 'Ontologia Hematológica Básica',
        description: 'Classificação básica de células sanguíneas para exames hematológicos',
        version: '2.1.0',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-07-20'),
        isActive: true,
        categories: [
          {
            id: 'hemaceas',
            name: 'Hemácias',
            description: 'Glóbulos vermelhos e suas variações',
            color: '#dc2626',
          },
          {
            id: 'leucocitos',
            name: 'Leucócitos',
            description: 'Glóbulos brancos e subtipos',
            color: '#2563eb',
          },
          {
            id: 'plaquetas',
            name: 'Plaquetas',
            description: 'Elementos figurados da coagulação',
            color: '#7c3aed',
          },
        ],
        cellTypes: [
          {
            id: 'hemacea_normal',
            name: 'Hemácia Normal',
            description: 'Eritrócito com morfologia normal',
            color: '#dc2626',
            category: {
              id: 'hemaceas',
              name: 'Hemácias',
              description: 'Glóbulos vermelhos e suas variações',
              color: '#dc2626',
            },
            characteristics: [],
            prevalence: 'common',
            pathological: false,
          },
          {
            id: 'hemacea_anisocitose',
            name: 'Hemácia com Anisocitose',
            description: 'Eritrócito com variação anormal de tamanho',
            color: '#ea580c',
            category: {
              id: 'hemaceas',
              name: 'Hemácias',
              description: 'Glóbulos vermelhos e suas variações',
              color: '#dc2626',
            },
            characteristics: [],
            prevalence: 'uncommon',
            pathological: true,
          },
        ],
        characteristics: [
          {
            id: 'tamanho',
            name: 'Tamanho',
            description: 'Diâmetro da célula em micrômetros',
            type: 'size',
            possibleValues: ['microcítica', 'normocítica', 'macrocítica'],
            required: true,
          },
          {
            id: 'cor',
            name: 'Coloração',
            description: 'Intensidade da coloração celular',
            type: 'color',
            possibleValues: ['hipocrômica', 'normocrômica', 'hipercrômica'],
            required: true,
          },
        ],
        metadata: {
          author: 'Dr. Ana Silva',
          source: 'Manual de Hematologia Clínica',
          references: ['ISBN: 978-85-412-3456-7', 'DOI: 10.1016/j.hem.2024.01.001'],
          applicableExamTypes: ['hemograma', 'esfregaço_sanguíneo'],
        },
      },
      {
        id: '2',
        name: 'Parasitologia - Malária',
        description: 'Identificação de parasitas da malária em amostras sanguíneas',
        version: '1.5.2',
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-07-15'),
        isActive: true,
        categories: [
          {
            id: 'plasmodium',
            name: 'Plasmodium',
            description: 'Parasitas causadores da malária',
            color: '#059669',
          },
        ],
        cellTypes: [
          {
            id: 'plasmodium_falciparum',
            name: 'Plasmodium falciparum',
            description: 'Espécie mais grave de malária',
            color: '#dc2626',
            category: {
              id: 'plasmodium',
              name: 'Plasmodium',
              description: 'Parasitas causadores da malária',
              color: '#059669',
            },
            characteristics: [],
            prevalence: 'uncommon',
            pathological: true,
          },
        ],
        characteristics: [],
        metadata: {
          author: 'Dr. Carlos Oliveira',
          source: 'OMS - Diretrizes para Diagnóstico de Malária',
          references: ['WHO/HTM/GMP/2023.01'],
          applicableExamTypes: ['gota_espessa', 'esfregaço_fino'],
        },
      },
    ];

    setOntologies(mockOntologies);
    if (currentOntology) {
      setSelectedOntology(currentOntology);
    }
  }, [currentOntology]);

  const filteredOntologies = ontologies.filter(ont =>
    ont.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ont.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ont.metadata.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOntology = (ontology: Ontology) => {
    setSelectedOntology(ontology);
    onSelectOntology(ontology);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setActiveTab('create');
    setFormData({
      name: '',
      description: '',
      version: '1.0.0',
      author: '',
      source: '',
      references: '',
      applicableExamTypes: '',
    });
    setCategories([]);
    setCellTypes([]);
    setCharacteristics([]);
  };

  const handleEdit = (ontology: Ontology) => {
    setEditingOntology(ontology);
    setActiveTab('edit');
    setFormData({
      name: ontology.name,
      description: ontology.description,
      version: ontology.version,
      author: ontology.metadata.author,
      source: ontology.metadata.source || '',
      references: ontology.metadata.references?.join('\n') || '',
      applicableExamTypes: ontology.metadata.applicableExamTypes.join(', '),
    });
    setCategories([...ontology.categories]);
    setCellTypes([...ontology.cellTypes]);
    setCharacteristics([...ontology.characteristics]);
  };

  const handleSave = () => {
    const ontologyData = {
      name: formData.name,
      description: formData.description,
      version: formData.version,
      isActive: true,
      categories,
      cellTypes,
      characteristics,
      metadata: {
        author: formData.author,
        source: formData.source,
        references: formData.references.split('\n').filter(ref => ref.trim()),
        applicableExamTypes: formData.applicableExamTypes.split(',').map(type => type.trim()),
      },
    };

    if (isCreating) {
      onCreateOntology(ontologyData);
      setIsCreating(false);
    } else if (editingOntology) {
      onUpdateOntology(editingOntology.id, ontologyData);
      setEditingOntology(null);
    }

    setActiveTab('browse');
  };

  const addCategory = () => {
    const newCategory: CellCategory = {
      id: `category_${Date.now()}`,
      name: `Nova Categoria ${categories.length + 1}`,
      description: '',
      color: '#6b7280',
    };
    setCategories([...categories, newCategory]);
  };

  const addCellType = () => {
    if (categories.length === 0) {
      alert('Adicione pelo menos uma categoria primeiro');
      return;
    }

    const newCellType: CellType = {
      id: `celltype_${Date.now()}`,
      name: `Novo Tipo Celular ${cellTypes.length + 1}`,
      description: '',
      color: '#6b7280',
      category: categories[0],
      characteristics: [],
      prevalence: 'common',
      pathological: false,
    };
    setCellTypes([...cellTypes, newCellType]);
  };

  const addCharacteristic = () => {
    const newCharacteristic: CellCharacteristic = {
      id: `char_${Date.now()}`,
      name: `Nova Característica ${characteristics.length + 1}`,
      description: '',
      type: 'morphological',
      possibleValues: ['valor1', 'valor2'],
      required: false,
    };
    setCharacteristics([...characteristics, newCharacteristic]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gerenciador de Ontologias
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Navegar</TabsTrigger>
            <TabsTrigger value="create">Criar Nova</TabsTrigger>
            <TabsTrigger value="edit" disabled={!editingOntology}>Editar</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Barra de busca */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar ontologias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleCreateNew} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Ontologia
                </Button>
              </div>

              {/* Lista de ontologias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOntologies.map((ontology) => (
                  <Card
                    key={ontology.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedOntology?.id === ontology.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                    onClick={() => handleSelectOntology(ontology)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{ontology.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">v{ontology.version}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant={ontology.isActive ? "default" : "secondary"}>
                            {ontology.isActive ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-3">{ontology.description}</p>

                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Categorias:</span>
                          <Badge variant="outline">{ontology.categories.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Tipos celulares:</span>
                          <Badge variant="outline">{ontology.cellTypes.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Características:</span>
                          <Badge variant="outline">{ontology.characteristics.length}</Badge>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Por {ontology.metadata.author}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(ontology);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Implementar visualização detalhada
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteOntology(ontology.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Ontologia</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Ontologia Hematológica"
                      />
                    </div>
                    <div>
                      <Label htmlFor="version">Versão</Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        placeholder="1.0.0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição detalhada da ontologia e seu propósito..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">Autor</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Nome do autor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="source">Fonte</Label>
                      <Input
                        id="source"
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        placeholder="Manual, livro, artigo..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seções para categorias, tipos celulares e características */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Categorias</CardTitle>
                    <Button onClick={addCategory} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Categoria
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <div key={category.id} className="flex items-center gap-2 p-2 border rounded">
                        <Input
                          value={category.name}
                          onChange={(e) => {
                            const updated = [...categories];
                            updated[index] = { ...category, name: e.target.value };
                            setCategories(updated);
                          }}
                          placeholder="Nome da categoria"
                          className="flex-1"
                        />
                        <input
                          type="color"
                          value={category.color}
                          onChange={(e) => {
                            const updated = [...categories];
                            updated[index] = { ...category, color: e.target.value };
                            setCategories(updated);
                          }}
                          className="w-8 h-8 rounded border"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCategories(categories.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActiveTab('browse')}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={!formData.name.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Ontologia
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="h-[70vh] overflow-y-auto">
            {editingOntology && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Editando: <strong>{editingOntology.name}</strong>
                </p>
                {/* Conteúdo similar ao create, mas com dados preenchidos */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setActiveTab('browse')}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
