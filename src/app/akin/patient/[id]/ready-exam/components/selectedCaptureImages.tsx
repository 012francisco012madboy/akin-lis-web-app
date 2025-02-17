import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Stage, Layer, Rect, Circle, Transformer } from "react-konva";
import Konva from "konva";

interface ImageModalProps {
    selectedImage: string | null;
    notes?: Record<string, string>;
    handleNoteChange?: (image: string, value: string) => void;
    setSelectedImage: (image: string | null) => void;
    moreFuncIsShow?: boolean;
}

interface Shape {
    id: string;
    type: "rect" | "circle";
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
}

export const ImageModal: React.FC<ImageModalProps> = ({
    selectedImage,
    notes,
    // handleNoteChange,
    setSelectedImage,
    moreFuncIsShow
}) => {
    const [selectedShape, setSelectedShape] = useState<"rect" | "circle" | null>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const [shapeNotes, setShapeNotes] = useState<Record<string, string>>({});
    const transformerRef = useRef<Konva.Transformer>(null);
    const stageRef = useRef<Konva.Stage>(null);

    useEffect(() => {
        if (transformerRef.current && selectedShapeId) {
            const selectedNode = stageRef.current?.findOne(`#${selectedShapeId}`);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
                transformerRef.current.getLayer()?.batchDraw();
            }
        } else {
            transformerRef.current?.nodes([]);
        }
    }, [selectedShapeId]);

    const handleCanvasClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!selectedShape) return;

        const stage = e.target.getStage();
        const pointer = stage?.getPointerPosition();
        if (!pointer || e.target !== stage) return;

        const newShape: Shape = selectedShape === "rect"
            ? {
                id: `${Date.now()}`,
                type: "rect",
                x: pointer.x,
                y: pointer.y,
                width: 100,
                height: 50,
            }
            : {
                id: `${Date.now()}`,
                type: "circle",
                x: pointer.x,
                y: pointer.y,
                radius: 30,
            };

        setShapes((prevShapes) => [...prevShapes, newShape]);
        setShapeNotes((prevNotes) => ({ ...prevNotes, [newShape.id]: "" }));
        setSelectedShape(null);
    };

    const handleShapeSelect = (id: string) => {
        setSelectedShapeId(id);
    };

    const handleDeleteShape = () => {
        setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== selectedShapeId));
        setShapeNotes((prevNotes) => {
            const updatedNotes = { ...prevNotes };
            delete updatedNotes[selectedShapeId as string];
            return updatedNotes;
        });
        setSelectedShapeId(null);
    };

    const handleTransform = (id: string, newAttrs: Partial<Shape>) => {
        setShapes((prevShapes) =>
            prevShapes.map((shape) => (shape.id === id ? { ...shape, ...newAttrs } : shape))
        );
    };

    const handleNoteChange = (id: string, value: string) => {
        setShapeNotes((prevNotes) => ({ ...prevNotes, [id]: value }));
    };

    if (!selectedImage) return null;

    return (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className={`${moreFuncIsShow ? "max-w-5xl h-full lg:h-[95%] overflow-y-auto" : "w-1/2"}`}>
                <DialogHeader>
                    <DialogTitle>Imagem Capturada</DialogTitle>
                </DialogHeader>

                <div className="w-full h-full flex flex-col gap-5">
                    {moreFuncIsShow && (
                        <ShapeControls
                            setSelectedShape={setSelectedShape}
                            handleDeleteShape={handleDeleteShape}
                            isShapeSelected={!!selectedShapeId}
                        />
                    )}

                    <CanvasArea
                        moreFuncIsShow
                        selectedImage={selectedImage}
                        shapes={shapes}
                        handleCanvasClick={handleCanvasClick}
                        handleShapeSelect={handleShapeSelect}
                        handleTransform={handleTransform}
                        selectedShapeId={selectedShapeId}
                        transformerRef={transformerRef}
                        setSelectedShapeId={setSelectedShapeId}
                        stageRef={stageRef}
                        shapeNotes={shapeNotes}
                        handleNoteChange={handleNoteChange}
                    />

                    <DialogFooter>
                        <Button onClick={() => setSelectedImage(null)}>Fechar</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const ShapeControls: React.FC<{
    setSelectedShape: React.Dispatch<React.SetStateAction<"rect" | "circle" | null>>;
    handleDeleteShape: () => void;
    isShapeSelected: boolean;
}> = ({ setSelectedShape, handleDeleteShape, isShapeSelected }) => (
    <div className="flex gap-5 justify-between">
        <Button onClick={() => setSelectedShape("rect")}>Adicionar Retângulo</Button>
        <Button onClick={() => setSelectedShape("circle")}>Adicionar Círculo</Button>
        <Button onClick={handleDeleteShape} disabled={!isShapeSelected}>Excluir Forma Selecionada</Button>
    </div>
);

const CanvasArea: React.FC<{
    selectedImage: string;
    moreFuncIsShow?: boolean;
    shapes: Shape[];
    handleCanvasClick: (e: Konva.KonvaEventObject<MouseEvent>) => void;
    handleShapeSelect: (id: string) => void;
    handleTransform: (id: string, newAttrs: Partial<Shape>) => void;
    selectedShapeId: string | null;
    transformerRef: React.RefObject<Konva.Transformer>;
    stageRef: React.RefObject<Konva.Stage>;
    setSelectedShapeId: React.Dispatch<React.SetStateAction<string | null>>;
    shapeNotes: Record<string, string>;
    handleNoteChange: (id: string, value: string) => void;
}> = ({
    selectedImage,
    moreFuncIsShow,
    shapes,
    handleCanvasClick,
    handleShapeSelect,
    handleTransform,
    selectedShapeId,
    transformerRef,
    stageRef,
    setSelectedShapeId,
    shapeNotes,
    handleNoteChange,
}) => {
    const [notePosition, setNotePosition] = useState({ x: 20, y: 20 });
    const noteRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (selectedShapeId) return;
        handleCanvasClick(e);
    };

    // Início do arraste do bloco de notas
    const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!noteRef.current) return;
        dragging.current = true;
        offset.current = {
            x: e.clientX - notePosition.x,
            y: e.clientY - notePosition.y,
        };
    };

    // Movimento do bloco de notas
    const handleDragMove = (e: MouseEvent) => {
        if (!dragging.current) return;
        setNotePosition({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y,
        });
    };

    // Fim do arraste
    const handleDragEnd = () => {
        dragging.current = false;
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleDragMove);
        window.addEventListener("mouseup", handleDragEnd);
        return () => {
            window.removeEventListener("mousemove", handleDragMove);
            window.removeEventListener("mouseup", handleDragEnd);
        };
    }, []);

    return (
        <div className="relative w-[400px] h-[400px] bg-black rounded-md">
            <Image width={400} height={400} src={selectedImage} alt="Selected" className="absolute w-full h-full object-cover rounded-lg" />

            <Stage width={400} height={400} className="absolute top-0 left-0" onClick={handleStageClick} ref={stageRef}>
                <Layer>
                    {shapes.map((shape) =>
                        shape.type === "rect" ? (
                            <Rect
                                key={shape.id}
                                id={shape.id}
                                x={shape.x}
                                y={shape.y}
                                width={shape.width}
                                height={shape.height}
                                draggable
                                fill={shape.id === selectedShapeId ? "rgba(0, 123, 255, 0.7)" : "rgba(0, 123, 255, 0.5)"}
                                onClick={(e) => {
                                    e.cancelBubble = true;
                                    handleShapeSelect(shape.id);
                                }}
                            />
                        ) : (
                            <Circle
                                key={shape.id}
                                id={shape.id}
                                x={shape.x}
                                y={shape.y}
                                radius={shape.radius}
                                draggable
                                fill={shape.id === selectedShapeId ? "rgba(220, 53, 69, 0.7)" : "rgba(220, 53, 69, 0.5)"}
                                onClick={(e) => {
                                    e.cancelBubble = true;
                                    handleShapeSelect(shape.id);
                                }}
                            />
                        )
                    )}
                    <Transformer ref={transformerRef} />
                </Layer>
            </Stage>

            {selectedShapeId && (
                <div
                    ref={noteRef}
                    className="absolute bg-white p-3 rounded shadow-md w-48 cursor-move"
                    style={{ left: notePosition.x, top: notePosition.y }}
                    onMouseDown={handleDragStart}
                    onClick={(e) => e.stopPropagation()} // Evita que o clique feche o bloco de notas
                >
                    <h3 className="text-sm font-bold mb-2">Bloco de Notas</h3>
                    <Textarea
                        value={shapeNotes[selectedShapeId] || ""}
                        onChange={(e) => handleNoteChange(selectedShapeId, e.target.value)}
                        placeholder="Escreva algo sobre esta forma..."
                        className="w-full h-24"
                    />
                    <Button className="mt-2 w-full" onClick={() => setSelectedShapeId(null)}>Fechar</Button>
                </div>
            )}
        </div>
    );
};
