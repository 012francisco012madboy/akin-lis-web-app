/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MoveDiagonal, Trash } from "lucide-react";
import { useParams } from "next/navigation";

const SampleVisualizationPage = ({ patientName }: { patientName: string }) => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCaptureImage = () => {
    // Simulate capturing an image (replace with actual camera capture logic)
    const newImage = `data:image/png;base64,${Math.random().toString(36).substring(2)}`;
    setCapturedImages((prev) => [...prev, newImage]);
  };

  const handleDeleteImage = (image: string) => {
    setCapturedImages((prev) => prev.filter((img) => img !== image));
  };

  const handleGenerateReport = () => {
    // Implement report generation logic
    console.log("Generating report with:", { capturedImages, notes });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow py-4 px-6 flex gap-2 flex-col lg:flex-row justify-between items-start lg:items-center">
        <h1 className="text-lg font-semibold">Paciente: Jorge Mateus {patientName}</h1>
        <h1 className="text-lg font-semibold">Exame: Malária</h1>
        <Button onClick={() => setIsModalOpen(true)}>Iniciar Visualização</Button>
      </header>

      {/* Modal for Visualization */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl w-full h-full lg:h-[96%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualização de Amostras</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col lg:flex-row gap-4 max-h-[600px]">
            {/* Camera View */}
            <div className="lg:flex-1 bg-black h-80 lg:h-auto rounded-lg relative">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                {/* Replace with actual camera feed */}
                <p className="text-lg">Câmera Ativa</p>
              </div>
              <Button
                onClick={handleCaptureImage}
                className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600"
              >
                Capturar Imagem
              </Button>
            </div>

            {/* Notes Section */}
            <div className="flex-1 bg-white p-4 rounded-lg shadow">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escreva suas anotações aqui..."
                className="w-full h-72 max-h-[550px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Captured Images Section */}
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Imagens Capturadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {capturedImages.map((image, idx) => (
            <div key={idx} className="relative bg-gray-100 p-2 rounded-lg shadow-md">
              <div className="size-[200px] rounded-md bg-black">
                <img
                  src={image}
                  alt={`Captured ${idx}`}
                  className="w-full h-40 object-cover rounded-lg"
                  onClick={() => setSelectedImage(image)}
                />
              </div>

              <div className="absolute top-2 right-2 flex flex-col gap-5">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDeleteImage(image)}
                >
                  <Trash />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => setSelectedImage(image)}
                >
                <MoveDiagonal />
                </Button>


              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Image and Notes Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-xl h-full lg:h-[95%]  overflow-y-auto">
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
    </div>
  );
};

export default SampleVisualizationPage;
