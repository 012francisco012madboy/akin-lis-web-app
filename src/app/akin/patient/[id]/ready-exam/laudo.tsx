/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function LaudoMicroscopio (){
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Cabeçalho */}
        <header className="bg-blue-600 text-white rounded-t-lg p-4">
          <h1 className="text-2xl font-bold">Laudo de Análise Microscópica</h1>
          <p className="text-sm mt-1">Emitido em: 25/12/2024</p>
        </header>

        {/* Informações do Paciente */}
        <section className="p-4 border-b">
          <h2 className="text-lg font-semibold">Informações do Paciente</h2>
          <p><strong>Nome:</strong> João da Silva</p>
          <p><strong>Idade:</strong> 45 anos</p>
          <p><strong>Identificação:</strong> #12345</p>
        </section>

        {/* Detalhes da Análise */}
        <section className="p-4 border-b">
          <h2 className="text-lg font-semibold">Detalhes da Análise</h2>
          <p className="mt-2">
            Durante a análise microscópica, foi possível observar estruturas celulares compatíveis com um tecido saudável. Não foram identificados sinais de anormalidades significativas. A análise incluiu coloração por hematoxilina-eosina e aumento de até 1000x.
          </p>
        </section>

        {/* Imagens Capturadas */}
        <section className="p-4 border-b">
          <h2 className="text-lg font-semibold">Imagens Capturadas</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <img
              src="https://via.placeholder.com/150"
              alt="Imagem 1"
              className="rounded shadow"
            />
            <img
              src="https://via.placeholder.com/150"
              alt="Imagem 2"
              className="rounded shadow"
            />
          </div>
        </section>

        {/* Conclusão e Assinatura */}
        <section className="p-4">
          <h2 className="text-lg font-semibold">Conclusão</h2>
          <p className="mt-2">
            Baseado nos resultados, não foram detectadas alterações relevantes. Recomenda-se acompanhamento regular e realização de exames complementares se necessário.
          </p>

          <div className="mt-6">
            <p><strong>Assinatura do Profissional:</strong></p>
            <p>Dr. Ana Clara Mendes</p>
            <p>CRM: 123456</p>
          </div>
        </section>
      </div>
    </div>
  );
};


