"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CustomCamera from "@/app/akin/camera/camera";
import { ___showErrorToastNotification } from "@/lib/sonner";
import { CapturedImages } from "./components/listCaptureImages";
import { ImageModal } from "./components/selectedCaptureImages";

export default function AutomatedAnalysis({ isAutomatedAnalysisOpen, setIsAutomatedAnalysisOpen }: { isAutomatedAnalysisOpen: boolean, setIsAutomatedAnalysisOpen: (value: boolean) => void }) {

  const cameraRef = useRef<{
    captureImage: () => void;
    stopCamera: () => void;
  }>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isCapturing, setIsCapturing] = useState(false);
  const [timer, setTimer] = useState(5);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [maxCaptures, setMaxCaptures] = useState(20);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDeleteImage = (image: string) => {
    setCapturedImages((prev) => prev.filter((img) => img !== image));
  };

  const validateInputs = () => {
    if (maxCaptures <= 0) {
      ___showErrorToastNotification({
        message: "O número máximo de capturas deve ser maior que zero.",
      });
      return false;
    }
    if (timer <= 0) {
      ___showErrorToastNotification({
        message: "O intervalo de captura deve ser maior que zero.",
      });
      return false;
    }
    return true;
  };

  const handleStartCapturing = () => {
    if (!devices.length) {
      ___showErrorToastNotification({
        message: "Nenhuma câmera detectada. Conecte uma câmera para iniciar a captura.",
      });
      setError("Nenhuma câmera detectada. Conecte uma câmera para iniciar a captura.");
      return;
    }
    if (!validateInputs()) return;

    setError(null);
    setIsCapturing(true);
    setTimer(5);
    setCapturedImages([]);
    setMessage("Posicione a lâmina corretamente.");
  };

  const handleCaptureImage = React.useCallback(() => {
    if (!devices.length) {
      ___showErrorToastNotification({
        message: "Nenhuma câmera detectada. Conecte uma câmera para capturar imagens.",
      });
      setError("Nenhuma câmera detectada. Conecte uma câmera para capturar imagens.");
      return;
    }
    if (!cameraRef.current) {
      ___showErrorToastNotification({
        message: "Erro ao acessar a câmera. Tente novamente.",
      });
      setError("Erro ao acessar a câmera. Tente novamente.");
      return;
    }
    setError(null);
    cameraRef.current.captureImage();

    if (currentImage) {
      setCapturedImages((prev) => [...prev, currentImage]);
      setCurrentImage(null);
    }
    setMessage("Posicione a próxima lâmina.");
    if (capturedImages.length + 1 >= maxCaptures) setIsCapturing(false); // Adjusted condition
  }, [capturedImages.length, maxCaptures, currentImage, devices.length]);

  const handleStopCapturing = () => {
    setIsCapturing(false);
    setMessage("Captura finalizada. Escolha como enviar as imagens.");
  };

  const handleCloseModal = () => {
    if (cameraRef.current) {
      cameraRef.current.stopCamera()
      console.log(" camera fechou");
    }
  };

  useEffect(() => {
    if (!devices.length) {
      setError("Nenhuma câmera detectada. Certifique-se de que a câmera está conectada.");
    } else {
      setError(null);
    }
  }, [devices]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCapturing && capturedImages.length < maxCaptures) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 1 ? prev - 1 : 1));
        if (timer === 1) handleCaptureImage();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCapturing, timer, capturedImages.length, handleCaptureImage, maxCaptures]);

  return (
    isAutomatedAnalysisOpen && (
      <div className="h-full p-4 flex flex-col justify-between">
        <div className="flex flex-col h-full">
          <header className="bg-white shadow py-4 px-5 flex justify-between items-center rounded-md">
            <h1 className="text-lg font-semibold">Análise Automatizada</h1>

            <div>
              <h2 className="text-sm font-medium">Selecione</h2>
              <select
                onChange={(e) => {
                  const selectedDevice = devices.find(
                    (device) => device.deviceId === e.target.value
                  );
                  if (selectedDevice) setDevices([selectedDevice]);
                }}
                value={devices[0]?.deviceId || "Sem câmeras detectadas"}
                className="px-0 py-1.5 border mt-1 border-gray-200 rounded-sm shadow-sm text-sm"
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

            <div>
              <label htmlFor="maxCaptures" className="block text-sm font-medium">
                Máximo de Imagens
              </label>
              <input
                id="maxCaptures"
                type="number"
                value={maxCaptures}
                onChange={(e) => {
                  setMaxCaptures(Number(e.target.value))
                  console.log("Max. Cap:", maxCaptures);
                }}
                className="mt-1 block w-full px-2 py-1 border rounded"
              />
            </div>

            <div>
              <label htmlFor="timer" className="block text-sm font-medium">
                Intervalo (s)
              </label>
              <input
                id="timer"
                type="number"
                value={timer}
                onChange={(e) => setTimer(Number(e.target.value))}
                className="mt-1 block w-full px-2 py-1 border rounded"
              />
            </div>
            <Button onClick={handleStartCapturing} disabled={isCapturing}>
              Iniciar Captura
            </Button>
          </header>
          <section className="mt-6 overflow-y-auto h-full max-h-[500px] shadow-md rounded-md pb-10">
            <div className="w-[500px] h-[500px]">
              <CustomCamera
                ref={cameraRef}
                getCapturedImage={(img) => setCurrentImage(img)}
                getAllVideoDevices={setDevices}
                className="h-full w-full"
                videoClassName="h-full w-full"
                showDevices={false}
              />
            </div>

            <CapturedImages
              maxCapturedImage={String(capturedImages.length)}
              maxCaptures={String(maxCaptures)}
              capturedImages={capturedImages}
              handleDeleteImage={handleDeleteImage}
              setSelectedImage={setSelectedImage}
            />
            
            <ImageModal
              selectedImage={selectedImage}
              moreFuncIsShow={false}
            /> 

            {/* <ImageModal 
              selectedImage={selectedImage}
              notes={notes}
              handleNoteChange={handleNoteChange}
              setSelectedImage={setSelectedImage}
            /> */}

            {/* <h2 className="text-xl font-bold mb-2 mt-3">
              Imagens Capturadas ({capturedImages.length}/{maxCaptures})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {capturedImages.map((image, index) => (
                <Image
                  width={500}
                  height={500}
                  className="w-full h-40 object-cover rounded-md border"
                  key={index}
                  src={image}
                  alt={`Imagem ${index + 1}`}
                />
              ))}
            </div> */}
          </section>
          {isCapturing && (
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <p className="text-blue-800">Próxima captura em: {timer} segundos</p>
              <p className="text-blue-600">{message}</p>
            </div>
          )}
        </div>

        <footer className="mt-6 pb-3 gap-2 flex justify-between items-end">
          <div className="flex gap-3">
            <Button onClick={handleStopCapturing} disabled={!isCapturing}>
              Parar Captura
            </Button>
            <Button disabled={capturedImages.length === 0} className="bg-green-500 hover:bg-green-600">
              Finalizar e Enviar
            </Button>
          </div>
          <Button variant={"outline"} onClick={() => {
            handleCloseModal();
            setIsAutomatedAnalysisOpen(false)
          }}>
            Fechar
          </Button>
        </footer>
      </div>
    )
  );
}
