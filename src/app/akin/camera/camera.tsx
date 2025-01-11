import { useEffect, useState } from "react";

export const CameraSelector = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true }); // Solicitar permissão
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        console.log("Devices:", allDevices);
        const videoDevices = allDevices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Erro ao obter permissões de câmera:", error);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      startCamera(selectedDeviceId);
    }
  }, [selectedDeviceId]);

  const startCamera = async (deviceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
      });
      const videoElement = document.querySelector("video") as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.play();
      }
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error);
    }
  };

  console.log("Devices",devices);

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "16px" }}>
        Selecionar Câmera
      </h1>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <select
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          value={selectedDeviceId || ""}
          style={{ padding: "8px", fontSize: "16px" }}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Câmera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <video
          autoPlay
          playsInline
          style={{
            width: "80%",
            height: "auto",
            border: "2px solid #333",
            borderRadius: "8px",
          }}
        ></video>
      </div>
    </div>
  );
};