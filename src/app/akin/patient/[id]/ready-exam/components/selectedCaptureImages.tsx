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

    // Remover atalhos de teclado conforme solicitado

    const handleSaveAnnotations = useCallback(() => {
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
    }, [selectedImage, shapesByImage, shapeNotesByImage, annotations, setImageAnnotations]);

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
            <DialogContent className="max-w-[98vw] w-full h-[98vh] p-2 md:p-4 overflow-hidden">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-base md:text-lg xl:text-xl">Sistema de Anotação de Imagens</DialogTitle>
                </DialogHeader>

                {/* Toolbar */}
                <div className="flex-shrink-0">
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
                </div>

                <div className="flex flex-col lg:flex-row gap-2 md:gap-4 flex-1 min-h-0">
                    {/* Painel lateral esquerdo */}
                    <div className="w-full lg:w-72 xl:w-80 order-2 lg:order-1 min-h-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2 md:gap-4 h-full">
                            <div className="min-h-0">
                                <FigureManager
                                    figures={figures}
                                    selectedFigure={selectedFigure}
                                    onAddFigure={addFigure}
                                    onUpdateFigure={updateFigure}
                                    onDeleteFigure={deleteFigure}
                                    onSelectFigure={handleFigureSelect}
                                />
                            </div>

                            <div className="min-h-0">
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
                        </div>
                    </div>

                    {/* Área principal do canvas */}
                    <div className="flex-1 order-1 lg:order-2 min-h-0">
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
                            onZoomChange={setZoomLevel}
                        />
                    </div>

                    {/* Área de notas */}
                    <div className="w-full lg:w-72 xl:w-80 order-3 min-h-0">
                        <Card className="h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Notas da Imagem</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 md:p-3 h-full">
                                <Textarea
                                    value={notes?.[selectedImage] || ""}
                                    onChange={(e) => handleNoteChanged?.(selectedImage!, e.target.value)}
                                    placeholder="Anotações gerais para esta imagem..."
                                    className="h-full min-h-[150px] resize-none"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="flex-shrink-0 mt-2">
                    <StatusBar
                        activeTool={activeTool}
                        selectedFigure={selectedFigure}
                        selectedAnnotation={selectedAnnotation}
                        zoomLevel={zoomLevel}
                        annotationsCount={annotations.length}
                        canvasPosition={canvasPosition}
                    />
                </div>

                <DialogFooter className="pt-2">
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
        <div className="bg-white border border-gray-200 rounded-lg p-1 md:p-2">
            <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                {/* Ferramentas principais */}
                <div className="flex items-center gap-1">
                    <Button
                        variant={activeTool === "select" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onToolChange("select")}
                        title="Selecionar"
                        className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
                    >
                        <MousePointer2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={activeTool === "pan" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onToolChange("pan")}
                        title="Mover"
                        className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
                    >
                        <Hand className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={activeTool === "zoom" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onToolChange("zoom")}
                        title="Zoom"
                        className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>

                <Separator orientation="vertical" className="h-6 hidden sm:block" />

                {/* Seletor de figuras */}
                <div className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
                    <span className="text-xs md:text-sm font-medium text-gray-700 hidden sm:inline">Figura:</span>
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
                        <SelectTrigger className="w-24 md:w-32 lg:w-40 h-8 text-xs md:text-sm">
                            <SelectValue placeholder="Selecionar" />
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
                                            <span className="truncate">{figure.name}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>

                    {selectedFigure && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selectedFigure.color }} />
                            <span className="hidden lg:inline truncate">{selectedFigure.name}</span>
                        </Badge>
                    )}
                </div>

                {/* Controles de zoom */}
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                    <span className="text-xs md:text-sm font-medium text-gray-700 hidden lg:inline">Zoom:</span>
                    <Select value={zoomLevel.toString()} onValueChange={(value) => onZoomChange(Number.parseInt(value))}>
                        <SelectTrigger className="w-16 md:w-20 h-8 text-xs md:text-sm">
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
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Gerenciar Figuras</CardTitle>
                    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                        <Button size="sm" onClick={() => setShowAddDialog(true)} className="h-8">
                            <Plus className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Adicionar</span>
                        </Button>
                        <DialogContent className="max-w-md">
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
                                    <div className="grid grid-cols-5 gap-1 mt-2">
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
            <CardContent className="p-2 md:p-3 space-y-2 flex-1 overflow-y-auto min-h-0">
                {figures.map((figure) => (
                    <Card key={figure.id} className="border-l-4 flex-shrink-0" style={{ borderLeftColor: figure.color }}>
                        <CardContent className="p-2">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: figure.color }} />
                                    <span className="text-sm font-medium truncate">{figure.name}</span>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <Button
                                        size="sm"
                                        variant={selectedFigure?.id === figure.id ? "default" : "ghost"}
                                        onClick={() => onSelectFigure(selectedFigure?.id === figure.id ? null : figure)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        {selectedFigure?.id === figure.id ? "Ativo" : "Usar"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onDeleteFigure(figure.id)}
                                        className="h-7 w-7 p-0"
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
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
                <CardTitle className="text-sm">Anotações ({annotations.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-3 space-y-2 flex-1 overflow-y-auto min-h-0">
                {annotations.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">Nenhuma anotação criada</p>
                ) : (
                    annotations.map((annotation, index) => {
                        const figure = figures.find((f) => f.id === annotation.figureId);
                        if (!figure) return null;

                        return (
                            <Card
                                key={annotation.id}
                                className={`border-l-4 cursor-pointer flex-shrink-0 ${selectedAnnotation === annotation.id ? "bg-blue-50" : ""
                                    }`}
                                style={{ borderLeftColor: figure.color }}
                                onClick={() => onSelectAnnotation(selectedAnnotation === annotation.id ? null : annotation.id)}
                            >
                                <CardContent className="p-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
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
                                            className="h-7 w-7 p-0"
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
                                                rows={2}
                                            />
                                            <div className="flex gap-1">
                                                <Button size="sm" onClick={() => handleEditSave(annotation.id)} className="h-7">
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingAnnotation(null)} className="h-7">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-700 break-words line-clamp-2">{annotation.text || "Sem texto"}</p>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditStart(annotation);
                                                }}
                                                className="h-7 w-7 p-0"
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

// Interface para estados de desenho
interface DrawingState {
    isDrawing: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
}

// Interface para handles de redimensionamento
interface ResizeHandle {
    x: number;
    y: number;
    cursor: string;
    position: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";
}

// Componente Canvas de Anotação Avançado
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
    onZoomChange: (zoom: number) => void;
}> = ({
    imageUrl,
    annotations,
    figures,
    selectedFigure,
    activeTool,
    selectedAnnotation,
    zoomLevel,
    canvasPosition,
    onAddAnnotation,
    onUpdateAnnotation,
    onSelectAnnotation,
    onCanvasPositionChange,
    onZoomChange
}) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const imageRef = useRef<HTMLImageElement>(null);

        // Estados para desenho e interação
        const [drawingState, setDrawingState] = useState<DrawingState>({
            isDrawing: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
        });

        const [showAnnotationDialog, setShowAnnotationDialog] = useState(false);
        const [pendingAnnotation, setPendingAnnotation] = useState<Omit<Annotation, "id" | "text"> | null>(null);
        const [annotationText, setAnnotationText] = useState("");

        // Estados para manipulação
        const [isDragging, setIsDragging] = useState(false);
        const [isResizing, setIsResizing] = useState(false);
        const [resizeHandle, setResizeHandle] = useState<string | null>(null);
        const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
        const [isPanning, setIsPanning] = useState(false);
        const [panStart, setPanStart] = useState({ x: 0, y: 0 });

        // Dimensões do canvas responsivas
        const getCanvasDimensions = useCallback(() => {
            if (typeof window === 'undefined') return { width: 600, height: 400 };

            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Calcular espaço disponível considerando os painéis laterais
            let availableWidth = windowWidth;
            let availableHeight = windowHeight - 200; // Reservar espaço para header, footer, toolbar

            if (windowWidth >= 1024) { // lg breakpoint
                availableWidth = windowWidth - 640; // Subtrair largura dos painéis laterais
            } else if (windowWidth >= 768) { // md breakpoint
                availableHeight = windowHeight - 400; // Mais espaço para componentes empilhados
            }

            // Garantir dimensões mínimas e máximas
            const width = Math.max(300, Math.min(availableWidth - 40, 800));
            const height = Math.max(250, Math.min(availableHeight - 40, 600));

            return { width, height };
        }, []);

        const [canvasDimensions, setCanvasDimensions] = useState(getCanvasDimensions());

        // Atualizar dimensões do canvas quando a janela for redimensionada
        useEffect(() => {
            const handleResize = () => {
                setCanvasDimensions(getCanvasDimensions());
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [getCanvasDimensions]);

        const canvasWidth = canvasDimensions.width;
        const canvasHeight = canvasDimensions.height;

        // Função para obter coordenadas do mouse relativas ao canvas
        const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
            if (!canvasRef.current) return { x: 0, y: 0 };

            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            return {
                x: (clientX - rect.left) * scaleX - canvasPosition.x,
                y: (clientY - rect.top) * scaleY - canvasPosition.y,
            };
        }, [canvasPosition]);

        // Função para obter handles de redimensionamento
        const getResizeHandles = useCallback((annotation: Annotation): ResizeHandle[] => {
            const { x, y, width, height } = annotation;
            const scale = zoomLevel / 100;

            return [
                { x: x * scale, y: y * scale, cursor: "nw-resize", position: "nw" },
                { x: (x + width) * scale, y: y * scale, cursor: "ne-resize", position: "ne" },
                { x: x * scale, y: (y + height) * scale, cursor: "sw-resize", position: "sw" },
                { x: (x + width) * scale, y: (y + height) * scale, cursor: "se-resize", position: "se" },
                { x: (x + width / 2) * scale, y: y * scale, cursor: "n-resize", position: "n" },
                { x: (x + width / 2) * scale, y: (y + height) * scale, cursor: "s-resize", position: "s" },
                { x: x * scale, y: (y + height / 2) * scale, cursor: "w-resize", position: "w" },
                { x: (x + width) * scale, y: (y + height / 2) * scale, cursor: "e-resize", position: "e" },
            ];
        }, [zoomLevel]);

        // Função para verificar se o clique foi em um handle
        const getClickedHandle = useCallback((mouseX: number, mouseY: number, annotation: Annotation): string | null => {
            const handles = getResizeHandles(annotation);
            const handleSize = 8;

            for (const handle of handles) {
                if (
                    mouseX >= handle.x - handleSize / 2 &&
                    mouseX <= handle.x + handleSize / 2 &&
                    mouseY >= handle.y - handleSize / 2 &&
                    mouseY <= handle.y + handleSize / 2
                ) {
                    return handle.position;
                }
            }
            return null;
        }, [getResizeHandles]);

        // Função para verificar se o clique foi dentro de uma anotação
        const getClickedAnnotation = useCallback((mouseX: number, mouseY: number): Annotation | null => {
            const scale = zoomLevel / 100;

            for (let i = annotations.length - 1; i >= 0; i--) {
                const annotation = annotations[i];
                const x = annotation.x * scale;
                const y = annotation.y * scale;
                const width = annotation.width * scale;
                const height = annotation.height * scale;

                if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
                    return annotation;
                }
            }
            return null;
        }, [annotations, zoomLevel]);

        // Função para desenhar no canvas
        const drawCanvas = useCallback(() => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;

            // Limpar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Salvar estado do contexto
            ctx.save();

            // Aplicar transformações de zoom e pan
            ctx.translate(canvasPosition.x, canvasPosition.y);
            ctx.scale(zoomLevel / 100, zoomLevel / 100);

            // Desenhar imagem de fundo
            if (imageRef.current) {
                ctx.drawImage(imageRef.current, 0, 0);
            }

            // Restaurar estado para desenhar anotações
            ctx.restore();
            ctx.save();
            ctx.translate(canvasPosition.x, canvasPosition.y);

            // Desenhar anotações
            annotations.forEach((annotation) => {
                const figure = figures.find(f => f.id === annotation.figureId);
                if (!figure) return;

                const scale = zoomLevel / 100;
                const x = annotation.x * scale;
                const y = annotation.y * scale;
                const width = annotation.width * scale;
                const height = annotation.height * scale;
                const isSelected = selectedAnnotation === annotation.id;

                // Configurar estilo
                ctx.fillStyle = figure.color + (isSelected ? "80" : "40");
                ctx.strokeStyle = figure.color;
                ctx.lineWidth = isSelected ? 3 : 2;

                // Desenhar forma baseada no tipo
                ctx.beginPath();
                switch (figure.shape) {
                    case "rectangle":
                        ctx.rect(x, y, width, height);
                        break;
                    case "circle":
                        const radius = Math.min(width, height) / 2;
                        ctx.arc(x + width / 2, y + height / 2, radius, 0, 2 * Math.PI);
                        break;
                    case "line":
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + width, y + height);
                        break;
                    case "arrow":
                        // Desenhar linha
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + width, y + height);

                        // Desenhar ponta da seta
                        const arrowLength = 15;
                        const arrowAngle = Math.PI / 6;
                        const angle = Math.atan2(height, width);

                        ctx.lineTo(
                            x + width - arrowLength * Math.cos(angle - arrowAngle),
                            y + height - arrowLength * Math.sin(angle - arrowAngle)
                        );
                        ctx.moveTo(x + width, y + height);
                        ctx.lineTo(
                            x + width - arrowLength * Math.cos(angle + arrowAngle),
                            y + height - arrowLength * Math.sin(angle + arrowAngle)
                        );
                        break;
                }

                // Preencher e contornar
                if (figure.shape !== "line" && figure.shape !== "arrow") {
                    ctx.fill();
                }
                ctx.stroke();

                // Desenhar handles de redimensionamento se selecionado
                if (isSelected && activeTool === "select") {
                    const handles = getResizeHandles(annotation);
                    handles.forEach((handle) => {
                        ctx.fillStyle = "#fff";
                        ctx.strokeStyle = "#000";
                        ctx.lineWidth = 1;
                        ctx.fillRect(handle.x - 4, handle.y - 4, 8, 8);
                        ctx.strokeRect(handle.x - 4, handle.y - 4, 8, 8);
                    });
                }

                // Desenhar texto da anotação se existir e não estiver sobrepondo a figura
                if (annotation.text && annotation.text.trim()) {
                    ctx.fillStyle = "#000";
                    ctx.font = "12px Arial";

                    // Posicionar texto fora da figura para evitar sobreposição
                    let textX = x + width + 10; // À direita da figura
                    let textY = y + 15; // Ligeiramente abaixo do topo

                    // Se o texto sair da tela, posicionar à esquerda
                    const textWidth = ctx.measureText(annotation.text).width;
                    if (textX + textWidth > canvasWidth) {
                        textX = x - textWidth - 10;
                    }

                    // Se ainda sair da tela à esquerda, posicionar abaixo
                    if (textX < 0) {
                        textX = x + 5;
                        textY = y + height + 20;
                    }

                    // Se sair da tela embaixo, posicionar acima
                    if (textY > canvasHeight) {
                        textY = y - 10;
                    }

                    // Adicionar fundo semi-transparente para o texto
                    const padding = 4;
                    const textMetrics = ctx.measureText(annotation.text);
                    const textHeight = 14;

                    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                    ctx.fillRect(textX - padding, textY - textHeight, textWidth + padding * 2, textHeight + padding);

                    ctx.fillStyle = "#000";
                    ctx.fillText(annotation.text, textX, textY);
                }
            });

            // Desenhar forma sendo criada
            if (drawingState.isDrawing && selectedFigure) {
                const scale = zoomLevel / 100;
                const x = Math.min(drawingState.startX, drawingState.currentX);
                const y = Math.min(drawingState.startY, drawingState.currentY);
                const width = Math.abs(drawingState.currentX - drawingState.startX);
                const height = Math.abs(drawingState.currentY - drawingState.startY);

                ctx.fillStyle = selectedFigure.color + "40";
                ctx.strokeStyle = selectedFigure.color;
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);

                ctx.beginPath();
                switch (selectedFigure.shape) {
                    case "rectangle":
                        ctx.rect(x, y, width, height);
                        ctx.fill();
                        break;
                    case "circle":
                        const radius = Math.min(width, height) / 2;
                        ctx.arc(x + width / 2, y + height / 2, radius, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    case "line":
                        ctx.moveTo(drawingState.startX, drawingState.startY);
                        ctx.lineTo(drawingState.currentX, drawingState.currentY);
                        break;
                    case "arrow":
                        ctx.moveTo(drawingState.startX, drawingState.startY);
                        ctx.lineTo(drawingState.currentX, drawingState.currentY);
                        break;
                }
                ctx.stroke();
                ctx.setLineDash([]);
            }

            ctx.restore();
        }, [
            annotations,
            figures,
            selectedAnnotation,
            selectedFigure,
            activeTool,
            zoomLevel,
            canvasPosition,
            drawingState,
            getResizeHandles,
            canvasWidth,
            canvasHeight
        ]);

        // Event handler para zoom com scroll
        const handleWheel = useCallback((e: React.WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -10 : 10;
                const newZoom = Math.max(25, Math.min(200, zoomLevel + delta));
                onZoomChange(newZoom);
            }
        }, [zoomLevel, onZoomChange]);

        // Event handlers
        const handleMouseDown = useCallback((e: React.MouseEvent) => {
            const { x: mouseX, y: mouseY } = getCanvasCoordinates(e.clientX, e.clientY);

            if (activeTool === "pan") {
                setIsPanning(true);
                setPanStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
                return;
            }

            if (activeTool === "select") {
                const clickedAnnotation = getClickedAnnotation(mouseX, mouseY);

                if (clickedAnnotation) {
                    onSelectAnnotation(clickedAnnotation.id);

                    // Verificar se clicou em um handle de redimensionamento
                    const handle = getClickedHandle(mouseX, mouseY, clickedAnnotation);
                    if (handle) {
                        setIsResizing(true);
                        setResizeHandle(handle);
                    } else {
                        // Iniciar arraste
                        setIsDragging(true);
                        setDragOffset({
                            x: mouseX - clickedAnnotation.x * (zoomLevel / 100),
                            y: mouseY - clickedAnnotation.y * (zoomLevel / 100),
                        });
                    }
                } else {
                    onSelectAnnotation(null);
                }
            } else if (activeTool === "draw" && selectedFigure) {
                setDrawingState({
                    isDrawing: true,
                    startX: mouseX,
                    startY: mouseY,
                    currentX: mouseX,
                    currentY: mouseY,
                });
            }
        }, [
            activeTool,
            selectedFigure,
            canvasPosition,
            zoomLevel,
            getCanvasCoordinates,
            getClickedAnnotation,
            getClickedHandle,
            onSelectAnnotation
        ]);

        const handleMouseMove = useCallback((e: React.MouseEvent) => {
            const { x: mouseX, y: mouseY } = getCanvasCoordinates(e.clientX, e.clientY);

            if (isPanning) {
                onCanvasPositionChange({
                    x: e.clientX - panStart.x,
                    y: e.clientY - panStart.y,
                });
                return;
            }

            if (drawingState.isDrawing) {
                setDrawingState(prev => ({
                    ...prev,
                    currentX: mouseX,
                    currentY: mouseY,
                }));
            }

            if (isDragging && selectedAnnotation) {
                const annotation = annotations.find(a => a.id === selectedAnnotation);
                if (annotation) {
                    const scale = zoomLevel / 100;
                    onUpdateAnnotation(selectedAnnotation, {
                        x: (mouseX - dragOffset.x) / scale,
                        y: (mouseY - dragOffset.y) / scale,
                    });
                }
            }

            if (isResizing && selectedAnnotation && resizeHandle) {
                const annotation = annotations.find(a => a.id === selectedAnnotation);
                if (annotation) {
                    const scale = zoomLevel / 100;
                    const newUpdates: Partial<Annotation> = {};

                    switch (resizeHandle) {
                        case "se":
                            newUpdates.width = Math.max(10, (mouseX / scale) - annotation.x);
                            newUpdates.height = Math.max(10, (mouseY / scale) - annotation.y);
                            break;
                        case "sw":
                            newUpdates.width = Math.max(10, annotation.width + (annotation.x - (mouseX / scale)));
                            newUpdates.height = Math.max(10, (mouseY / scale) - annotation.y);
                            newUpdates.x = Math.min(mouseX / scale, annotation.x + annotation.width - 10);
                            break;
                        case "ne":
                            newUpdates.width = Math.max(10, (mouseX / scale) - annotation.x);
                            newUpdates.height = Math.max(10, annotation.height + (annotation.y - (mouseY / scale)));
                            newUpdates.y = Math.min(mouseY / scale, annotation.y + annotation.height - 10);
                            break;
                        case "nw":
                            newUpdates.width = Math.max(10, annotation.width + (annotation.x - (mouseX / scale)));
                            newUpdates.height = Math.max(10, annotation.height + (annotation.y - (mouseY / scale)));
                            newUpdates.x = Math.min(mouseX / scale, annotation.x + annotation.width - 10);
                            newUpdates.y = Math.min(mouseY / scale, annotation.y + annotation.height - 10);
                            break;
                        case "n":
                            newUpdates.height = Math.max(10, annotation.height + (annotation.y - (mouseY / scale)));
                            newUpdates.y = Math.min(mouseY / scale, annotation.y + annotation.height - 10);
                            break;
                        case "s":
                            newUpdates.height = Math.max(10, (mouseY / scale) - annotation.y);
                            break;
                        case "w":
                            newUpdates.width = Math.max(10, annotation.width + (annotation.x - (mouseX / scale)));
                            newUpdates.x = Math.min(mouseX / scale, annotation.x + annotation.width - 10);
                            break;
                        case "e":
                            newUpdates.width = Math.max(10, (mouseX / scale) - annotation.x);
                            break;
                    }

                    onUpdateAnnotation(selectedAnnotation, newUpdates);
                }
            }

            // Atualizar cursor baseado no contexto
            if (containerRef.current) {
                let cursor = "default";

                if (activeTool === "pan") {
                    cursor = isPanning ? "grabbing" : "grab";
                } else if (activeTool === "draw") {
                    cursor = "crosshair";
                } else if (activeTool === "select" && selectedAnnotation) {
                    const annotation = annotations.find(a => a.id === selectedAnnotation);
                    if (annotation) {
                        const handle = getClickedHandle(mouseX, mouseY, annotation);
                        if (handle) {
                            const handleObj = getResizeHandles(annotation).find(h => h.position === handle);
                            cursor = handleObj?.cursor || "default";
                        } else {
                            const clickedAnnotation = getClickedAnnotation(mouseX, mouseY);
                            cursor = clickedAnnotation ? "move" : "default";
                        }
                    }
                }

                containerRef.current.style.cursor = cursor;
            }
        }, [
            isPanning,
            panStart,
            drawingState.isDrawing,
            isDragging,
            isResizing,
            selectedAnnotation,
            resizeHandle,
            dragOffset,
            annotations,
            zoomLevel,
            activeTool,
            getCanvasCoordinates,
            getClickedAnnotation,
            getClickedHandle,
            getResizeHandles,
            onCanvasPositionChange,
            onUpdateAnnotation
        ]);

        const handleMouseUp = useCallback(() => {
            if (drawingState.isDrawing && selectedFigure) {
                const scale = zoomLevel / 100;
                const x = Math.min(drawingState.startX, drawingState.currentX) / scale;
                const y = Math.min(drawingState.startY, drawingState.currentY) / scale;
                const width = Math.abs(drawingState.currentX - drawingState.startX) / scale;
                const height = Math.abs(drawingState.currentY - drawingState.startY) / scale;

                if (width > 10 && height > 10) {
                    const newAnnotation: Omit<Annotation, "id"> = {
                        figureId: selectedFigure.id,
                        x,
                        y,
                        width,
                        height,
                        text: "",
                        isOpen: false,
                    };

                    onAddAnnotation(newAnnotation);
                }
            }

            // Reset all interaction states
            setDrawingState({
                isDrawing: false,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
            });
            setIsDragging(false);
            setIsResizing(false);
            setResizeHandle(null);
            setIsPanning(false);
        }, [drawingState, selectedFigure, zoomLevel, onAddAnnotation]);

        // Efeito para desenhar no canvas
        useEffect(() => {
            drawCanvas();
        }, [drawCanvas]);

        // Carregar imagem quando URL muda
        useEffect(() => {
            if (imageRef.current) {
                imageRef.current.onload = () => drawCanvas();
                imageRef.current.src = imageUrl;
            }
        }, [imageUrl, drawCanvas]);

        return (
            <Card className="h-full flex flex-col">
                <CardContent className="p-1 md:p-2 flex-1 flex flex-col min-h-0">
                    <div
                        ref={containerRef}
                        className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex-1 min-h-0 flex items-center justify-center"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            ref={imageRef}
                            src={imageUrl}
                            alt="Annotation target"
                            className="hidden"
                        />
                        <canvas
                            ref={canvasRef}
                            width={canvasWidth}
                            height={canvasHeight}
                            className="max-w-full max-h-full object-contain"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onWheel={handleWheel}
                        />
                    </div>

                    {/* Dialog para adicionar texto à anotação */}
                    <Dialog open={showAnnotationDialog} onOpenChange={setShowAnnotationDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Texto à Anotação</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Textarea
                                    value={annotationText}
                                    onChange={(e) => setAnnotationText(e.target.value)}
                                    placeholder="Digite o texto da anotação..."
                                    rows={3}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowAnnotationDialog(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={() => {
                                    if (pendingAnnotation) {
                                        onAddAnnotation({
                                            ...pendingAnnotation,
                                            text: annotationText,
                                        });
                                    }
                                    setShowAnnotationDialog(false);
                                    setPendingAnnotation(null);
                                    setAnnotationText("");
                                }}>
                                    Adicionar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 md:px-4 py-1 md:py-2">
            <div className="flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-gray-600 flex-wrap gap-1 md:gap-2">
                <div className="flex md:flex-row items-center gap-1 md:gap-4">
                    <div className="flex items-center gap-1 md:gap-2">
                        <span className="hidden lg:inline">Ferramenta:</span>
                        <Badge variant="outline" className="text-xs">{TOOL_LABELS[activeTool]}</Badge>
                    </div>

                    {selectedFigure && (
                        <>
                            <Separator orientation="vertical" className="h-4 hidden sm:block" />
                            <div className="flex items-center gap-1 md:gap-2">
                                <span className="hidden xl:inline">Figura ativa:</span>
                                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFigure.color }} />
                                    <span className="hidden md:inline truncate max-w-20">{selectedFigure.name}</span>
                                </Badge>
                            </div>
                        </>
                    )}

                    {selectedAnnotation && (
                        <>
                            <Separator orientation="vertical" className="h-4 hidden md:block" />
                            <div>
                                <Badge variant="default" className="text-xs">Selecionada</Badge>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1 md:gap-4">
                    <div>
                        <span className="hidden lg:inline">Anotações: </span>
                        <span className="font-medium">{annotationsCount}</span>
                    </div>

                    <Separator orientation="vertical" className="h-4 hidden sm:block" />

                    <div>
                        <span className="hidden lg:inline">Zoom: </span>
                        <span className="font-medium">{zoomLevel}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
