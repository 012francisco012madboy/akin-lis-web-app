"use client"
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { View } from "@/components/view";
import { useState } from "react";

interface IPayment {}

const breadcrumbItems = [
  {
    label: "Pagamento",
  },
];

// const getData = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   console.log("Payment");
//   return new Date().toLocaleString();
// };

export default function Payment({ }: IPayment) {
  const [open, setOpen] = useState(false);
  // const data = await getData();

  return (
    <View.Vertical className="h-screen px-6 py-4 bg-gray-50">
      {/* Breadcrumb Section */}
      <CustomBreadcrumb items={breadcrumbItems} borderB />

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


      {/* Toast Notification */}
      {/* <Toast.Provider>
        <Toast.Root open={open} onOpenChange={setOpen}>
          <Toast.Title>Pagamento realizado com sucesso!</Toast.Title>
          <Toast.Description>Friday, February 10, 2023 at 5:57 PM</Toast.Description>
          <Toast.Action asChild altText="Goto schedule to undo">
            <Button>Undo</Button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider> */}
    </View.Vertical>
  );
}
