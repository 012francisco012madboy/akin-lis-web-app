"use client";

import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AppContext } from "@/context/AppContext";
import { AnnotationCanvas, type AnnotationCanvasHandle } from "@/components/AnnotationCanvas";
import { AnnotationToolbar } from "@/components/AnnotationToolbar";
import { AnnotationSidebar } from "@/components/AnnotationSidebar";
import { OntologySidebar } from "@/components/OntologySidebar";
import { Tool, AppImage, Ontology, Annotation, OntologyObject, Exam } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageNavigation } from "@/components/ImageNavigation";

export default function AnnotationPage() {
  const { id } = useParams();
  const { state, dispatch } = useContext(AppContext);
  const { toast } = useToast();
  const canvasRef = useRef<AnnotationCanvasHandle>(null);

  const [image, setImage] = useState<AppImage | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [examImages, setExamImages] = useState<AppImage[]>([]);
  const [ontology, setOntology] = useState<Ontology | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [activeOntologyObject, setActiveOntologyObject] = useState<OntologyObject | null>(null);

  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (id && state.images.length > 0 && state.exams.length > 0) {
      const currentImage = state.images.find((img) => img.id === id);
      if (currentImage) {
        setImage(currentImage);
        const currentExam = state.exams.find(ex => ex.id === currentImage.examId);
        if (currentExam) {
            setExam(currentExam);
            const imagesForExam = state.images
                .filter(img => img.examId === currentExam.id)
                .sort((a, b) => a.name.localeCompare(b.name));
            setExamImages(imagesForExam);
            
            const currentOntology = currentExam.ontologyId
              ? state.ontologies.find((ont) => ont.id === currentExam.ontologyId)
              : null;
            setOntology(currentOntology || null);
        } else {
            setExam(null);
            setOntology(null);
            setExamImages([]);
        }
        const imageAnnotations = state.annotations.filter(
          (ann) => ann.imageId === id
        );
        setAnnotations(imageAnnotations);
      }
    }
  }, [id, state]);
  
  const handleSelectObject = (object: OntologyObject) => {
    setActiveOntologyObject(object);
    setActiveTool("draw");
  }

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
    if(tool !== 'draw'){
      setActiveOntologyObject(null);
    }
  }

  const handleZoomIn = useCallback(() => canvasRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => canvasRef.current?.zoomOut(), []);
  const handleFitToScreen = useCallback(() => canvasRef.current?.fitToScreen(), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]') ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLSelectElement ||
          e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (examImages.length > 1 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
          return;
      }

      switch (e.key.toLowerCase()) {
        case 'v':
          handleToolChange('select');
          break;
        case 'h':
          handleToolChange('pan');
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'f':
          handleFitToScreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleZoomIn, handleZoomOut, handleFitToScreen, examImages.length]);

  if (!isClient) {
    return (
      <div className="w-full h-screen p-4 flex gap-2">
        <Skeleton className="w-80 h-full" />
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="w-80 h-full" />
      </div>
    );
  }

  if (!image || !exam) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Imagem ou Exame não encontrado</h2>
          <p className="text-muted-foreground mt-2">
            Os dados solicitados não existem ou ainda não foram carregados.
          </p>
        </div>
      </div>
    );
  }
  
  // If image and exam exist but ontology doesn't, show setup view
  if (!ontology) {
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full bg-muted/30">
        {exam && image && examImages.length > 1 && (
            <ImageNavigation exam={exam} examImages={examImages} currentImageId={image.id} />
        )}
        <div className="flex flex-1 overflow-hidden">
            <OntologySidebar 
              exam={exam}
              activeOntologyObjectId={null}
              onSelectObject={() => {}}
            />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl text-center p-8">
                    <CardHeader>
                        <CardTitle>Configurar Ontologia para o Exame</CardTitle>
                        <CardDescription>Para começar a anotar, crie uma nova ontologia ou utilize uma existente para o exame "{exam.name}". Esta ontologia será aplicada a todas as imagens deste exame.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Image src={image.url} alt={image.name} width={400} height={400} className="rounded-md mx-auto shadow-lg" data-ai-hint="microscopic cell" />
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    );
  }

  const handleAddAnnotation = (annotation: Omit<Annotation, "id">) => {
    const newAnnotation = { ...annotation, id: `ann-${Date.now()}` };
    dispatch({ type: "ADD_ANNOTATION", payload: newAnnotation });
    setActiveTool('select');
    setActiveOntologyObject(null);
    setSelectedAnnotationId(newAnnotation.id);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    dispatch({ type: "DELETE_ANNOTATION", payload: annotationId });
    toast({
      title: "Anotação Excluída",
      description: "A anotação foi removida.",
    });
  };
  
  const handleUpdateAnnotation = (annotation: Annotation) => {
    dispatch({ type: 'UPDATE_ANNOTATION', payload: annotation });
  };

  const handleNotesChange = (notes: string) => {
    if (image) {
      dispatch({ type: "UPDATE_IMAGE_NOTES", payload: { imageId: image.id, notes } });
    }
  };

  const exportAnnotations = () => {
    const annotationsWithNames = annotations.map(ann => {
        const ontologyObject = ontology?.objects.find(obj => obj.id === ann.ontologyObjectId);
        return {
            ...ann,
            ontologyObjectName: ontologyObject ? ontologyObject.name : 'Objeto desconhecido',
        };
    });

    const dataStr = JSON.stringify({ image, ontology, annotations: annotationsWithNames }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${image.name.split('.')[0]}_annotations.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast({
        title: "Exportado!",
        description: "As anotações foram exportadas para um arquivo JSON."
    })
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full bg-muted/30">
        {exam && image && examImages.length > 1 && (
            <ImageNavigation 
                exam={exam}
                examImages={examImages}
                currentImageId={image.id}
            />
        )}
       <div className="flex flex-1 overflow-hidden">
        <OntologySidebar 
            exam={exam}
            activeOntologyObjectId={activeOntologyObject?.id || null}
            onSelectObject={handleSelectObject}
        />
        <AnnotationToolbar 
            activeTool={activeTool} 
            setActiveTool={handleToolChange}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitToScreen={handleFitToScreen}
        />
        <div className="flex-1 h-full flex items-center justify-center p-4">
            <AnnotationCanvas
            ref={canvasRef}
            image={image}
            ontology={ontology}
            annotations={annotations}
            onAddAnnotation={handleAddAnnotation}
            activeTool={activeTool}
            setActiveTool={handleToolChange}
            activeOntologyObject={activeOntologyObject}
            selectedAnnotationId={selectedAnnotationId}
            setSelectedAnnotationId={setSelectedAnnotationId}
            />
        </div>
        <AnnotationSidebar
            image={image}
            annotations={annotations}
            ontology={ontology}
            selectedAnnotationId={selectedAnnotationId}
            setSelectedAnnotationId={setSelectedAnnotationId}
            onDeleteAnnotation={handleDeleteAnnotation}
            onUpdateAnnotation={handleUpdateAnnotation}
            onExport={exportAnnotations}
            onNotesChange={handleNotesChange}
        />
       </div>
    </div>
  );
}
