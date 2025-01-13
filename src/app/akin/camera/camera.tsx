import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface CameraProps {
  getAllVideoDevices: (value: MediaDeviceInfo[]) => void;
  getCapturedImage: (value: string | null) => void;
  className?: string; // Classe de estilo personalizada
  videoClassName?: string; // Classe de estilo para o elemento de vídeo
}

const CustomCamera = forwardRef<{
  captureImage: () => void;
  stopCamera: () => void;
}, CameraProps>(
  ({ getAllVideoDevices, getCapturedImage, className, videoClassName }, ref) => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); // Estado para erros
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Buscar dispositivos de vídeo ao carregar o componente
    useEffect(() => {
      const fetchDevices = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = allDevices.filter(
            (device) => device.kind === "videoinput"
          );
          getAllVideoDevices(videoDevices);
          setDevices(videoDevices);

          if (videoDevices.length > 0) {
            setSelectedDeviceId(videoDevices[0].deviceId);
          } else {
            setError("Nenhuma câmera disponível.");
          }
        } catch (err) {
          setError("Erro ao acessar dispositivos de vídeo. Verifique as permissões.");
          console.error("Erro ao acessar dispositivos de vídeo:", err);
        }
      };

      fetchDevices();
    }, [getAllVideoDevices]);

    // Atualizar o feed de vídeo sempre que o dispositivo selecionado mudar
    useEffect(() => {
      if (selectedDeviceId) {
        startCamera(selectedDeviceId);
      }
      return () => stopCamera(); // Liberar recursos ao desmontar
    }, [selectedDeviceId]);

    const startCamera = async (deviceId: string) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: deviceId ? { exact: deviceId } : undefined },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setError(null); // Limpar erros anteriores
        }
      } catch (err) {
        setError("Erro ao iniciar a câmera. Verifique as permissões.");
        console.error("Erro ao iniciar a câmera:", err);
      }
    };

    const stopCamera = () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null; // Limpar o stream no elemento de vídeo
      }
    };

    const captureImage = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL("image/png");
          getCapturedImage(imageData);
        }
      } else {
        console.error("Erro ao capturar imagem: vídeo ou canvas não disponível.");
        setError("Erro ao capturar imagem.");
      }
    };

    // Permitir que funções sejam expostas ao componente pai
    useImperativeHandle(ref, () => ({
      captureImage,
      stopCamera, // Expor a função stopCamera
    }));

    return (
      <div className={className}>
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
        <div
          className={`w-full h-96 border border-gray-300 rounded-lg overflow-hidden ${videoClassName}`}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          ></video>
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    );
  }
);

CustomCamera.displayName = "CustomCamera";
export default CustomCamera;


//ollllllllllllllllll
// import Image from "next/image";
// import { useEffect, useState, useRef } from "react";

// export const CustomCameraWithModal = () => {
//   const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
//   const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
//   const [capturedImages, setCapturedImages] = useState<string[]>([]);
//   const [notes, setNotes] = useState<string>("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         const allDevices = await navigator.mediaDevices.enumerateDevices();
//         const videoDevices = allDevices.filter(
//           (device) => device.kind === "videoinput"
//         );
//         setDevices(videoDevices);
//         if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
//       } catch (error) {
//         console.error("Erro ao acessar dispositivos de vídeo:", error);
//       }
//     };

//     fetchDevices();
//   }, []);

//   useEffect(() => {
//     if (selectedDeviceId) startCamera(selectedDeviceId);
//     return () => stopCamera(); // Cleanup
//   }, [selectedDeviceId]);

//   const startCamera = async (deviceId: string) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { deviceId: { exact: deviceId } },
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }
//     } catch (error) {
//       console.error("Erro ao iniciar a câmera:", error);
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current?.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach((track) => track.stop());
//       videoRef.current.srcObject = null;
//     }
//   };

//   const handleCaptureImage = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");
//       if (context) {
//         canvas.width = videoRef.current.videoWidth;
//         canvas.height = videoRef.current.videoHeight;
//         context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//         const imageData = canvas.toDataURL("image/png");
//         setCapturedImages((prev) => [...prev, imageData]);
//       }
//     }
//   };

//   const handleDeleteImage = (image: string) => {
//     setCapturedImages((prev) => prev.filter((img) => img !== image));
//   };

//   const closeModal = () => {
//     stopCamera();
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
//       >
//         Abrir Câmera
//       </button>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="max-w-4xl w-full h-auto bg-white rounded-lg shadow-lg overflow-hidden">
//             <header className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-lg font-semibold">Visualização de Amostras</h2>
//               <select
//                 value={selectedDeviceId || ""}
//                 onChange={(e) => setSelectedDeviceId(e.target.value)}
//                 className="px-3 py-2 border rounded"
//               >
//                 {devices.map((device) => (
//                   <option key={device.deviceId} value={device.deviceId}>
//                     {device.label || `Camera ${device.deviceId}`}
//                   </option>
//                 ))}
//               </select>
//             </header>

//             <main className="p-4 flex flex-col lg:flex-row gap-6">
//               <div className="lg:w-1/2 bg-black relative rounded-lg">
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   playsInline
//                   className="absolute inset-0 w-full h-full object-cover rounded-lg"
//                 />
//                 <button
//                   onClick={handleCaptureImage}
//                   className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-md"
//                 >
//                   Capturar Imagem
//                 </button>
//               </div>
//               <div className="lg:w-1/2">
//                 <textarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   placeholder="Escreva suas anotações..."
//                   className="w-full h-64 border rounded-lg p-2 resize-none"
//                 />
//               </div>
//             </main>

//             <footer className="p-4 border-t flex justify-end">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
//               >
//                 Fechar
//               </button>
//             </footer>
//           </div>
//         </div>
//       )}

//       <section className="mt-6">
//         <h2 className="text-xl font-bold mb-4">Imagens Capturadas</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {capturedImages.map((image) => (
//             <div key={image} className="relative">
//               <Image
//                 src={image}
//                 alt="Imagem capturada"
//                 width={300}
//                 height={300}
//                 className="w-full h-40 object-cover rounded-lg"
//               />
//               <button
//                 onClick={() => handleDeleteImage(image)}
//                 className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//               >
//                 Deletar
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// };
