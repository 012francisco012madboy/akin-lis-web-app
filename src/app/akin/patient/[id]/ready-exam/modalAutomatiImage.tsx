"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AutomatedAnalysis({ isAutomatedAnalysisOpen, setIsAutomatedAnalysisOpen }: { isAutomatedAnalysisOpen: boolean,setIsAutomatedAnalysisOpen: (value: boolean) => void }) {
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
    let interval: NodeJS.Timeout;
    if (isCapturing && capturedImages.length < maxCaptures) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 1 ? prev - 1 : 1));
        if (timer === 1) handleCaptureImage();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCapturing, timer, capturedImages.length,handleCaptureImage]);


  return (
    isAutomatedAnalysisOpen && (
      <div className="h-full  p-4 flex flex-col justify-between  ">
        <div className="flex flex-col h-full ">
          <header className="bg-white shadow py-4 px-5 flex justify-between items-center rounded-md">
            <h1 className="text-lg font-semibold">Análise Automatizada</h1>
            <Button onClick={handleStartCapturing} disabled={isCapturing}>
              Iniciar Captura
            </Button>
          </header>
          <section className="mt-6 overflow-y-auto h-full max-h-[500px] shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-2">Imagens Capturadas ({capturedImages.length}/{maxCaptures})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {capturedImages.map((image, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={idx}
                  src={image}
                  alt={`Captura ${idx}`}
                  className="w-full h-40 object-cover rounded-md border"
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
