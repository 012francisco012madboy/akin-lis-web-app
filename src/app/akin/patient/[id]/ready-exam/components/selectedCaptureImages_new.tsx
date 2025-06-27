import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import Konva from "konva";
import { ___showSuccessToastNotification } from "@/lib/sonner";
import {
  MousePointer2,
  Pencil,
  Hand,
  ZoomIn,
  ZoomOut,
  Square,
  Circle as CircleIcon,
  Minus,
  Type,
  ArrowRight,
  Download,
  RotateCcw,
  X,
  Save,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

interface ImageModalProps {
  selectedImage: string | null;
  notes?: Record<string, string>;
  handleNoteChanged?: (image: string, value: string) => void;
  setSelectedImage: (image: string | null) => void;
  moreFuncIsShow?: boolean;
  setImageAnnotations?: (annotations: Record<string, Shape[]>) => void;
}

export interface Shape {
  id: string;
  type: "rect" | "circle" | "line" | "arrow" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  text?: string;
  fontSize?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface Figure {
  id: string;
  name: string;
  shape: "rectangle" | "circle" | "line" | "arrow" | "text";
  color: string;
}

export interface Annotation {
  id: string;
  figureId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  isOpen: boolean;
}

export type Tool = "select" | "draw" | "pan" | "zoom";

export const ImageModal: React.FC<ImageModalProps> = ({
  selectedImage,
  notes,
  setSelectedImage,
  setImageAnnotations,
  moreFuncIsShow,
  handleNoteChanged
}) => {
  // Estados para ferramentas e formas
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [figures, setFigures] = useState<Figure[]>([
    { id: "1", name: "Retângulo", shape: "rectangle", color: "#ef4444" },
    { id: "2", name: "Círculo", shape: "circle", color: "#3b82f6" },
    { id: "3", name: "Linha", shape: "line", color: "#10b981" },
    { id: "4", name: "Seta", shape: "arrow", color: "#f59e0b" },
    { id: "5", name: "Texto", shape: "text", color: "#8b5cf6" },
  ]);

  // Estados para anotações
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  // Estados para canvas
  const [zoomLevel, setZoomLevel] = useState(100);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  // Estados legacy para compatibilidade
  const [shapesByImage, setShapesByImage] = useState<Record<string, Shape[]>>({});
  const [shapeNotesByImage, setShapeNotesByImage] = useState<Record<string, Record<string, string>>>({});

  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Funções para gerenciar anotações
  const addAnnotation = useCallback((annotation: Omit<Annotation, "id">) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: Date.now().toString(),
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
  }, []);

  const updateAnnotation = useCallback((id: string, updates: Partial<Annotation>) => {
    setAnnotations((prev) => prev.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann)));
  }, []);

  const deleteAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
    if (selectedAnnotation === id) {
      setSelectedAnnotation(null);
    }
  }, [selectedAnnotation]);

  // Funções para gerenciar figuras
  const addFigure = useCallback((figure: Omit<Figure, "id">) => {
    const newFigure: Figure = {
      ...figure,
      id: Date.now().toString(),
    };
    setFigures((prev) => [...prev, newFigure]);
  }, []);

  const updateFigure = useCallback((id: string, updates: Partial<Figure>) => {
    setFigures((prev) => prev.map((fig) => (fig.id === id ? { ...fig, ...updates } : fig)));
  }, []);

  const deleteFigure = useCallback((id: string) => {
    setFigures((prev) => prev.filter((fig) => fig.id !== id));
    setAnnotations((prev) => prev.filter((ann) => ann.figureId !== id));
    if (selectedFigure?.id === id) {
      setSelectedFigure(null);
    }
  }, [selectedFigure]);

  const handleToolChange = useCallback((tool: Tool) => {
    setActiveTool(tool);
    if (tool !== "draw") {
      setSelectedFigure(null);
    }
  }, []);

  const handleFigureSelect = useCallback((figure: Figure | null) => {
    setSelectedFigure(figure);
    if (figure) {
      setActiveTool("draw");
    }
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case "v":
          setActiveTool("select");
          break;
        case "d":
          setActiveTool("draw");
          break;
        case "h":
          setActiveTool("pan");
          break;
        case "z":
          setActiveTool("zoom");
          break;
        case "escape":
          setSelectedAnnotation(null);
          setSelectedFigure(null);
          break;
        case "delete":
        case "backspace":
          if (selectedAnnotation) {
            deleteAnnotation(selectedAnnotation);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAnnotation, deleteAnnotation]);

  const handleSaveAnnotations = () => {
    if (!selectedImage) return;

    const annotationData = {
      shapes: shapesByImage[selectedImage] || [],
      shapeNotes: shapeNotesByImage[selectedImage] || {},
      annotations: annotations,
    };

    if (setImageAnnotations) {
      //@ts-ignore
      setImageAnnotations((prev) => ({
        ...prev,
        [selectedImage]: annotationData,
      }));
    }

    ___showSuccessToastNotification({ message: "Anotações salvas com sucesso!" });
    console.log(`✅ Anotações salvas para ${selectedImage}:`, annotationData);
  };

  // Inicialização quando uma nova imagem é selecionada
  useEffect(() => {
    if (selectedImage) {
      setShapesByImage((prev) => ({
        ...prev,
        [selectedImage]: prev[selectedImage] || [],
      }));

      setShapeNotesByImage((prev) => ({
        ...prev,
        [selectedImage]: prev[selectedImage] || {},
      }));
    }
  }, [selectedImage]);

  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
      <DialogContent className="max-w-7xl h-full lg:h-[95%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sistema de Anotação de Imagens</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <AnnotationToolbar
          activeTool={activeTool}
          selectedFigure={selectedFigure}
          figures={figures}
          zoomLevel={zoomLevel}
          onToolChange={handleToolChange}
          onFigureSelect={handleFigureSelect}
          onZoomChange={setZoomLevel}
          onExportImage={() => {
            const event = new CustomEvent("exportImage");
            window.dispatchEvent(event);
          }}
        />

        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* Painel lateral esquerdo */}
          <div className="w-full lg:w-80 space-y-4">
            <FigureManager
              figures={figures}
              selectedFigure={selectedFigure}
              onAddFigure={addFigure}
              onUpdateFigure={updateFigure}
              onDeleteFigure={deleteFigure}
              onSelectFigure={handleFigureSelect}
            />

            <AnnotationPanel
              annotations={annotations}
              figures={figures}
              selectedAnnotation={selectedAnnotation}
              selectedFigure={selectedFigure}
              onSelectAnnotation={setSelectedAnnotation}
              onSelectFigure={handleFigureSelect}
              onUpdateAnnotation={updateAnnotation}
              onDeleteAnnotation={deleteAnnotation}
            />
          </div>

          {/* Área principal do canvas */}
          <div className="flex-1">
            <AnnotationCanvas
              imageUrl={selectedImage}
              annotations={annotations}
              figures={figures}
              selectedFigure={selectedFigure}
              activeTool={activeTool}
              selectedAnnotation={selectedAnnotation}
              zoomLevel={zoomLevel}
              canvasPosition={canvasPosition}
              onAddAnnotation={addAnnotation}
              onUpdateAnnotation={updateAnnotation}
              onDeleteAnnotation={deleteAnnotation}
              onSelectAnnotation={setSelectedAnnotation}
              onCanvasPositionChange={setCanvasPosition}
            />
          </div>

          {/* Área de notas */}
          <div className="w-full lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Notas da Imagem</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes?.[selectedImage] || ""}
                  onChange={(e) => handleNoteChanged?.(selectedImage!, e.target.value)}
                  placeholder="Anotações gerais para esta imagem..."
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar
          activeTool={activeTool}
          selectedFigure={selectedFigure}
          selectedAnnotation={selectedAnnotation}
          zoomLevel={zoomLevel}
          annotationsCount={annotations.length}
          canvasPosition={canvasPosition}
        />

        <DialogFooter>
          <Button onClick={handleSaveAnnotations} className="bg-blue-500 hover:bg-blue-600">
            <Save className="h-4 w-4 mr-2" />
            Salvar Anotações
          </Button>
          <Button variant="outline" onClick={() => setSelectedImage(null)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Componente Toolbar
const AnnotationToolbar: React.FC<{
  activeTool: Tool;
  selectedFigure: Figure | null;
  figures: Figure[];
  zoomLevel: number;
  onToolChange: (tool: Tool) => void;
  onFigureSelect: (figure: Figure | null) => void;
  onZoomChange: (zoom: number) => void;
  onExportImage: () => void;
}> = ({ activeTool, selectedFigure, figures, zoomLevel, onToolChange, onFigureSelect, onZoomChange, onExportImage }) => {
  const SHAPE_ICONS = {
    rectangle: Square,
    circle: CircleIcon,
    line: Minus,
    arrow: ArrowRight,
    text: Type,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Ferramentas principais */}
        <div className="flex items-center gap-1">
          <Button
            variant={activeTool === "select" ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange("select")}
            title="Selecionar (V)"
          >
            <MousePointer2 className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "draw" ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange("draw")}
            title="Desenhar (D)"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "pan" ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange("pan")}
            title="Mover (H)"
          >
            <Hand className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "zoom" ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange("zoom")}
            title="Zoom (Z)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Seletor de figuras */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Figura:</span>
          <Select
            value={selectedFigure?.id || "none"}
            onValueChange={(value) => {
              if (value === "none") {
                onFigureSelect(null);
              } else {
                const figure = figures.find((f) => f.id === value);
                onFigureSelect(figure || null);
              }
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecionar figura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Nenhuma
                </div>
              </SelectItem>
              {figures.map((figure) => {
                const Icon = SHAPE_ICONS[figure.shape];
                return (
                  <SelectItem key={figure.id} value={figure.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {figure.name}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {selectedFigure && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFigure.color }} />
              {selectedFigure.name}
            </Badge>
          )}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Controles de zoom */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Zoom:</span>
          <Select value={zoomLevel.toString()} onValueChange={(value) => onZoomChange(Number.parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="125">125%</SelectItem>
              <SelectItem value="150">150%</SelectItem>
              <SelectItem value="200">200%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        {/* Ações */}
        <div className="flex items-center gap-1">
          <Button onClick={onExportImage} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente Gerenciador de Figuras
const FigureManager: React.FC<{
  figures: Figure[];
  selectedFigure: Figure | null;
  onAddFigure: (figure: Omit<Figure, "id">) => void;
  onUpdateFigure: (id: string, updates: Partial<Figure>) => void;
  onDeleteFigure: (id: string) => void;
  onSelectFigure: (figure: Figure | null) => void;
}> = ({ figures, selectedFigure, onAddFigure, onDeleteFigure, onSelectFigure }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shape: "rectangle" as const,
    color: "#ef4444",
  });

  const SHAPE_OPTIONS = [
    { value: "rectangle", label: "Retângulo" },
    { value: "circle", label: "Círculo" },
    { value: "line", label: "Linha" },
    { value: "arrow", label: "Seta" },
    { value: "text", label: "Texto" },
  ];

  const COLOR_OPTIONS = [
    "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e",
    "#10b981", "#3b82f6", "#60a5fa", "#81e6d9", "#ec4899",
  ];

  const handleAddFigure = () => {
    if (formData.name.trim()) {
      onAddFigure(formData);
      setFormData({ name: "", shape: "rectangle", color: "#ef4444" });
      setShowAddDialog(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Gerenciar Figuras</CardTitle>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Figura</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="figure-name">Nome</Label>
                  <Input
                    id="figure-name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da figura"
                  />
                </div>

                <div>
                  <Label htmlFor="figure-shape">Formato</Label>
                  <Select
                    value={formData.shape}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, shape: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SHAPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cor</Label>
                  <div className="grid grid-cols-10 gap-1 mt-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 ${formData.color === color ? "border-gray-900" : "border-gray-300"
                          }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData((prev) => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddFigure}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {figures.map((figure) => (
          <Card key={figure.id} className="border-l-4" style={{ borderLeftColor: figure.color }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: figure.color }} />
                  <span className="text-sm font-medium">{figure.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {figure.shape}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={selectedFigure?.id === figure.id ? "default" : "ghost"}
                    onClick={() => onSelectFigure(selectedFigure?.id === figure.id ? null : figure)}
                  >
                    {selectedFigure?.id === figure.id ? "Ativo" : "Usar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteFigure(figure.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

// Componente Painel de Anotações
const AnnotationPanel: React.FC<{
  annotations: Annotation[];
  figures: Figure[];
  selectedAnnotation: string | null;
  selectedFigure: Figure | null;
  onSelectAnnotation: (id: string | null) => void;
  onSelectFigure: (figure: Figure) => void;
  onUpdateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  onDeleteAnnotation: (id: string) => void;
}> = ({ annotations, figures, selectedAnnotation, onSelectAnnotation, onUpdateAnnotation, onDeleteAnnotation }) => {
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleEditStart = (annotation: Annotation) => {
    setEditingAnnotation(annotation.id);
    setEditText(annotation.text);
  };

  const handleEditSave = (id: string) => {
    onUpdateAnnotation(id, { text: editText });
    setEditingAnnotation(null);
    setEditText("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Anotações ({annotations.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {annotations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Nenhuma anotação criada</p>
        ) : (
          annotations.map((annotation, index) => {
            const figure = figures.find((f) => f.id === annotation.figureId);
            if (!figure) return null;

            return (
              <Card
                key={annotation.id}
                className={`border-l-4 cursor-pointer ${selectedAnnotation === annotation.id ? "bg-blue-50" : ""
                  }`}
                style={{ borderLeftColor: figure.color }}
                onClick={() => onSelectAnnotation(selectedAnnotation === annotation.id ? null : annotation.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Anotação {index + 1}</span>
                      <Badge variant="secondary" className="text-xs">
                        {figure.name}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAnnotation(annotation.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {editingAnnotation === annotation.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="text-sm"
                        rows={3}
                      />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleEditSave(annotation.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingAnnotation(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">{annotation.text || "Sem texto"}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(annotation);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

// Componente Canvas de Anotação
const AnnotationCanvas: React.FC<{
  imageUrl: string;
  annotations: Annotation[];
  figures: Figure[];
  selectedFigure: Figure | null;
  activeTool: Tool;
  selectedAnnotation: string | null;
  zoomLevel: number;
  canvasPosition: { x: number; y: number };
  onAddAnnotation: (annotation: Omit<Annotation, "id">) => void;
  onUpdateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  onDeleteAnnotation: (id: string) => void;
  onSelectAnnotation: (id: string | null) => void;
  onCanvasPositionChange: (position: { x: number; y: number }) => void;
}> = ({
  imageUrl,
  annotations,
  figures,
  selectedFigure,
  activeTool,
  selectedAnnotation,
  zoomLevel,
  onAddAnnotation,
  onSelectAnnotation
}) => {
    const stageRef = useRef<Konva.Stage>(null);

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (activeTool === "select") {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
          onSelectAnnotation(null);
        }
      } else if (activeTool === "draw" && selectedFigure) {
        const stage = e.target.getStage();
        const pointer = stage?.getPointerPosition();
        if (!pointer) return;

        const newAnnotation: Omit<Annotation, "id"> = {
          figureId: selectedFigure.id,
          x: pointer.x / (zoomLevel / 100),
          y: pointer.y / (zoomLevel / 100),
          width: 100,
          height: 50,
          text: "",
          isOpen: false,
        };

        onAddAnnotation(newAnnotation);
      }
    };

    const renderShape = (annotation: Annotation) => {
      const figure = figures.find(f => f.id === annotation.figureId);
      if (!figure) return null;

      const scale = zoomLevel / 100;
      const isSelected = selectedAnnotation === annotation.id;

      const commonProps = {
        key: annotation.id,
        x: annotation.x * scale,
        y: annotation.y * scale,
        fill: figure.color + (isSelected ? "80" : "40"),
        stroke: figure.color,
        strokeWidth: isSelected ? 3 : 2,
        draggable: activeTool === "select",
        onClick: () => onSelectAnnotation(annotation.id),
      };

      switch (figure.shape) {
        case "rectangle":
          return (
            <Rect
              {...commonProps}
              width={annotation.width * scale}
              height={annotation.height * scale}
            />
          );
        case "circle":
          return (
            <Circle
              {...commonProps}
              radius={Math.min(annotation.width, annotation.height) * scale / 2}
            />
          );
        case "line":
          return (
            <Line
              {...commonProps}
              points={[0, 0, annotation.width * scale, annotation.height * scale]}
            />
          );
        default:
          return null;
      }
    };

    return (
      <Card>
        <CardContent className="p-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: "500px" }}>
            <img
              src={imageUrl}
              alt="Annotation target"
              className="max-w-full h-auto"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top left" }}
            />
            <Stage
              width={800}
              height={600}
              onClick={handleStageClick}
              ref={stageRef}
              className="absolute top-0 left-0"
            >
              <Layer>
                {annotations.map(renderShape)}
              </Layer>
            </Stage>
          </div>
        </CardContent>
      </Card>
    );
  };

// Componente Status Bar
const StatusBar: React.FC<{
  activeTool: Tool;
  selectedFigure: Figure | null;
  selectedAnnotation: string | null;
  zoomLevel: number;
  annotationsCount: number;
  canvasPosition: { x: number; y: number };
}> = ({ activeTool, selectedFigure, selectedAnnotation, zoomLevel, annotationsCount }) => {
  const TOOL_LABELS = {
    select: "Seleção",
    draw: "Desenho",
    pan: "Navegação",
    zoom: "Zoom",
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Ferramenta:</span>
          <Badge variant="outline">{TOOL_LABELS[activeTool]}</Badge>
        </div>

        <Separator orientation="vertical" className="h-4" />

        <div>
          Anotações: <span className="font-medium">{annotationsCount}</span>
        </div>

        {selectedFigure && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span>Figura ativa:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFigure.color }} />
                {selectedFigure.name}
              </Badge>
            </div>
          </>
        )}

        {selectedAnnotation && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <div>
              <Badge variant="default">Anotação selecionada</Badge>
            </div>
          </>
        )}

        <div className="flex-1" />

        <div>
          Zoom: <span className="font-medium">{zoomLevel}%</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        <div className="text-xs">
          Atalhos: V-Selecionar | D-Desenhar | H-Mover | Z-Zoom | ESC-Desselecionar | DEL-Excluir
        </div>
      </div>
    </div>
  );
};
