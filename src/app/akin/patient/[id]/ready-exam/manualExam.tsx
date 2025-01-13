"use client";
import CustomCamera from "@/app/akin/camera/camera";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface IManualExamProps {
  setIsModalOpen: (isOpen: boolean) => void;
  onCaptureImage: (images: string[]) => void;
}

export const ManualExam: React.FC<IManualExamProps> = ({ setIsModalOpen, onCaptureImage }) => {
  const cameraRef = useRef<{ captureImage: () => void } | null>(null);

  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [getCapturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCaptureImage = () => {
    if (cameraRef.current) {
      cameraRef.current.captureImage();
    }
  };

  // Monitor changes to getCapturedImage and update the capturedImages array
  useEffect(() => {
    if (getCapturedImage) {
      const updatedImages = [...capturedImages, getCapturedImage];
      setCapturedImages(updatedImages);
      onCaptureImage(updatedImages);
      setCapturedImage(null); // Reset captured image after adding
    }
  }, [getCapturedImage, capturedImages, onCaptureImage]);

  return (
    <div id="modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-7xl w-full h-full lg:h-[96%] bg-white rounded-lg overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Visualização de Amostras</h2>
          <select
            onChange={(e) => {
              const selectedDevice = devices.find(
                (device) => device.deviceId === e.target.value
              );
              if (selectedDevice) {
                setDevices([selectedDevice]);
              }
            }}
            value={devices[0]?.deviceId || ""}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Câmera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col lg:flex-row gap-4 max-h-[600px]">
          {/* Camera View */}
          <div className="w-full h-80 lg:h-auto rounded-lg relative bg-black">
            <CustomCamera
              ref={cameraRef}
              getCapturedImage={(e: string | null) => setCapturedImage(e)}
              getAllVideoDevices={(devices: MediaDeviceInfo[]) => setDevices(devices)}
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
        {/* <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Imagens Capturadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {capturedImages.map((image, index) => (
              <div key={index} className="relative w-full h-64 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={image}
                  alt={`Imagem ${index + 1}`}
                  layout="fill"
                  objectFit="contain"
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div> */}

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};
