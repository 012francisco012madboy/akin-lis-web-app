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
    notes: Record<string, string>;
    handleNoteChange: (image: string, value: string) => void;
    setSelectedImage: (image: string | null) => void;
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
    handleNoteChange,
    setSelectedImage,
}) => {
    const [selectedShape, setSelectedShape] = useState<"rect" | "circle" | null>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const transformerRef = useRef<any>(null);
    const stageRef = useRef<any>(null);

    useEffect(() => {
        if (transformerRef.current && selectedShapeId) {
            const selectedNode = stageRef.current.findOne(`#${selectedShapeId}`);
            transformerRef.current.nodes([selectedNode]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [selectedShapeId]);

    const handleCanvasClick = (e: any) => {
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
        setSelectedShape(null);
    };

    const handleShapeSelect = (id: string) => {
        setSelectedShapeId(id);
    };

    const handleDeleteShape = () => {
        setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== selectedShapeId));
        setSelectedShapeId(null);
    };

    const handleTransform = (id: string, newAttrs: any) => {
        setShapes((prevShapes) =>
            prevShapes.map((shape) =>
                shape.id === id ? { ...shape, ...newAttrs } : shape
            )
        );
    };

    if (!selectedImage) return null;

    return (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-5xl h-full lg:h-[95%] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Imagem Capturada</DialogTitle>
                </DialogHeader>
                <div className="w-full h-full flex flex-col gap-5">
                    <div className="flex gap-5 justify-between">
                        <Button onClick={() => setSelectedShape("rect")}>Adicionar Retângulo</Button>
                        <Button onClick={() => setSelectedShape("circle")}>Adicionar Círculo</Button>
                        <Button onClick={handleDeleteShape} disabled={!selectedShapeId}>
                            Excluir Forma Selecionada
                        </Button>
                        <Button onClick={() => setSelectedShape(null)}>Desativar Seleção</Button>
                    </div>
                    <div className="relative w-[400px] object-fill h-[400px] bg-black rounded-md">
                        <Image
                            width={300}
                            height={300}
                            src={selectedImage}
                            alt="Selected"
                            className="absolute w-full h-full rounded-lg"
                        />
                        <Stage
                            width={window.innerWidth * 0.9}
                            height={400}
                            className="absolute top-0 left-0"
                            onClick={handleCanvasClick}
                            ref={stageRef}
                        >
                            <Layer>
                                {shapes.map((shape) => {
                                    const isSelected = shape.id === selectedShapeId;
                                    return shape.type === "rect" ? (
                                        <Rect
                                            key={shape.id}
                                            id={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            width={shape.width}
                                            height={shape.height}
                                            fill="rgba(0, 123, 255, 0.5)"
                                            draggable
                                            onClick={() => handleShapeSelect(shape.id)}
                                            onDragEnd={(e) =>
                                                handleTransform(shape.id, {
                                                    x: e.target.x(),
                                                    y: e.target.y(),
                                                })
                                            }
                                            onTransformEnd={(e) => {
                                                const node = e.target;
                                                const newAttrs = {
                                                    x: node.x(),
                                                    y: node.y(),
                                                    width: node.width() * node.scaleX(),
                                                    height: node.height() * node.scaleY(),
                                                };
                                                handleTransform(shape.id, newAttrs);
                                            }}
                                        />
                                    ) : (
                                        <Circle
                                            key={shape.id}
                                            id={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            radius={shape.radius}
                                            fill="rgba(220, 53, 69, 0.5)"
                                            draggable
                                            onClick={() => handleShapeSelect(shape.id)}
                                            onDragEnd={(e) =>
                                                handleTransform(shape.id, {
                                                    x: e.target.x(),
                                                    y: e.target.y(),
                                                })
                                            }
                                            onTransformEnd={(e) => {
                                                const node = e.target;
                                                const newAttrs = {
                                                    x: node.x(),
                                                    y: node.y(),
                                                    radius: (node as Konva.Circle).radius() * node.scaleX(),
                                                };
                                                handleTransform(shape.id, newAttrs);
                                            }}
                                        />
                                    );
                                })}
                                <Transformer ref={transformerRef} />
                            </Layer>
                        </Stage>
                    </div>
                    <Textarea
                        value={notes[selectedImage] || ""}
                        onChange={(e) => handleNoteChange(selectedImage, e.target.value)}
                        placeholder="Anotações para esta imagem..."
                        className="w-full h-32"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={() => setSelectedImage(null)}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
