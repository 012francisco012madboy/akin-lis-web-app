"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { _axios } from "@/Api/axios.config";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const resetToken = useSearchParams().get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      ___showErrorToastNotification({ message: "Por favor, insira uma senha." });
      setIsLoading(false);
      return;
    }
    if (!/\d/.test(newPassword)) {
      ___showErrorToastNotification({ message: "A senha deve conter pelo menos um número." });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const data = {
      resetToken,
      newPassword,
    };
    console.log(data);
    try {
      const response = await _axios.patch("/auth/reset-password", data);

      if (response.status === 200) {
        ___showSuccessToastNotification({ message: "Senha alterada com sucesso!" });
        window.location.href = "/";
      } else {
        ___showErrorToastNotification({ message: "Erro ao alterar a senha." });
      }
    } catch (error) {
      console.error("Erro:", error);
      ___showErrorToastNotification({ message: "Erro ao alterar a senha." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white h-[200px] w-[400px] p-4 rounded-md shadow-md">
        <h1>Crie uma nova senha</h1>
        <div className="flex flex-col gap-5">
          <div className="relative">
            <Input
              id="senha"
              name="senha"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua senha"
              aria-label="Digite sua senha"
              className="focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
            />
            <button
              type="button"
              className="absolute right-4 top-[20px] transform text-gray-500 -translate-y-1/2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          <Button type="submit" className="w-full bg-akin-turquoise hover:bg-akin-turquoise/90" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </div>
  );
}