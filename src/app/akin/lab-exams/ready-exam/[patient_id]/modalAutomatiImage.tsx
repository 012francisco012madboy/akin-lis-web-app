"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CustomCamera from "@/app/akin/camera/camera";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { CapturedImages } from "./components/listCaptureImages";
import { ImageModal } from "./components/selectedCaptureImages";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { processingImageRoute } from "@/Api/Routes/processing-image";

interface CapturedImage {
  id: string;
  dataUrl: string;
  timestamp: Date;
}

export default function AutomatedAnalysis({ isAutomatedAnalysisOpen, setIsAutomatedAnalysisOpen }: { isAutomatedAnalysisOpen: boolean, setIsAutomatedAnalysisOpen: (value: boolean) => void }) {

  const cameraRef = useRef<{
    captureImage?: () => void;
    stopCamera?: () => void;
    restartCamera?: () => void;
    startAutoCapture?: () => void;
    stopAutoCapture?: () => void;
  }>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados para captura automática com o novo CustomCamera
  const [isCapturing, setIsCapturing] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(5); // Renomeado de timer para intervalSeconds
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]); // Usando interface CapturedImage
  const [message, setMessage] = useState("");
  const [captureCount, setCaptureCount] = useState(20); // Renomeado de maxCaptures para captureCount

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false); // New state to track sending status
  const [results, setResults] = useState<any[]>([]); // State to store backend results
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false); // State to control results modal visibility
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (currentImage) {
      setNotes((prev) => ({ ...prev, [currentImage]: value }));
    }
  };

  // Callback para receber imagens capturadas do CustomCamera
  const handleCapturedImagesChange = useCallback((images: CapturedImage[]) => {
    setCapturedImages(images);
    setIsCapturing(images.length > 0 && images.length < captureCount);
  }, [captureCount]);

  const sendImageToIA = useMutation({
    mutationKey: ["sendImageToIA"],
    mutationFn: async (formData: FormData) => {
      const response = await processingImageRoute.sendImageToIA(formData);
      return response;
    },
    onError: (error) => {
      ___showErrorToastNotification({
        message: "Erro ao enviar imagem à IA. Tente novamente.",
      });
    },
    onSuccess: (data) => {
      console.log("data", data);
      ___showSuccessToastNotification({
        message: "Imagem enviada com sucesso.",
      });
      setCapturedImages([]);
      setIsCapturing(false);
    }
  })


  const handleDeleteImage = (imageId: string) => {
    setCapturedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const validateInputs = () => {
    if (captureCount <= 0) {
      ___showErrorToastNotification({
        message: "O número máximo de capturas deve ser maior que zero.",
      });
      return false;
    }
    if (intervalSeconds <= 0) {
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
    setCapturedImages([]);
    setMessage("Iniciando captura automática...");

    // Usar o método startAutoCapture do CustomCamera
    if (cameraRef.current?.startAutoCapture) {
      cameraRef.current.startAutoCapture();
    }
  };

  // Simplificada - apenas captura manual, pois a automática é feita pelo CustomCamera
  const handleCaptureImage = useCallback(() => {
    if (!devices.length) {
      ___showErrorToastNotification({
        message: "Nenhuma câmera detectada. Conecte uma câmera para capturar imagens.",
      });
      setError("Nenhuma câmera detectada. Conecte uma câmera para capturar imagens.");
      return;
    }
    if (!cameraRef.current?.captureImage) {
      ___showErrorToastNotification({
        message: "Erro ao acessar a câmera. Tente novamente.",
      });
      setError("Erro ao acessar a câmera. Tente novamente.");
      return;
    }
    setError(null);
    cameraRef.current.captureImage();
    setMessage("Imagem capturada manualmente.");
  }, [devices.length]);

  useEffect(() => {
    if (!devices.length) {
      setError("Nenhuma câmera detectada. Certifique-se de que a câmera está conectada.");
    } else {
      setError(null);
    }
  }, [devices]);

  const [isCameraOn, setIsCameraOn] = useState(true); // Ligada como padrão



  const handleStopCapturing = () => {
    setIsCapturing(false);
    setMessage("Captura finalizada. Escolha como enviar as imagens.");

    // Parar captura automática usando o método do CustomCamera
    if (cameraRef.current?.stopAutoCapture) {
      cameraRef.current.stopAutoCapture();
    }
  };

  const handleCloseModal = () => {
    if (cameraRef.current?.stopCamera) {
      cameraRef.current.stopCamera();
    }
    if (cameraRef.current?.stopAutoCapture) {
      cameraRef.current.stopAutoCapture();
    }
  };

  const handleSendImageToIA = async () => {
    if (!capturedImages.length) {
      ___showErrorToastNotification({
        message: "Nenhuma imagem capturada. Capture imagens para enviar à IA.",
      });
      return;
    }

    setIsSending(true);
    const formData = new FormData();

    capturedImages.forEach((image, index) => {
      // Converter a imagem base64 para Blob usando o dataUrl
      const byteCharacters = atob(image.dataUrl.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      formData.append("images", blob, `image${index + 1}.png`);
    });

    console.log("📌 Enviando FormData para o servidor:", formData);

    sendImageToIA.mutate(formData, {
      onSuccess: (data) => {
        console.log("📌 Resultados da IA:", data);
        setResults(data);
        setIsResultsModalOpen(true);
      },
      onSettled: () => setIsSending(false),
    });
  };

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
                disabled={isSending} // Disable while sending
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
              <label htmlFor="captureCount" className="block text-sm font-medium">
                Máximo de Imagens
              </label>
              <input
                id="captureCount"
                type="number"
                value={captureCount}
                onChange={(e) => {
                  setCaptureCount(Number(e.target.value))
                }}
                className="mt-1 block w-full px-2 py-1 border rounded"
                disabled={isSending}
              />
            </div>

            <div>
              <label htmlFor="intervalSeconds" className="block text-sm font-medium">
                Intervalo (s)
              </label>
              <input
                id="intervalSeconds"
                type="number"
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                className="mt-1 block w-full px-2 py-1 border rounded"
                disabled={isSending}
              />
            </div>
            <Button onClick={handleStartCapturing} disabled={isCapturing || isSending}>
              Iniciar Captura
            </Button>
          </header>
          <section className="mt-6 overflow-y-auto h-full max-h-[500px] shadow-md rounded-md pb-10">
            <div className="p-4 flex items-center flex-col lg:flex-row gap-4 max-h-[600px]">
              {isAutomatedAnalysisOpen && (
                <CustomCamera
                  ref={cameraRef}
                  getCapturedImage={(img) => setCurrentImage(img)}
                  getCapturedImages={handleCapturedImagesChange}
                  getAllVideoDevices={setDevices}
                  captureCount={captureCount}
                  intervalSeconds={intervalSeconds}
                  className="h-full w-full"
                  videoClassName="h-full w-full"
                  showDevices={false}
                />
              )}

              <Textarea
                value={currentImage ? notes[currentImage] || "" : ""}
                onChange={handleNotesChange}
                placeholder="Escreva suas anotações aqui..."
                className="w-full h-full max-h-[500px] min-h-[400px]"
              />
            </div>

            {/* Seção de informações das imagens capturadas
            Essa é feita pelo agent claud
            */}
            {/* {capturedImages.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Imagens Capturadas ({capturedImages.length}/{captureCount})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {capturedImages.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <Image
                        src={image.dataUrl}
                        alt={`Captura ${index + 1}`}
                        width={100}
                        height={80}
                        className="w-full h-20 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedImage(image.dataUrl)}
                        unoptimized
                      />
                      <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        #{index + 1}
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                        {image.timestamp.toLocaleTimeString()}
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 left-1 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image.id);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Última captura: {capturedImages.length > 0 ? capturedImages[capturedImages.length - 1].timestamp.toLocaleString() : 'Nenhuma'}</p>
                  <p>Intervalo configurado: {intervalSeconds}s</p>
                </div>
              </div>
            )} */}

            <CapturedImages
              maxCapturedImage={String(capturedImages.length)}
              maxCaptures={String(captureCount)}
              capturedImages={capturedImages.map(img => img.dataUrl)} // Converter para array de strings
              handleDeleteImage={(imageUrl: string) => {
                // Encontrar a imagem pelo dataUrl e deletar pelo id
                const imageToDelete = capturedImages.find(img => img.dataUrl === imageUrl);
                if (imageToDelete) {
                  handleDeleteImage(imageToDelete.id);
                }
              }}
              setSelectedImage={setSelectedImage}
            />

            <ImageModal
              setSelectedImage={setSelectedImage}
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
              <p className="text-blue-800">Captura automática em andamento...</p>
              <p className="text-blue-600">{message}</p>
              <p className="text-sm text-blue-500">
                Capturas: {capturedImages.length}/{captureCount}
              </p>
            </div>
          )}
        </div>

        <footer className="mt-6 pb-3 gap-2 flex justify-between items-end">
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={async () => {
                if (cameraRef.current) {
                  if (isCameraOn) {
                    cameraRef.current.stopCamera?.();
                    setIsCameraOn(false);
                  } else {
                    // Para religar, usar restartCamera
                    cameraRef.current.restartCamera?.();
                    setIsCameraOn(true);
                  }
                }
              }}
              disabled={isSending}
            >
              {isCameraOn ? "Desligar Câmera" : "Ligar Câmera"}
            </Button>



            <Button onClick={handleStopCapturing} disabled={!isCapturing || isSending}>
              Parar Captura
            </Button>
            <Button type={"button"} disabled={capturedImages.length === 0 || isSending} onClick={() => {
              handleSendImageToIA();
            }} className="bg-green-500 hover:bg-green-600">
              Finalizar e Enviar à IA
            </Button>
          </div>
          <Button variant={"outline"} onClick={() => {
            handleCloseModal();
            setIsAutomatedAnalysisOpen(false)
          }} disabled={isSending}>
            Fechar
          </Button>
        </footer>

        {/* Modal for sending images */}
        <Dialog open={isSending}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviando Imagens</DialogTitle>
            </DialogHeader>
            <p className="text-center mt-4">Por favor, aguarde enquanto as imagens estão sendo enviadas...</p>
          </DialogContent>
        </Dialog>

        {/* Modal for displaying results */}
        <Dialog open={isResultsModalOpen} onOpenChange={setIsResultsModalOpen}>
          <DialogContent className="max-w-4xl h-[90%] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-semibold">Resultados da Análise</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {results.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
                  <p className="text-sm font-medium"><strong>Arquivo:</strong> {result.filename}</p>
                  <p className="text-sm"><strong>Contagem:</strong> {result.count}</p>
                  <p className="text-sm"><strong>Per mm³:</strong> {result.calculations.per_mm3}</p>
                  <p className="text-sm"><strong>Per µL (1):</strong> {result.calculations.per_ul_1}</p>
                  <p className="text-sm"><strong>Per µL (2):</strong> {result.calculations.per_ul_2}</p>
                  {result.processed_image && (
                    <Image
                      src={`data:image/png;base64,${result.processed_image}`}
                      alt="Processed"
                      className="mt-4 w-full h-auto rounded-md border"
                      width={200}
                      height={200}
                      unoptimized
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Button
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 "
                onClick={() => setIsResultsModalOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  );
}
