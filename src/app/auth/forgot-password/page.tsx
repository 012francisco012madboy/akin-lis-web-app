"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertSendEmail } from "./alertDialog";
import { _axios } from "@/lib/axios";


export default function ForgotPassword() {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    try {
      if (!email) {
        alert("Por favor, insira um email.");
        return;
      }
      const response = await _axios.post("/auth/forgot-password", { email });
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao enviar email de recuperação de senha:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white h-[200px] w-[400px] p-4 rounded-md shadow-md ">
        <h1>Esqueci minha senha</h1>
        <div className="flex flex-col gap-5">
          <Input
            name="email"
            type="email"
            placeholder="Informe seu email"
            className="focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
          />
          <AlertSendEmail>
            <Button
              type="submit"
              className="w-full bg-akin-turquoise hover:bg-akin-turquoise/90"
            >
              Enviar
            </Button>
          </AlertSendEmail>
        </div>
      </form>
    </div>
  )
}

