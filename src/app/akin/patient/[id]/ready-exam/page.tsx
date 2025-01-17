"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import AutomatedAnalysis from "./modalAutomatiImage";
import { ManualExam } from "./manualExam";
import { CapturedImages } from "./components/listCaptureImages";
import { ImageModal } from "./components/selectedCaptureImages";
import { LaudoModal } from "./laudo";


export default function SampleVisualizationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAutomatedAnalysisOpen, setIsAutomatedAnalysisOpen] = useState(false);

  const handleDeleteImage = (image: string) => {
    setCapturedImages((prev) => prev.filter((img) => img !== image));
    setNotes((prev) => {
      const updatedNotes = { ...prev };
      delete updatedNotes[image];
      return updatedNotes;
    });
  };

  const handleNoteChange = (image: string, value: string) => {
    setNotes((prev) => ({ ...prev, [image]: value }));
  };

  const handleAutomatedAnalysisOpen = () => {
    setIsAutomatedAnalysisOpen(true);
  };

  // Laudo Modal
  const [laudoModalOpen, setLaudoModalOpen] = useState(false);
  const handleGenerateReport = () => {
    // Lógica de geração de relatório (simulada)
    console.log("Gerando relatório com notas:", notes);
    setLaudoModalOpen(true); // Abre o modal do laudo
  };

  return (
    <div className="min-h-screen bg-gray-50  overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow py-2 px-5 flex gap-2 flex-col lg:flex-row justify-between items-start lg:items-center rounded-md">
        <h1 className="text-lg font-semibold">Paciente: Jorge Mateus</h1>
        <h1 className="text-lg font-semibold">Exame: Malária</h1>
        <DropdownMenu >
          <DropdownMenuTrigger className="bg-black text-white px-2 py-2 rounded-md hover:bg-black/90">
            Iniciar Analíse
          </DropdownMenuTrigger>

          <DropdownMenuContent aria-roledescription="menu">
            <DropdownMenuItem onClick={() => { setIsModalOpen(true); }}>
              Analíse Manual
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { handleAutomatedAnalysisOpen(); }}>
              Analíse Automatizada
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Automated Analysis Section */}
      {
        isAutomatedAnalysisOpen && (
          <div id="modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-7xl w-full h-full lg:h-[96%] bg-white rounded-lg overflow-y-auto shadow-lg">
              <AutomatedAnalysis
                isAutomatedAnalysisOpen={isAutomatedAnalysisOpen}
                setIsAutomatedAnalysisOpen={setIsAutomatedAnalysisOpen}
              />
            </div>
          </div>
        )
      }

      {/* Modal for Visualization */}
      {isModalOpen && (
        <ManualExam
          setIsModalOpen={setIsModalOpen}
          onCaptureImage={(images) => {
            setCapturedImages((prevImages) => {
              // Filtrar imagens novas que não estão na lista atual
              const newImages = images.filter((image) => !prevImages.includes(image));
              return [...prevImages, ...newImages];
            });
          }}
        />
      )}

      <CapturedImages
        capturedImages={capturedImages}
        setSelectedImage={setSelectedImage}
        handleDeleteImage={handleDeleteImage}
      />

      <ImageModal
        selectedImage={selectedImage}
        notes={notes}
        handleNoteChange={handleNoteChange}
        setSelectedImage={setSelectedImage}
      />

      {/* Generate Report Button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleGenerateReport} className="bg-green-500 hover:bg-green-600">
          Concluir
        </Button>
      </div>

      <LaudoModal
        laudoModalOpen={laudoModalOpen}
        setLaudoModalOpen={setLaudoModalOpen}
      />
    </div >
  );
};