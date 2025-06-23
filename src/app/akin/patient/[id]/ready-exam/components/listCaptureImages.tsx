import { Button } from "@/components/ui/button";
import UploadArea from "@/components/upload-area";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { MoveDiagonalIcon, Trash, Upload } from "lucide-react";
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
}

export const CapturedImages: React.FC<CapturedImagesProps> = ({
    capturedImages,
    maxCapturedImage,
    maxCaptures,
    setSelectedImage,
    handleDeleteImage
}) => {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

    const sendImageToIA = useMutation({
        mutationKey: ["sendImageToIA"],
        mutationFn: async (formData: FormData) => {
            const response = await processingImageRoute.sendImageToIA(formData);
            return response;
        },
        onError: () => {
            ___showErrorToastNotification({
                message: "Erro ao enviar imagem à IA. Tente novamente.",
            });
        },
        onSuccess: (data) => {
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

    const handleSendToIA = async () => {
        if (!uploadedFiles.length) {
            ___showErrorToastNotification({
                message: "Nenhuma imagem carregada.",
            });
            return;
        }
        setIsSending(true);
        const formData = new FormData();
        uploadedFiles.forEach((file, idx) => {
            formData.append("images", file, file.name || `image${idx + 1}.png`);
        });
        sendImageToIA.mutate(formData);
    };

    return (
        <section className="mt-6">
            {
                maxCapturedImage && maxCaptures ? (
                    <h2 className="text-xl font-bold mb-4">
                        Imagens Capturadas ({maxCapturedImage} / {maxCaptures})
                    </h2>
                ) : (
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold mb-4">
                            Imagens Capturadas
                        </h2>
                        <Button onClick={() => setUploadModalOpen(true)}>
                            Carregar Imagens
                            <Upload />
                        </Button>
                        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                            <DialogContent>
                                <DialogTitle>Carregar Imagens</DialogTitle>
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
                                <div className="flex justify-end mt-4 gap-2">
                                    <Button
                                        onClick={handleSendToIA}
                                        disabled={isSending || uploadedFiles.length === 0}
                                        className="bg-green-500 hover:bg-green-600"
                                    >
                                        {isSending ? "Enviando..." : "Enviar à IA"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {capturedImages.map((image, idx) => (
                    <div key={idx} className="relative bg-gray-100 p-2 rounded-lg shadow-md">
                        <Image
                            width={300}
                            height={300}
                            src={image}
                            alt={`Captured ${idx}`}
                            className="w-full object-cover rounded-lg"
                            onClick={() => setSelectedImage(image)}
                        />

                        <div className="flex gap-5">
                            <Button
                                variant="outline"
                                className=" w-[20px] h-[30px] absolute top-3 right-14 bg-red-500 text-white hover:bg-red-600"
                                onClick={() => handleDeleteImage(image)}
                            >
                                <Trash />
                            </Button>

                            <Button
                                variant="outline"
                                className=" w-[20px] h-[30px] absolute top-3 right-3 bg-akin-turquoise text-white hover:bg-akin-turquoise/90"
                                onClick={() => setSelectedImage(image)}
                            >
                                <MoveDiagonalIcon />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
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
                                <p className="text-sm"><strong>Per mm³:</strong> {result.calculations?.per_mm3}</p>
                                <p className="text-sm"><strong>Per µL (1):</strong> {result.calculations?.per_ul_1}</p>
                                <p className="text-sm"><strong>Per µL (2):</strong> {result.calculations?.per_ul_2}</p>
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
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={() => setIsResultsModalOpen(false)}
                        >
                            Fechar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
};