import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UploadArea from "@/components/upload-area";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { MoveDiagonalIcon, Trash, Upload, Camera, Bot, ImageIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { processingImageRoute } from "@/Api/Routes/processing-image";

interface CapturedImagesProps {
    capturedImages: string[];
    setSelectedImage: (image: string | null) => void;
    handleDeleteImage: (image: string) => void;
    maxCapturedImage?: string;
    maxCaptures?: string;
    onCaptureImage?: (images: string[]) => void;
}

export const CapturedImages: React.FC<CapturedImagesProps> = ({
    capturedImages,
    maxCapturedImage,
    maxCaptures,
    setSelectedImage,
    handleDeleteImage,
    onCaptureImage
}) => {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [analysisChoiceModalOpen, setAnalysisChoiceModalOpen] = useState(false);
    const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

    const sendImageToIA = useMutation({
        mutationKey: ["sendImageToIA"],
        mutationFn: async (formData: FormData) => {
            const response = await processingImageRoute.sendImageToIA(formData);
            return response;
        },
        onError: () => {
            setIsProcessingModalOpen(false);
            ___showErrorToastNotification({
                message: "Erro ao enviar imagem à IA. Tente novamente.",
            });
        },
        onSuccess: (data) => {
            setIsProcessingModalOpen(false);
            ___showSuccessToastNotification({
                message: "Imagens enviadas com sucesso.",
            });
            setUploadedFiles([]);
            setUploadModalOpen(false);
            setResults(data);
            setIsResultsModalOpen(true);
        },
        onSettled: () => setIsSending(false),
    });

    const handleUploadAreaChange = (file: File) => {
        setUploadedFiles([file]);
    };

    const handleProceedWithChoice = () => {
        if (!uploadedFiles.length) {
            ___showErrorToastNotification({
                message: "Nenhuma imagem carregada.",
            });
            return;
        }
        setUploadModalOpen(false);
        setAnalysisChoiceModalOpen(true);
    };

    const handleManualAnalysis = () => {
        // Converter arquivos para URLs de imagem e adicionar às imagens capturadas
        const imageUrls = uploadedFiles.map(file => URL.createObjectURL(file));

        if (onCaptureImage) {
            onCaptureImage(imageUrls);
        }

        setUploadedFiles([]);
        setAnalysisChoiceModalOpen(false);

        ___showSuccessToastNotification({
            message: "Imagens carregadas para análise manual.",
        });
    };

    const handleSendToIA = async () => {
        setIsSending(true);
        setAnalysisChoiceModalOpen(false);
        setIsProcessingModalOpen(true);
        const formData = new FormData();
        uploadedFiles.forEach((file, idx) => {
            formData.append("images", file, file.name || `image${idx + 1}.png`);
        });
        sendImageToIA.mutate(formData);
    };

    return (
        <>
            <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ImageIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">
                                    {maxCapturedImage && maxCaptures ? 
                                        `Imagens Capturadas (${maxCapturedImage} / ${maxCaptures})` : 
                                        "Imagens Capturadas"
                                    }
                                </CardTitle>
                                <p className="text-sm text-gray-600 mt-1">
                                    {capturedImages.length === 0 ? 
                                        "Nenhuma imagem capturada ainda" : 
                                        `${capturedImages.length} imagem${capturedImages.length > 1 ? 's' : ''} disponível${capturedImages.length > 1 ? 'eis' : ''}`
                                    }
                                </p>
                            </div>
                        </div>
                        
                        {!maxCapturedImage && !maxCaptures && (
                            <Button onClick={() => setUploadModalOpen(true)} className="shadow-sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Carregar Imagens
                            </Button>
                        )}
                    </div>
                </CardHeader>
                
                <CardContent>
                    {capturedImages.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma imagem capturada</h3>
                            <p className="text-gray-600 mb-4">Capture ou carregue imagens para começar a análise</p>
                            {!maxCapturedImage && !maxCaptures && (
                                <Button onClick={() => setUploadModalOpen(true)} variant="outline">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Carregar Primeira Imagem
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {capturedImages.map((image, idx) => (
                                <Card key={idx} className="group relative overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                                    <div className="relative aspect-square">
                                        <Image
                                            width={300}
                                            height={300}
                                            src={image}
                                            alt={`Imagem capturada ${idx + 1}`}
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={() => setSelectedImage(image)}
                                        />
                                        
                                        {/* Overlay with actions */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="bg-white hover:bg-gray-100"
                                                    onClick={() => setSelectedImage(image)}
                                                >
                                                    <MoveDiagonalIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeleteImage(image)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Image info */}
                                    <div className="p-3 bg-white">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Imagem {idx + 1}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Clique para visualizar
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                Capturada
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upload Modal */}
            <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Carregar Imagens</DialogTitle>
                    </DialogHeader>
                    <UploadArea
                        onChange={handleUploadAreaChange}
                        acceptedTypes={[
                            "image/png",
                            "image/jpeg",
                            "image/jpg",
                            "image/gif",
                            "image/svg+xml"
                        ]}
                    />
                    <DialogFooter>
                        <Button
                            onClick={handleProceedWithChoice}
                            disabled={uploadedFiles.length === 0}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Continuar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Escolha de Análise */}
            <Dialog open={analysisChoiceModalOpen} onOpenChange={setAnalysisChoiceModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-lg font-semibold">
                            Escolha o Tipo de Análise
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-6">
                        <p className="text-center text-gray-600">
                            Como você gostaria de analisar as imagens carregadas?
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleManualAnalysis}
                                className="w-full"
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                Análise Manual
                            </Button>
                            <Button
                                onClick={handleSendToIA}
                                disabled={isSending}
                                variant="outline"
                                className="w-full"
                            >
                                <Bot className="h-4 w-4 mr-2" />
                                {isSending ? "Enviando..." : "Enviar para IA"}
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setAnalysisChoiceModalOpen(false)}
                            variant="outline"
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Processamento */}
            <Dialog open={isProcessingModalOpen} onOpenChange={() => {}}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-lg font-semibold">
                            Processando Análise
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4 py-6">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
                        <p className="text-center text-gray-600">
                            Enviando imagens para o Agent de IA...
                        </p>
                        <p className="text-sm text-center text-gray-500">
                            Por favor, aguarde enquanto processamos suas imagens.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de Resultados */}
            <Dialog open={isResultsModalOpen} onOpenChange={setIsResultsModalOpen}>
                <DialogContent className="max-w-4xl h-[90%] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-center text-lg font-semibold">
                            Resultados da Análise
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {results.map((result, index) => (
                            <Card key={index} className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">{result.filename}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="text-sm space-y-1">
                                        <p><strong>Contagem:</strong> {result.count}</p>
                                        <p><strong>Per mm³:</strong> {result.calculations?.per_mm3}</p>
                                        <p><strong>Per µL (1):</strong> {result.calculations?.per_ul_1}</p>
                                        <p><strong>Per µL (2):</strong> {result.calculations?.per_ul_2}</p>
                                    </div>
                                    {result.processed_image && (
                                        <div className="mt-4">
                                            <Separator className="mb-3" />
                                            <Image
                                                src={`data:image/png;base64,${result.processed_image}`}
                                                alt="Imagem processada"
                                                className="w-full h-auto rounded-md border"
                                                width={200}
                                                height={200}
                                                unoptimized
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <DialogFooter className="mt-6">
                        <Button
                            onClick={() => setIsResultsModalOpen(false)}
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};