
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// export const ModalAutomatiImage = () => {

//   return (
//     <div>
//       <Dialog>
//         <DialogContent className="max-w-7xl w-full h-full lg:h-[96%] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Visualização de Amostras</DialogTitle>
//           </DialogHeader>

//           <div className="flex flex-col lg:flex-row gap-4 max-h-[600px]">
//             {/* Camera View */}
//             <div className="lg:flex-1 bg-black h-80 lg:h-auto rounded-lg relative">
//               <div className="absolute inset-0 flex items-center justify-center text-white">
//                 {/* Replace with actual camera feed */}
//                 <p className="text-lg">Câmera Ativa</p>
//               </div>
//               <Button
//                 onClick={}
//                 className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600"
//               >
//                 Capturar Imagem
//               </Button>
//             </div>

//             {/* Notes Section */}
//             <div className="flex-1 bg-white p-4 rounded-lg shadow">
//               <Textarea
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 placeholder="Escreva suas anotações aqui..."
//                 className="w-full h-72 max-h-[550px]"
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsModalOpen(false)}>
//               Fechar
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AutomatedAnalysis({ isAutomatedAnalysisOpen }: { isAutomatedAnalysisOpen: boolean }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [timer, setTimer] = useState(5);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const maxCaptures = 20;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCapturing && capturedImages.length < maxCaptures) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 1 ? prev - 1 : 5));
        if (timer === 1) handleCaptureImage();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCapturing, timer, capturedImages.length]);

  const handleStartCapturing = () => {
    setIsCapturing(true);
    setTimer(5);
    setCapturedImages([]);
    setMessage("Posicione a lâmina corretamente.");
  };

  const handleCaptureImage = () => {
    const newImage = `data:image/png;base64,${Math.random().toString(36).substring(2)}`;
    setCapturedImages((prev) => [...prev, newImage]);
    setMessage("Posicione a próxima lâmina.");
    if (capturedImages.length + 1 === maxCaptures) setIsCapturing(false);
  };

  const handleStopCapturing = () => {
    setIsCapturing(false);
    setMessage("Captura finalizada. Escolha como enviar as imagens.");
  };

  return (
    isAutomatedAnalysisOpen && (
      <div className="min-h-screen bg-gray-50 p-4">
        <header className="bg-white shadow py-4 px-5 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Análise Automatizada</h1>
          <Button onClick={handleStartCapturing} disabled={isCapturing}>
            Iniciar Captura
          </Button>
        </header>

        <section className="mt-6">
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

        <footer className="mt-6 flex justify-end">
          <Button onClick={handleStopCapturing} disabled={!isCapturing} className="mr-2">
            Parar Captura
          </Button>
          <Button disabled={capturedImages.length === 0} className="bg-green-500 hover:bg-green-600">
            Finalizar e Enviar
          </Button>
        </footer>
      </div>
    )
  );
}
