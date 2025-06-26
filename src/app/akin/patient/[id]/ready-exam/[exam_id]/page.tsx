"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AutomatedAnalysis from "../modalAutomatiImage";
import { ManualExam } from "../manualExam";
import { ImageModal, Shape } from "../components/selectedCaptureImages";
import { CapturedImages } from "../components/listCaptureImages";
import { LaudoModal } from "../laudo";
import { _axios } from "@/Api/axios.config";


export default function SampleVisualizationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAutomatedAnalysisOpen, setIsAutomatedAnalysisOpen] = useState(false);
  const [imageAnnotations, setImageAnnotations] = useState<Record<string, Shape[]>>({});

  //@ts-ignore
  const { id, exam_id } = useParams();

  const getPatientInfo = useQuery({
    queryKey: ['patient-info', id],
    queryFn: async () => {
      return await _axios.get<PatientType>(`/pacients/${id}`);
    }
  })
  const getExamById = useQuery({
    queryKey: ['Exam-Info', exam_id],
    queryFn: async () => {
      return await _axios.get(`/exam-types/${exam_id}`);
    }
  })

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
  };

  return (
    <div className="min-h-screen overflow-y-auto pb-2">
      {getPatientInfo.isLoading || getExamById.isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-400 rounded w-3/4"></div>
            <div className="h-6 bg-gray-400 rounded w-1/2"></div>
            <div className="h-6 bg-gray-400 rounded w-full"></div>
            <div className="h-6 bg-gray-400 rounded w-5/6"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white shadow rounded-md p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Paciente: {getPatientInfo.data?.data.nome_completo}</h2>
                <p className="text-gray-600">Exame: {getExamById.data?.data.data.nome}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  Análise Manual
                </Button>
                <Button onClick={handleAutomatedAnalysisOpen} className="bg-gray-600 hover:bg-gray-700">
                  Análise Automática
                </Button>
              </div>
            </div>
          </div>

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
            onCaptureImage={(images) => {
              setCapturedImages((prevImages) => {
                // Filtrar imagens novas que não estão na lista atual
                const newImages = images.filter((image) => !prevImages.includes(image));
                return [...prevImages, ...newImages];
              });
            }}
          />

          <ImageModal
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            notes={notes}
            handleNoteChanged={handleNoteChange}
            setImageAnnotations={setImageAnnotations}
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
            <div className="mt-6 flex justify-end gap-3">
              <Button onClick={() => {
                handleClickOnGenerateLaudo();
                handleGenerateReport();
              }} className="bg-green-600 hover:bg-green-700">
                Gerar Laudo
              </Button>
            </div>
          )}
          <LaudoModal
            laudoModalOpen={laudoModalOpen}
            setLaudoModalOpen={setLaudoModalOpen}
          />
        </>
      )}
    </div >
  );
};