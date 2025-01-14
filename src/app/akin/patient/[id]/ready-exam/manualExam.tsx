"use client";

import CustomCamera from "@/app/akin/camera/camera";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ___showErrorToastNotification } from "@/lib/sonner";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface IManualExamProps {
  setIsModalOpen: (isOpen: boolean) => void;
  onCaptureImage: (images: string[]) => void;
}

export const ManualExam: React.FC<IManualExamProps> = ({ setIsModalOpen, onCaptureImage }) => {
  const cameraRef = useRef<{
    captureImage: () => void;
    stopCamera: () => void;
  }>(null);

  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCaptureImage = () => {
    if (!devices.length) {
    ___showErrorToastNotification({ message: "Nenhuma câmera detectada. Conecte uma câmera para capturar imagens." });
      setError("Nenhuma câmera detectada. Conecte uma câmera para capturar imagens.");
      return;
    }
    if (!cameraRef.current) {
      ___showErrorToastNotification({ message: "Erro ao acessar a câmera. Tente novamente." });
      setError("Erro ao acessar a câmera. Tente novamente.");
      return;
    }
    setError(null); // Limpa o erro antes de capturar
    cameraRef.current.captureImage();
  };

  const handleCloseModal = () => {
    cameraRef.current?.stopCamera();
    setIsModalOpen(false);
  };

  // Atualiza a lista de imagens capturadas
  useEffect(() => {
    if (currentImage) {
      setCapturedImages((prev) => {
        const updatedImages = [...prev, currentImage];
        onCaptureImage(updatedImages);
        return updatedImages;
      });
      setCurrentImage(null);
    }
  }, [currentImage, onCaptureImage]);

  // Valida se as câmeras foram detectadas ao montar o componente
  useEffect(() => {
    if (!devices.length) {

      setError("Nenhuma câmera detectada. Certifique-se de que a câmera está conectada.");
    } else {
      setError(null);
    }
  }, [devices]);

  return (
    <div
      id="modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="max-w-7xl w-full h-full lg:h-[96%] bg-white rounded-lg overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-lg font-semibold">Visualização de Amostras</h2>
          <select
            onChange={(e) => {
              const selectedDevice = devices.find(
                (device) => device.deviceId === e.target.value
              );
              if (selectedDevice) setDevices([selectedDevice]);
            }}
            value={devices[0]?.deviceId ? devices[0]?.deviceId: "Sem câmeras detectadas"}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {devices.length > 0 ? (
              devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Câmera ${device.deviceId}`}
                </option>
              ))
            ) : (
              <option disabled>Sem câmeras detectadas</option>
            )}
          </select>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col lg:flex-row gap-4 max-h-[600px]">
          {/* Camera View */}
          <div className="w-full h-80 lg:h-auto rounded-lg relative bg-black">
            <CustomCamera
              ref={cameraRef}
              getCapturedImage={(img) => setCurrentImage(img)}
              getAllVideoDevices={setDevices}
              className="h-full w-full"
              videoClassName="h-full w-full"
            />
            <Button
              onClick={handleCaptureImage}
              className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Capturar Imagem
            </Button>
          </div>

          {/* Notes Section */}
          <div className="w-full bg-white p-4 rounded-lg shadow">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escreva suas anotações aqui..."
              className="w-full h-72 max-h-[500px] min-h-[400px]"
            />
          </div>
        </div>

  
        {/* Captured Images */}
        {capturedImages.length > 0 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              Imagens Capturadas ({capturedImages.length})
            </h2>
            {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {capturedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative w-full h-64 bg-gray-100 rounded overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              ))}
            </div> */}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCloseModal}
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};
