"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function ForgotPassword() {
  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 bg-white h-[200px] w-[400px] p-4 rounded-md shadow-md ">
        <h1>Crie uma nova senha</h1>
        <div className="flex flex-col gap-5">
          <Input
            type="text"
            placeholder="Informe sua nova senha"
            className="focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
          />
          <Button className="w-full bg-akin-turquoise hover:bg-akin-turquoise/90">Enviar</Button>
        </div>
      </form>
    </div>
  )
}