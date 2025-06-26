/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Download, Play, Square, Settings, Timer, ImageIcon, Trash2 } from "lucide-react"
import CustomCamera from "./camera"



export default function Cameras() {
  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Custom Camera com Captura Automática</h2>
          <CustomCameraExample />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Camera Capture Original</h2>
          <CameraCapture />
        </div>
      </div>
    </div>
  );
}

function CustomCameraExample() {
  const cameraRef = useRef<{
    captureImage?: () => void;
    stopCamera?: () => void;
    startAutoCapture?: () => void;
    stopAutoCapture?: () => void;
  }>(null);

  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [captureCount, setCaptureCount] = useState(5);
  const [intervalSeconds, setIntervalSeconds] = useState(3);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleStartAutoCapture = () => {
    if (cameraRef.current?.startAutoCapture) {
      setIsCapturing(true);
      cameraRef.current.startAutoCapture();
    }
  };

  const handleStopAutoCapture = () => {
    if (cameraRef.current?.stopAutoCapture) {
      setIsCapturing(false);
      cameraRef.current.stopAutoCapture();
    }
  };

  const handleCaptureImage = () => {
    if (cameraRef.current?.captureImage) {
      cameraRef.current.captureImage();
    }
  };

  const downloadImage = useCallback((image: CapturedImage, index: number) => {
    const link = document.createElement("a")
    link.href = image.dataUrl
    link.download = `custom-camera-${index + 1}-${image.timestamp.toISOString().slice(0, 19).replace(/:/g, "-")}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, []);

  const downloadAllImages = useCallback(() => {
    capturedImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image, index), index * 100)
    })
  }, [capturedImages, downloadImage]);

  const clearImages = useCallback(() => {
    setCapturedImages([]);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Captura</CardTitle>
          <CardDescription>Configure o número de capturas e o intervalo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="captureCount">Número de Capturas</Label>
              <Input
                id="captureCount"
                type="number"
                min="1"
                max="50"
                value={captureCount}
                onChange={(e) => setCaptureCount(Number(e.target.value))}
                disabled={isCapturing}
              />
            </div>
            <div>
              <Label htmlFor="interval">Intervalo (segundos)</Label>
              <Input
                id="interval"
                type="number"
                min="1"
                max="60"
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                disabled={isCapturing}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCaptureImage} disabled={isCapturing}>
              <Camera className="w-4 h-4 mr-2" />
              Capturar Foto
            </Button>

            {!isCapturing ? (
              <Button onClick={handleStartAutoCapture} variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Iniciar Captura Automática
              </Button>
            ) : (
              <Button onClick={handleStopAutoCapture} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                Parar Captura
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Câmera</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomCamera
            ref={cameraRef}
            captureCount={captureCount}
            intervalSeconds={intervalSeconds}
            getCapturedImages={setCapturedImages}
            setCameraError={setError}
            className="space-y-4"
            videoClassName="aspect-video"
          />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {capturedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Imagens Capturadas ({capturedImages.length})
              <div className="flex gap-2">
                <Button onClick={downloadAllImages} size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Todas
                </Button>
                <Button onClick={clearImages} size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {capturedImages.map((image, index) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.dataUrl}
                    alt={`Captura ${index + 1}`}
                    className="w-full aspect-video object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      onClick={() => downloadImage(image, index)}
                      size="sm"
                      variant="secondary"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


interface CapturedImage {
  id: string
  dataUrl: string
  timestamp: Date
}

function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([])
  const [error, setError] = useState<string>("")

  // Configurações
  const [captureCount, setCaptureCount] = useState(5)
  const [intervalSeconds, setIntervalSeconds] = useState(3)
  const [currentCapture, setCurrentCapture] = useState(0)
  const [countdown, setCountdown] = useState(0)

  // Iniciar stream da câmera
  const startCamera = useCallback(async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsStreaming(true)
      }
    } catch (err) {
      setError("Erro ao acessar a câmera. Verifique as permissões.")
      console.error("Erro ao acessar câmera:", err)
    }
  }, [])

  // Parar stream da câmera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
    setIsCapturing(false)
    setCountdown(0)
  }, [])

  // Capturar uma foto
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    // Definir dimensões do canvas
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Desenhar frame atual do vídeo no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Converter para data URL
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8)

    const newImage: CapturedImage = {
      id: Date.now().toString(),
      dataUrl,
      timestamp: new Date(),
    }

    setCapturedImages((prev) => [...prev, newImage])
    return newImage
  }, [])

  // Iniciar captura automática
  const startAutoCapture = useCallback(() => {
    if (!isStreaming) return

    setIsCapturing(true)
    setCurrentCapture(0)
    setCapturedImages([])

    let captureIndex = 0
    let countdownValue = intervalSeconds

    const captureInterval = setInterval(() => {
      if (countdownValue > 0) {
        setCountdown(countdownValue)
        countdownValue--
      } else {
        // Capturar foto
        capturePhoto()
        captureIndex++
        setCurrentCapture(captureIndex)

        if (captureIndex >= captureCount) {
          clearInterval(captureInterval)
          setIsCapturing(false)
          setCountdown(0)
        } else {
          countdownValue = intervalSeconds
        }
      }
    }, 1000)

    return () => clearInterval(captureInterval)
  }, [isStreaming, captureCount, intervalSeconds, capturePhoto])

  // Parar captura automática
  const stopAutoCapture = useCallback(() => {
    setIsCapturing(false)
    setCountdown(0)
  }, [])

  // Download de uma imagem
  const downloadImage = useCallback((image: CapturedImage, index: number) => {
    const link = document.createElement("a")
    link.href = image.dataUrl
    link.download = `captura-${index + 1}-${image.timestamp.toISOString().slice(0, 19).replace(/:/g, "-")}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  // Download de todas as imagens
  const downloadAllImages = useCallback(() => {
    capturedImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image, index), index * 100)
    })
  }, [capturedImages, downloadImage])

  // Limpar imagens capturadas
  const clearImages = useCallback(() => {
    setCapturedImages([])
    setCurrentCapture(0)
  }, [])

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Camera className="w-8 h-8" />
            Captura Automática de Fotos
          </h1>
          <p className="text-muted-foreground">Configure o número de capturas e o intervalo entre elas</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Câmera
              </CardTitle>
              <CardDescription>Visualização da câmera e controles de captura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Preview */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Clique em &quot;Iniciar Câmera&quot; para começar</p>
                    </div>
                  </div>
                )}

                {/* Countdown Overlay */}
                {countdown > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-2">{countdown}</div>
                      <p className="text-white">Preparando captura...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex gap-2">
                {!isStreaming ? (
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Iniciar Câmera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="outline" className="flex-1">
                    <Square className="w-4 h-4 mr-2" />
                    Parar Câmera
                  </Button>
                )}

                {isStreaming && !isCapturing && (
                  <Button onClick={startAutoCapture} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Captura
                  </Button>
                )}

                {isCapturing && (
                  <Button onClick={stopAutoCapture} variant="destructive" className="flex-1">
                    <Square className="w-4 h-4 mr-2" />
                    Parar Captura
                  </Button>
                )}
              </div>

              {/* Status */}
              {isCapturing && (
                <div className="text-center space-y-2">
                  <Badge variant="secondary" className="text-sm">
                    <Timer className="w-3 h-3 mr-1" />
                    Captura {currentCapture} de {captureCount}
                  </Badge>
                  {countdown > 0 && <p className="text-sm text-muted-foreground">Próxima captura em {countdown}s</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </CardTitle>
              <CardDescription>Configure os parâmetros de captura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="captureCount">Número de Capturas</Label>
                <Input
                  id="captureCount"
                  type="number"
                  min="1"
                  max="50"
                  value={captureCount}
                  onChange={(e) => setCaptureCount(Number(e.target.value))}
                  disabled={isCapturing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Intervalo entre Capturas (segundos)</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  max="60"
                  value={intervalSeconds}
                  onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                  disabled={isCapturing}
                />
              </div>

              <div className="pt-4 space-y-2">
                <h4 className="font-medium">Resumo da Configuração:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• {captureCount} fotos serão capturadas</p>
                  <p>• Intervalo de {intervalSeconds}s entre cada captura</p>
                  <p>• Tempo total: ~{(captureCount - 1) * intervalSeconds}s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Captured Images Section */}
        {capturedImages.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Fotos Capturadas ({capturedImages.length})
                  </CardTitle>
                  <CardDescription>Clique em uma foto para fazer download individual</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={downloadAllImages} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Todas
                  </Button>
                  <Button onClick={clearImages} variant="outline" size="sm">
                    Limpar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {capturedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative group cursor-pointer"
                    onClick={() => downloadImage(image, index)}
                  >
                    <img
                      src={image.dataUrl || "/placeholder.svg"}
                      alt={`Captura ${index + 1}`}
                      className="w-full aspect-video object-cover rounded-lg border hover:border-primary transition-colors"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="absolute top-2 left-2 text-xs">{index + 1}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hidden Canvas for Image Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}




// const ChatkinRequest = () => {
//   const [response, setResponse] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSendRequest = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch('https://chatkin.osapicare.com/recepsionista', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: 'Oi',
//           user_id: 'cmc2dcxdy0001f40zj9evza1v',
//           session_id: 'sjkd',
//           email: 'rec@gmail.com',
//           senha: 'rec2025',
//         }),
//       });

//       if (!res.ok) {
//         throw new Error(`Erro ${res.status}: ${res.statusText}`);
//       }

//       const data = await res.json();
//       console.log('Resposta do Chatkin:', data);
//       setResponse(JSON.stringify(data, null, 2));
//     } catch (err: any) {
//       setError(err.message || 'Erro inesperado');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto border rounded shadow">
//       <h1 className="text-xl font-bold mb-4">Enviar mensagem ao Chatkin</h1>
//       <button
//         onClick={handleSendRequest}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//       >
//         {loading ? 'Enviando...' : 'Enviar'}
//       </button>

//       {response && (
//         <pre className="mt-4 p-2 bg-gray-100 border rounded overflow-x-auto">
//           {response}
//         </pre>
//       )}

//       {error && (
//         <p className="text-red-600 mt-4">Erro: {error}</p>
//       )}
//     </div>
//   );
// };