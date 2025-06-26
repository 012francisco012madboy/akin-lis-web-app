"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Upload, X } from "lucide-react"

interface ImageCaptureProps {
  onImageCapture: (imageData: string) => void
}

export function ImageCapture({ onImageCapture }: ImageCaptureProps) {
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startWebcam = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      setStream(mediaStream)
      setIsWebcamActive(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Erro ao acessar webcam:", error)
      alert("Não foi possível acessar a webcam")
    }
  }, [])

  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsWebcamActive(false)
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageData = canvas.toDataURL("image/png")
        onImageCapture(imageData)
        stopWebcam()
      }
    }
  }, [onImageCapture, stopWebcam])

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          onImageCapture(result)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageCapture],
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload de arquivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Carregar Imagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Selecionar arquivo</Label>
              <Input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} ref={fileInputRef} />
            </div>
            <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Escolher Imagem
            </Button>
          </CardContent>
        </Card>

        {/* Captura via webcam */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Capturar Foto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isWebcamActive ? (
              <Button onClick={startWebcam} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Ativar Câmera
              </Button>
            ) : (
              <div className="space-y-4">
                <Button onClick={capturePhoto} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Capturar Foto
                </Button>
                <Button onClick={stopWebcam} variant="outline" className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview da webcam */}
      {isWebcamActive && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-md mx-auto rounded-lg" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
