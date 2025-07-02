"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { View } from "@/components/view";
import { useState } from "react";

interface IPayment {}

export default function Payment({ }: IPayment) {
  const [open, setOpen] = useState(false);

  return (
    <View.Vertical className="h-screen px-6 py-4 bg-gray-50">
      {/* Breadcrumb Section */}

      {/* Payment Header */}
      <div className="flex flex-col items-center mt-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Detalhes do Pagamento</h1>
        <p className="text-lg text-gray-600">Pagamento realizado em: 28/05/2020</p>
      </div>

      {/* Payment Form */}
      <div className="flex flex-col gap-6 mt-8 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Payment Amount Input */}
        <div>
          <Input
            placeholder="Digite o valor do pagamento"
            type="number"
            className="w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Payment Method Input */}
        <div>
          <Input
            placeholder="Selecione o método"
            className="w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Payment Confirmation */}
        <div>
          <Button
            className="bg-green-600 text-white hover:bg-green-700 w-full py-2 rounded-lg"
            onClick={() => {
              setOpen(true);
            }}
          >
            Confirmar Pagamento
          </Button>
        </div>

        {/* Cancel Button */}
        <div>
          <Button
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 w-full py-2 rounded-lg"
            onClick={() => {
              // Handle cancellation logic here
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
      <h1>Tela em Versao Beta </h1>
    </View.Vertical>
  );
}
