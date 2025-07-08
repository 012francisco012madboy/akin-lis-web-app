import Image from "next/image";
import { APP_CONFIG } from "@/components/layout/app";

export default function Loading() {
  return (
    <div className="min-w-full min-h-screen flex flex-col items-center justify-center">
      <Image src={APP_CONFIG.LOGO} alt="Loading" width={200} height={200} />
      {/* <span className="font-bold animate-bounce text-">⌛Aguarde...</span> */}
    </div>
  );
}
