// /* eslint-disable @next/next/no-img-element */
// import React from "react";

// export default function LaudoMicroscopio (){
//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
//         {/* Cabeçalho */}
//         <header className="bg-blue-600 text-white rounded-t-lg p-4">
//           <h1 className="text-2xl font-bold">Laudo de Análise Microscópica</h1>
//           <p className="text-sm mt-1">Emitido em: 25/12/2024</p>
//         </header>

//         {/* Informações do Paciente */}
//         <section className="p-4 border-b">
//           <h2 className="text-lg font-semibold">Informações do Paciente</h2>
//           <p><strong>Nome:</strong> João da Silva</p>
//           <p><strong>Idade:</strong> 45 anos</p>
//           <p><strong>Identificação:</strong> #12345</p>
//         </section>

//         {/* Detalhes da Análise */}
//         <section className="p-4 border-b">
//           <h2 className="text-lg font-semibold">Detalhes da Análise</h2>
//           <p className="mt-2">
//             Durante a análise microscópica, foi possível observar estruturas celulares compatíveis com um tecido saudável. Não foram identificados sinais de anormalidades significativas. A análise incluiu coloração por hematoxilina-eosina e aumento de até 1000x.
//           </p>
//         </section>

//         {/* Imagens Capturadas */}
//         <section className="p-4 border-b">
//           <h2 className="text-lg font-semibold">Imagens Capturadas</h2>
//           <div className="grid grid-cols-2 gap-4 mt-2">
//             <img
//               src="https://via.placeholder.com/150"
//               alt="Imagem 1"
//               className="rounded shadow"
//             />
//             <img
//               src="https://via.placeholder.com/150"
//               alt="Imagem 2"
//               className="rounded shadow"
//             />
//           </div>
//         </section>

//         {/* Conclusão e Assinatura */}
//         <section className="p-4">
//           <h2 className="text-lg font-semibold">Conclusão</h2>
//           <p className="mt-2">
//             Baseado nos resultados, não foram detectadas alterações relevantes. Recomenda-se acompanhamento regular e realização de exames complementares se necessário.
//           </p>

//           <div className="mt-6">
//             <p><strong>Assinatura do Profissional:</strong></p>
//             <p>Dr. Ana Clara Mendes</p>
//             <p>CRM: 123456</p>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import Image from 'next/image';
//@ts-ignore
import html2pdf from 'html2pdf.js';

interface LaudoModalProps {
  laudoModalOpen: boolean;
  setLaudoModalOpen: (isOpen: boolean) => void;
}

export const LaudoModal = ({ laudoModalOpen, setLaudoModalOpen }: LaudoModalProps) => {
  const [nomePaciente, setNomePaciente] = useState('João da Silva');
  const [idadePaciente, setIdadePaciente] = useState(45);
  const [identificacaoPaciente, setIdentificacaoPaciente] = useState('#12345');
  const [detalhesAnalise, setDetalhesAnalise] = useState(
    'Durante a análise microscópica, foi possível observar estruturas celulares compatíveis com um tecido saudável. Não foram identificados sinais de anormalidades significativas. A análise incluiu coloração por hematoxilina-eosina e aumento de até 1000x.'
  );
  const [conclusao, setConclusao] = useState(
    'Baseado nos resultados, não foram detectadas alterações relevantes. Recomenda-se acompanhamento regular e realização de exames complementares se necessário.'
  );

  const generatePDF = () => {
    const content = document.getElementById('laudo-content');
    if (content) {
      const options = {
        margin: 0,
        filename: `laudo_${nomePaciente.replace(' ', '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf().set(options).from(content).save();
    }
  };

  return (
    <Dialog open={laudoModalOpen} onOpenChange={() => setLaudoModalOpen(false)}>
      <DialogContent className="max-w-4xl w-full h-[95%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Laudo de Análise Microscópica</DialogTitle>
        </DialogHeader>
        <div id="laudo-content" className="max-w-4xl bg-white shadow-lg rounded-lg overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <header className="bg-blue-600 text-white rounded-t-lg p-4">
            <p className="text-sm mt-1">Emitido em: 25/12/2024</p>
          </header>
          <section className="p-4 border-b">
            <h2 className="text-lg font-semibold">Informações do Paciente</h2>
            <div className="space-y-2">
              <div>
                <strong>Nome:</strong>{' '}
                <Input
                  type="text"
                  value={nomePaciente}
                  onChange={(e) => setNomePaciente(e.target.value)}
                  className="ml-2 focus-visible:ring-0 ring-0 focus:ring-0"
                />
              </div>
              <div>
                <strong>Idade:</strong>{' '}
                <Input
                  type="number"
                  value={idadePaciente}
                  onChange={(e) => setIdadePaciente(Number(e.target.value))}
                  className="ml-2 focus-visible:ring-0 ring-0 focus:ring-0"
                />
              </div>
              <div>
                <strong>Identificação:</strong>{' '}
                <Input
                  type="text"
                  value={identificacaoPaciente}
                  onChange={(e) => setIdentificacaoPaciente(e.target.value)}
                  className="ml-2 focus-visible:ring-0 ring-0 focus:ring-0"
                />
              </div>
            </div>
          </section>
          <section className="p-4 border-b">
            <h2 className="text-lg font-semibold">Detalhes da Análise</h2>
            <p>
              <Textarea
                className="w-full mt-2 min-h-[100px] text-start"
                value={detalhesAnalise}
                onChange={(e) => setDetalhesAnalise(e.target.value)}
              />
            </p>
          </section>
          <section className="p-4 border-b">
            <h2 className="text-lg font-semibold">Imagens Capturadas</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Image
                width={300}
                height={300}
                src="https://github.com/marypaul21.png"
                alt="Imagem 1"
                className="rounded shadow"
              />
              <Image
                width={300}
                height={300}
                src="https://github.com/marypaul21.png"
                alt="Imagem 2"
                className="rounded shadow"
              />
            </div>
          </section>
          <section className="p-4">
            <h2 className="text-lg font-semibold">Conclusão</h2>
            <Textarea
              className="w-full mt-2 min-h-[100px] text-wrap"
              value={conclusao}
              onChange={(e) => setConclusao(e.target.value)}
            />
            <div className="mt-6">
              <p><strong>Assinatura do Profissional:</strong></p>
              <p>Dr. Ana Clara Mendes</p>
              <p>CRM: 123456</p>
            </div>
          </section>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-akin-turquoise text-white" onClick={generatePDF}>
            Gerar PDF
          </Button>
          <Button variant="outline" onClick={() => setLaudoModalOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
