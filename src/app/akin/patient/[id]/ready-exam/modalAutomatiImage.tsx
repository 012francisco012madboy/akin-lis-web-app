"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CustomCamera from "@/app/akin/camera/camera";

export default function AutomatedAnalysis({ isAutomatedAnalysisOpen, setIsAutomatedAnalysisOpen }: { isAutomatedAnalysisOpen: boolean, setIsAutomatedAnalysisOpen: (value: boolean) => void }) {

  const cameraRef = useRef<{
    captureImage: () => void;
    stopCamera: () => void;
  }>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isCapturing, setIsCapturing] = useState(false);
  const [timer, setTimer] = useState(1);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const maxCaptures = 20;


  const handleStartCapturing = () => {
    setIsCapturing(true);
    setTimer(5);
    setCapturedImages([]);
    setMessage("Posicione a lâmina corretamente.");
  };

  const handleCaptureImage = React.useCallback(() => {
    const newImage = `data:image/png;base64,${Math.random().toString(36).substring(2)}`;
    setCapturedImages((prev) => [...prev, newImage]);
    setMessage("Posicione a próxima lâmina.");
    if (capturedImages.length + 1 === maxCaptures) setIsCapturing(false);
  }, [capturedImages.length, maxCaptures]);

  const handleStopCapturing = () => {
    setIsCapturing(false);
    setMessage("Captura finalizada. Escolha como enviar as imagens.");
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
  }, [isCapturing, timer, capturedImages.length, handleCaptureImage]);


  return (
    isAutomatedAnalysisOpen && (
      <div className="h-full  p-4 flex flex-col justify-between  ">
        <div className="flex flex-col h-full ">
          <header className="bg-white shadow py-4 px-5 flex justify-between items-center rounded-md">
            <h1 className="text-lg font-semibold">Análise Automatizada</h1>
            <select
              onChange={(e) => {
                const selectedDevice = devices.find(
                  (device) => device.deviceId === e.target.value
                );
                if (selectedDevice) setDevices([selectedDevice]);
              }}
              value={devices[0]?.deviceId ? devices[0]?.deviceId : "Sem câmeras detectadas"}
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
              />
            </div>

            <h2 className="text-xl font-bold mb-2 mt-3">Imagens Capturadas ({capturedImages.length}/{maxCaptures})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {capturedImages.map((image, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                // <img
                //   key={index}
                //   src={image}
                //   alt={`Captura ${index}`}
                //   className="w-full h-40 object-cover rounded-md border"
                // />
                <Image
                  width={500}
                  height={500}
                  className="w-full h-40 object-cover rounded-md border"
                  key={index}
                  src={image}
                  alt={`Imagem ${index + 1}`}
                  objectFit="contain"
                />
              ))}
            </div>
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
            <Button onClick={handleStopCapturing} disabled={!isCapturing} className="">
              Parar Captura
            </Button>
            <Button disabled={capturedImages.length === 0} className="bg-green-500 hover:bg-green-600">
              Finalizar e Enviar
            </Button>
          </div>
          <Button variant={"outline"} onClick={() => {
            setIsAutomatedAnalysisOpen(false);
            console.log("fechou")
          }}>
            Fechar
          </Button>
        </footer>
      </div>
    )
  );
}
