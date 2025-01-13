/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoveDiagonalIcon, Trash } from "lucide-react";
import AutomatedAnalysis from "./modalAutomatiImage";
import { ManualExam } from "./manualExam";

export default function SampleVisualizationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAutomatedAnalysisOpen, setIsAutomatedAnalysisOpen] = useState(false);

  const handleCaptureImage = () => {
    const newImage = `data:image/png;base64,${Math.random().toString(36).substring(2)}`;
    setCapturedImages((prev) => [...prev, newImage]);
  };

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
    <div className="min-h-screen bg-gray-50 p-4 overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow py-2 px-5 flex gap-2 flex-col lg:flex-row justify-between items-start lg:items-center rounded-md">
        <h1 className="text-lg font-semibold">Paciente: Jorge Mateus</h1>
        <h1 className="text-lg font-semibold">Exame: Malária</h1>
        <DropdownMenu onOpenChange={(open) => {
          console.log("Menu state:", open);
        }}>
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
            console.log("Imagens capturadas ola:", images);
            setCapturedImages(images);
            console.log("ola:", capturedImages)
          }}
        />
      )}

      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Imagens Capturadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capturedImages.map((image, idx) => (
            <div key={idx} className="relative bg-gray-100 p-2 rounded-lg shadow-md">
              <Image
                width={300}
                height={300}
                src={image}
                alt={`Captured ${idx}`}
                className="w-full h-40 object-cover rounded-lg"
                onClick={() => setSelectedImage(image)}
              />

              <div className="flex gap-5">
                <Button
                  variant="outline"
                  className=" w-[20px] h-[30px] absolute top-3 right-14 bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDeleteImage(image)}>
                  <Trash />
                </Button>

                <Button
                  variant="outline"
                  className=" w-[20px] h-[30px] absolute top-3 right-3 bg-akin-turquoise text-white hover:bg-akin-turquoise/90"
                  onClick={() => setSelectedImage(image)}>
                  <MoveDiagonalIcon/>
                </Button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-xl h-full lg:h-[95%] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Imagem Capturada</DialogTitle>
            </DialogHeader>
            <div className="w-full h-[300px] bg-black rounded-md">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="mt-4">
              <Textarea
                value={notes[selectedImage] || ""}
                onChange={(e) => handleNoteChange(selectedImage, e.target.value)}
                placeholder="Anotações para esta imagem..."
                className="w-full h-40 max-h-52"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedImage(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}


      {/* Generate Report Button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleGenerateReport} className="bg-green-500 hover:bg-green-600">
          Concluir
        </Button>
      </div>


      <Dialog open={laudoModalOpen} onOpenChange={() => setLaudoModalOpen(false)}>
        <DialogContent className="max-w-4xl w-full h-[95%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Laudo de Análise Microscópica</DialogTitle>
          </DialogHeader>
          <div className="max-w-4xl bg-white shadow-lg rounded-lg overflow-y-auto">
            {/* Cabeçalho */}
            <header className="bg-blue-600 text-white rounded-t-lg p-4">
              <p className="text-sm mt-1">Emitido em: 25/12/2024</p>
            </header>

            {/* Informações do Paciente */}
            <section className="p-4 border-b">
              <h2 className="text-lg font-semibold">Informações do Paciente</h2>
              <p><strong>Nome:</strong> João da Silva</p>
              <p><strong>Idade:</strong> 45 anos</p>
              <p><strong>Identificação:</strong> #12345</p>
            </section>

            {/* Detalhes da Análise */}
            <section className="p-4 border-b">
              <h2 className="text-lg font-semibold">Detalhes da Análise</h2>
              <p className="mt-2">
                Durante a análise microscópica, foi possível observar estruturas celulares compatíveis com um tecido saudável. Não foram identificados sinais de anormalidades significativas. A análise incluiu coloração por hematoxilina-eosina e aumento de até 1000x.
              </p>
            </section>

            {/* Imagens Capturadas */}
            <section className="p-4 border-b">
              <h2 className="text-lg font-semibold">Imagens Capturadas</h2>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Imagem 1"
                  className="rounded shadow"
                />
                <img
                  src="https://via.placeholder.com/150"
                  alt="Imagem 2"
                  className="rounded shadow"
                />
              </div>
            </section>

            {/* Conclusão e Assinatura */}
            <section className="p-4">
              <h2 className="text-lg font-semibold">Conclusão</h2>
              <p className="mt-2">
                Baseado nos resultados, não foram detectadas alterações relevantes. Recomenda-se acompanhamento regular e realização de exames complementares se necessário.
              </p>

              <div className="mt-6">
                <p><strong>Assinatura do Profissional:</strong></p>
                <p>Dr. Ana Clara Mendes</p>
                <p>CRM: 123456</p>
              </div>
            </section>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-akin-turquoise text-white">
              Partilhar
            </Button>
            <Button variant="outline" onClick={() => setLaudoModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
};