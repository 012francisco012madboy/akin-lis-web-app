import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export const CustomCameraWithModal = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Buscar dispositivos de vídeo ao carregar o componente
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true }); // Solicitar permissão
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Erro ao acessar dispositivos de vídeo:", error);
      }
    };

    fetchDevices();
  }, []);

  // Atualizar o feed de vídeo sempre que o dispositivo selecionado mudar
  useEffect(() => {
    if (selectedDeviceId) {
      startCamera(selectedDeviceId);
    }
  }, [selectedDeviceId]);

  // Iniciar a câmera selecionada
  const startCamera = async (deviceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Erro ao iniciar a câmera:", error);
    }
  };

  // Capturar imagem do feed de vídeo
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800">Custom Camera</h1>

      {/* Seleção de Câmera */}
      <select
        onChange={(e) => setSelectedDeviceId(e.target.value)}
        value={selectedDeviceId || ""}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Câmera ${device.deviceId}`}
          </option>
        ))}
      </select>

      {/* Feed de Vídeo */}
      <div className="w-full max-w-md h-64 border border-gray-300 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        ></video>
      </div>

      {/* Botão de Captura */}
      <button
        onClick={captureImage}
        className="px-6 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Capturar Imagem
      </button>

      {/* Imagem Capturada */}
      {capturedImage && (
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Imagem Capturada</h2>
          <Image
            width={200}
            height={200}
            src={capturedImage}
            alt="Imagem Capturada"
            className="w-full max-w-md h-auto rounded-lg border border-gray-300"
          />
        </div>
      )}

      {/* Canvas Oculto */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};



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

//         if (videoDevices.length > 0) {
//           setSelectedDeviceId(videoDevices[0].deviceId);
//         }
//       } catch (error) {
//         console.error("Erro ao acessar dispositivos de vídeo:", error);
//       }
//     };

//     fetchDevices();
//   }, []);

//   useEffect(() => {
//     if (selectedDeviceId) {
//       startCamera(selectedDeviceId);
//     }
//     return () => stopCamera(); // Cleanup quando o componente desmontar.
//   }, [selectedDeviceId]);

//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

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
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       const tracks = stream.getTracks();
//       tracks.forEach((track) => track.stop());
//       videoRef.current.srcObject = null;
//     }
//   };

//   const closeModal = () => {
//     stopCamera();
//     setIsModalOpen(false);
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

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
//       >
//         Abrir Câmera
//       </button>

//       {isModalOpen && (
//         <div
//           id="modal"
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//         >
//           <div className="max-w-7xl w-full h-full lg:h-[96%] bg-white rounded-lg overflow-y-auto shadow-lg">
//             <div className="p-4 border-b flex justify-between items-center">
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
//             </div>

//             <div className="p-4 flex flex-col lg:flex-row gap-4 max-h-[600px]">
//               <div className="lg:flex-1 bg-black h-80 lg:h-auto rounded-lg relative">
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   playsInline
//                   className="absolute inset-0 w-full h-full object-cover rounded-lg"
//                 />
//                 <button
//                   onClick={handleCaptureImage}
//                   className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Capturar Imagem
//                 </button>
//               </div>

//               <div className="flex-1 bg-white p-4 rounded-lg shadow">
//                 <textarea
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   placeholder="Escreva suas anotações aqui..."
//                   className="w-full h-72 max-h-[500px] min-h-[400px] border rounded-lg p-2"
//                 />
//               </div>
//             </div>

//             <div className="p-4 border-t flex justify-end gap-2">
//               <button
//                 onClick={() => {
//                   stopCamera();
//                   setIsModalOpen(false);
//                 }}
//                 className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
//               >
//                 Fechar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <section className="mt-6">
//         <h2 className="text-xl font-bold mb-4">Imagens Capturadas</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {capturedImages.map((image) => (
//             <div
//               key={image}
//               className="relative bg-gray-100 p-2 rounded-lg shadow-md"
//             >
//               <Image
//                 width={300}
//                 height={300}
//                 src={image}
//                 alt="Captured"
//                 className="w-full h-40 object-cover rounded-lg"
//                 onClick={() => setSelectedImage(image)}
//               />
//               <div className="absolute top-2 right-2 flex gap-2">
//                 <button
//                   onClick={() => handleDeleteImage(image)}
//                   className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   Deletar
//                 </button>
//                 <button
//                   onClick={() => setSelectedImage(image)}
//                   className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Visualizar
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <canvas ref={canvasRef} className=""></canvas>
//     </div>
//   );
// };
