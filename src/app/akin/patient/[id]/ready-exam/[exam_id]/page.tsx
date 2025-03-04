"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { _axios } from "@/lib/axios";
import AutomatedAnalysis from "../modalAutomatiImage";
import { ManualExam } from "../manualExam";
import { ImageModal, Shape } from "../components/selectedCaptureImages";
import { CapturedImages } from "../components/listCaptureImages";
import { LaudoModal } from "../laudo";


export default function SampleVisualizationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAutomatedAnalysisOpen, setIsAutomatedAnalysisOpen] = useState(false);
  const [imageAnnotations, setImageAnnotations] = useState<Record<string, Shape[]>>({}); // 🔹 Armazena anotações de todas as imagens
  const { id, exam_id } = useParams();

  const getPatientInfo = useQuery({
    queryKey: ['patient-info', id],
    queryFn: async () => {
      return await _axios.get<PatientType>(`/pacients/${id}`);
    }
  })
  console.log("exame", exam_id)
  const getExamById = useQuery({
    queryKey: ['Exam-Info', exam_id],
    queryFn: async () => {
      return await _axios.get(`/exams/${exam_id}`);
    }
  })

  console.log("getExamById", getExamById.data?.data)

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

  const handleClickOnGenerateLaudo = () => {
    setLaudoModalOpen(true);
  }
  const handleGenerateReport = () => {
    const reportData = capturedImages.map((image) => ({
      image,
      notes: notes[image] || "",
      //@ts-ignore
      annotations: imageAnnotations[image]?.shapes.map((shape) => ({
        ...shape,
        //@ts-ignore
        note: imageAnnotations[image]?.shapeNotes[shape.id] || "",
      })) || [],
    }));

    console.log("📌 Relatório de Anotações:", reportData);
  };

  const handleSendToAI = () => {
    const imagesWithNotes = capturedImages.map((image) => ({
      image,
      note: notes[image] || "",
    }));
    console.log("Enviando à IA:", imagesWithNotes);
    // Adicione a lógica para enviar o array de objetos à IA aqui
  };

  return (
    <div className="min-h-screen  overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow py-2 px-5 flex gap-2 flex-col lg:flex-row justify-between items-start lg:items-center rounded-md">
        <h1 className="text-lg font-semibold">Paciente: {getPatientInfo.data?.data.nome_completo}</h1>
        <h1 className="text-lg font-semibold">Exame: {getExamById.data?.data.data.Tipo_Exame.nome}</h1>
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
        setSelectedImage={setSelectedImage}
        notes={notes}
        handleNoteChanged={handleNoteChange} // ✅ Passando corretamente
        setImageAnnotations={setImageAnnotations} // ✅ Passando anotações
        moreFuncIsShow={true}
      />
      {/*
       <ImageModal
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        notes={notes}
        handleNoteChange={(image, value) => setNotes((prev) => ({ ...prev, [image]: value }))}
        setImageAnnotations={setImageAnnotations} // Passa para armazenar formas e notas das formas
        moreFuncIsShow={true}
      /> */}

      {/* Generate Report Button */}
      {capturedImages.length > 0 && (
        <div className="mt-6 flex justify-end gap-2">
          {/* <Button onClick={handleSendToAI} className="bg-green-500 hover:bg-green-600">
            Enviar à IA
          </Button>  */}

          <Button onClick={handleClickOnGenerateLaudo} className="bg-green-500 hover:bg-green-600">
            Gerar laudo
          </Button>
          <Button onClick={handleGenerateReport} className="bg-green-500 hover:bg-green-600">
            Concluir
          </Button>
        </div>
      )}

      <LaudoModal
        laudoModalOpen={laudoModalOpen}
        setLaudoModalOpen={setLaudoModalOpen}
      />
    </div >
  );
};