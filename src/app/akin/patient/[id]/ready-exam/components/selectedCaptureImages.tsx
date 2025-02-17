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
    handleNoteChange,
    setSelectedImage,
    moreFuncIsShow
}) => {
    const [selectedShape, setSelectedShape] = useState<"rect" | "circle" | null>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
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
        setSelectedShape(null);
    };

    const handleShapeSelect = (id: string) => {
        setSelectedShapeId(id);
    };

    const handleDeleteShape = () => {
        setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== selectedShapeId));
        setSelectedShapeId(null);
    };

    const handleTransform = (id: string, newAttrs: Partial<Shape>) => {
        setShapes((prevShapes) =>
            prevShapes.map((shape) => (shape.id === id ? { ...shape, ...newAttrs } : shape))
        );
    };

    if (!selectedImage) return null;

    return (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className={`${moreFuncIsShow ? "max-w-5xl h-full lg:h-[95%] overflow-y-auto" : "w-1/2"}`}>
                <DialogHeader>
                    <DialogTitle>Imagem Capturada</DialogTitle>
                </DialogHeader>

                <div className="w-full h-full flex flex-col gap-5">
                    {
                        moreFuncIsShow && (
                            <ShapeControls
                                setSelectedShape={setSelectedShape}
                                handleDeleteShape={handleDeleteShape}
                                isShapeSelected={!!selectedShapeId}
                            />
                        )
                    }

                    <CanvasArea
                        moreFuncIsShow
                        selectedImage={selectedImage}
                        shapes={shapes}
                        handleCanvasClick={handleCanvasClick}
                        handleShapeSelect={handleShapeSelect}
                        handleTransform={handleTransform}
                        selectedShapeId={selectedShapeId}
                        transformerRef={transformerRef}
                        stageRef={stageRef}
                    />
                    {
                        moreFuncIsShow && (
                            <Textarea
                                value={notes?.[selectedImage] || ""}
                                onChange={(e) => handleNoteChange && handleNoteChange(selectedImage, e.target.value)}
                                placeholder="Anotações para esta imagem..."
                                className="w-full h-32"
                            />
                        )
                    }
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
        <Button onClick={handleDeleteShape} disabled={!isShapeSelected}>
            Excluir Forma Selecionada
        </Button>
        <Button onClick={() => setSelectedShape(null)}>Desativar Seleção</Button>
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
}) => {

    const handleTransformEnd = (e: Konva.KonvaEventObject<Event>, shape: Shape) => {
        const node = e.target;

        // Resetando a escala após a transformação
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);

        // Calculando novos atributos com escala aplicada
        const newAttrs = shape.type === "rect"
            ? {
                x: node.x(),
                y: node.y(),
                width: Math.max(10, node.width() * scaleX),
                height: Math.max(10, node.height() * scaleY),
            }
            : {
                x: node.x(),
                y: node.y(),
                radius: Math.max(5, (node as Konva.Circle).radius() * scaleX),
            };

        handleTransform(shape.id, newAttrs);
    };

    return (
        <div className="relative w-[400px] h-[400px] bg-black rounded-md">
            <Image
                width={300}
                height={300}
                src={selectedImage}
                alt="Selected"
                className="absolute w-full h-full object-cover rounded-lg"
            />
            {moreFuncIsShow && (
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
                            const shapeProps = {
                                key: shape.id,
                                id: shape.id,
                                x: shape.x,
                                y: shape.y,
                                draggable: true,
                                onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
                                    e.cancelBubble = true;
                                    handleShapeSelect(shape.id);
                                },
                                onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) =>
                                    handleTransform(shape.id, {
                                        x: e.target.x(),
                                        y: e.target.y(),
                                    }),
                                onTransformEnd: (e: Konva.KonvaEventObject<Event>) =>
                                    handleTransformEnd(e, shape),
                                fill: isSelected
                                    ? "rgba(0, 123, 255, 0.7)"
                                    : "rgba(0, 123, 255, 0.5)",
                            };

                            return shape.type === "rect" ? (
                                <Rect
                                    {...shapeProps}
                                    width={shape.width}
                                    height={shape.height}
                                />
                            ) : (
                                <Circle
                                    {...shapeProps}
                                    radius={shape.radius}
                                />
                            );
                        })}
                        <Transformer
                            ref={transformerRef}
                            boundBoxFunc={(oldBox, newBox) => {
                                // Limita o tamanho mínimo da forma para evitar que desapareça
                                if (newBox.width < 10 || newBox.height < 10) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    </Layer>
                </Stage>
            )}
        </div>
    );
};
