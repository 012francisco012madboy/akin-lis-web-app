"use client";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface CapturedImage {
  id: string;
  dataUrl: string;
  timestamp: Date;
}

interface CameraProps {
  showDevices?: boolean; // Mostrar dispositivos conectados
  showErrors?: boolean; // Mostrar erros
  getAllVideoDevices?: (value: MediaDeviceInfo[]) => void;
  getCapturedImage?: (value: string | null) => void;
  getCapturedImages?: (value: CapturedImage[]) => void; // Callback para múltiplas imagens
  className?: string; // Classe de estilo personalizada
  videoClassName?: string; // Classe de estilo para o elemento de vídeo
  errorClassName?: string; // Classe de estilo para exibir erros
  setCameraError?: (value: string | null) => void;
  enableAutoCapture?: boolean; // Habilitar captura automática
  captureCount?: number; // Número de capturas automáticas
  intervalSeconds?: number; // Intervalo entre capturas em segundos
}

const CustomCamera = forwardRef<{
  captureImage?: () => void;
  stopCamera?: () => void;
  restartCamera?: () => void;
  startAutoCapture?: () => void;
  stopAutoCapture?: () => void;
}, CameraProps>(
  (
    {
      showDevices = true,
      showErrors = true,
      getAllVideoDevices,
      getCapturedImage,
      getCapturedImages,
      className,
      videoClassName,
      errorClassName,
      setCameraError,
      enableAutoCapture = false,
      captureCount = 5,
      intervalSeconds = 3,
    },
    ref
  ) => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Estados para captura automática
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
    const [currentCapture, setCurrentCapture] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Buscar dispositivos de vídeo
    useEffect(() => {
      const fetchDevices = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = allDevices.filter(
            (device) => device.kind === "videoinput"
          );
          getAllVideoDevices?.(videoDevices);
          setDevices(videoDevices);

          if (videoDevices.length > 0) {
            setSelectedDeviceId(videoDevices[0].deviceId);
            setError(null);
          } else {
            const noCameraError = "Nenhuma câmera disponível.";
            setError(noCameraError);
            setCameraError?.(noCameraError);
          }
        } catch (err) {
          const permissionsError =
            "Erro ao acessar dispositivos de vídeo. Verifique as permissões.";
          setError(permissionsError);
          setCameraError?.(permissionsError);
          console.error("Error:", err);
        }
      };

      fetchDevices();
    }, [getAllVideoDevices, setCameraError]);


    const startCamera = useCallback(async (deviceId: string) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: deviceId ? { exact: deviceId } : undefined },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setError(null);
        }
      } catch (err) {
        const startCameraError = "Erro ao iniciar a câmera. Verifique as permissões.";
        setError(startCameraError);
        setCameraError?.(startCameraError);
        console.error("Error:", err);
      }
    }, [setCameraError]);

    const stopCamera = useCallback(() => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }, []);

    // Atualizar feed de vídeo ao trocar de dispositivo
    useEffect(() => {
      if (selectedDeviceId) {
        startCamera(selectedDeviceId);
      }
      return () => stopCamera();
    }, [selectedDeviceId, startCamera, stopCamera]);

    const restartCamera = useCallback(() => {
      if (selectedDeviceId) {
        stopCamera();
        startCamera(selectedDeviceId);
      }
    }, [selectedDeviceId, stopCamera, startCamera]);

    // Capturar uma foto e armazenar na lista
    const capturePhoto = useCallback(() => {
      if (!videoRef.current || !canvasRef.current) return null;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      // Definir dimensões do canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Desenhar frame atual do vídeo no canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Converter para data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

      const newImage: CapturedImage = {
        id: Date.now().toString(),
        dataUrl,
        timestamp: new Date(),
      };

      setCapturedImages((prev) => {
        const updatedImages = [...prev, newImage];
        getCapturedImages?.(updatedImages);
        return updatedImages;
      });

      return newImage;
    }, [getCapturedImages]);

    // Iniciar captura automática
    const startAutoCapture = useCallback(() => {
      if (!videoRef.current?.srcObject) {
        console.warn("Câmera não está ativa");
        return;
      }

      setIsCapturing(true);
      setCurrentCapture(0);
      setCapturedImages([]);

      let captureIndex = 0;
      let countdownValue = intervalSeconds;

      const captureInterval = setInterval(() => {
        if (countdownValue > 0) {
          setCountdown(countdownValue);
          countdownValue--;
        } else {
          // Capturar foto
          capturePhoto();
          captureIndex++;
          setCurrentCapture(captureIndex);

          if (captureIndex >= captureCount) {
            clearInterval(captureInterval);
            setIsCapturing(false);
            setCountdown(0);
          } else {
            countdownValue = intervalSeconds;
          }
        }
      }, 1000);

      intervalRef.current = captureInterval;

      return () => clearInterval(captureInterval);
    }, [captureCount, intervalSeconds, capturePhoto]);

    // Parar captura automática
    const stopAutoCapture = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsCapturing(false);
      setCountdown(0);
    }, []);

    // Cleanup ao desmontar componente
    useEffect(() => {
      return () => {
        stopAutoCapture();
        stopCamera();
      };
    }, [stopAutoCapture, stopCamera]);

    const captureImage = () => {
      if (!videoRef.current || !canvasRef.current) {
        const captureError =
          "Erro ao capturar imagem: vídeo ou canvas não disponível.";
        setError(captureError);
        setCameraError?.(captureError);
        return;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        const contextError =
          "Erro ao capturar imagem: contexto do canvas não disponível.";
        setError(contextError);
        setCameraError?.(contextError);
        return;
      }

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      getCapturedImage?.(imageData);
      setError(null);
      setCameraError?.(null);
    };

    useImperativeHandle(ref, () => ({
      captureImage,
      stopCamera,
      restartCamera,
      startAutoCapture,
      stopAutoCapture,
    }));

    return (
      <div className={className}>
        {showDevices && (
          <select
            className="w-full mb-4 border rounded p-2 dark:text-black"
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Câmera ${device.deviceId}`}
              </option>
            ))}
          </select>
        )}
        <div
          className={`w-full h-full border rounded-lg overflow-hidden relative ${videoClassName}`}
        >
          {error && showErrors ? (
            <p className={`text-red-500 text-center ${errorClassName}`}>
              {error}
            </p>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              ></video>

              {/* Countdown Overlay */}
              {countdown > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">{countdown}</div>
                    <div className="text-lg">Capturando em...</div>
                  </div>
                </div>
              )}

              {/* Capture Status Overlay */}
              {isCapturing && countdown === 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Capturando {currentCapture}/{captureCount}
                </div>
              )}
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    );
  }
);

CustomCamera.displayName = "CustomCamera";
export default CustomCamera;