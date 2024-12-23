"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center p-10 bg-white shadow-lg rounded-lg">
        <h1 className="text-8xl font-extrabold text-red-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oops! A página que você está procurando não foi encontrada.
        </p>
        <Button className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={handleGoBack}>
          Voltar para a página anterior
        </Button>
      </div>
    </div>
  );
}
