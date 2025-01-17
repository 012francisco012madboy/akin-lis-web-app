
import { Button } from "@/components/ui/button";
import { MoveDiagonalIcon, Trash } from "lucide-react";
import Image from "next/image";

interface CapturedImagesProps {
    capturedImages: string[];
    setSelectedImage: (image: string | null) => void;
    handleDeleteImage: (image: string) => void;
    maxCapturedImage?: string;
    maxCaptures?: string;
}

export const CapturedImages: React.FC<CapturedImagesProps> = ({ capturedImages,
    maxCapturedImage, maxCaptures, setSelectedImage, handleDeleteImage }) => {
    return (
        <section className="mt-6">
            {
                maxCapturedImage && maxCaptures ? (
                    <h2 className="text-xl font-bold mb-4">
                        Imagens Capturadas ({maxCapturedImage} / {maxCaptures})
                    </h2>
                ) : (
                    <h2 className="text-xl font-bold mb-4">Imagens Capturadas </h2>
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
                            className="w-full h-40 object-cover rounded-lg"
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
        </section>
    );
};