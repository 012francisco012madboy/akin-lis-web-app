/* eslint-disable jsx-a11y/alt-text */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Share2, Mail, Link as LinkIcon, MessageCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

interface LaudoModalProps {
  laudoModalOpen: boolean;
  setLaudoModalOpen: (isOpen: boolean) => void;
}

interface InfoPatient {
  nomePaciente: string;
  idadePaciente: number;
  identificacaoPaciente: string;
  detalhesAnalise: string;
  assinaturaDoutor: string;
  conclusao: string;
  tipoExame: string;
  dataNascimento: string;
  sexo: string;
  dataColeta: string;
  medicoSolicitante: string;
}


const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  section: { marginBottom: 10, borderBottom: '1px solid #ccc', paddingBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  text: { marginBottom: 5 },
  image: { width: 150, height: 150, margin: 5 },
  imgDiv: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-between',
    gap: 5
  }
});

const getDate = new Date();
const LaudoPDF: React.FC<InfoPatient> = ({
  nomePaciente, idadePaciente, identificacaoPaciente, detalhesAnalise, conclusao,
  assinaturaDoutor, tipoExame, dataNascimento, sexo, dataColeta, medicoSolicitante
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={[styles.title, { textAlign: 'center' }]}>Laudo de Microscopia</Text>
        <Text style={{ textAlign: 'center' }}>Tipo de Exame: {tipoExame}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Dados do Paciente</Text>
        <Text>Nome: {nomePaciente}</Text>
        <Text>ID do Paciente: {identificacaoPaciente}</Text>
        <Text>Data de Nascimento: {dataNascimento}   Sexo: {sexo}</Text>
        <Text>Data de Coleta: {dataColeta}   Data de Emissão: {new Date().toLocaleDateString()}</Text>
        <Text>Médico Solicitante: {medicoSolicitante}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Resultados do Exame</Text>
        <Text>Parâmetro | Resultado | Unidade | Intervalo de Referência</Text>
        <Text>_______________________________________________________</Text>
        <Text>{detalhesAnalise}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Observações e Interpretações</Text>
        <Text>{conclusao}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Imagens Anexas</Text>
        <Text>Adicionar imagens capturadas durante o exame:</Text>
        <View style={styles.imgDiv}>
          <Image src="https://via.placeholder.com/150" style={styles.image} />
          <Image src="https://via.placeholder.com/150" style={styles.image} />
        </View>
      </View>

      <View style={{ ...styles.section, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text>_______________________________</Text>
          <Text>Técnico Responsável</Text>
        </View>
        <Image
          src="https://api.qrserver.com/v1/create-qr-code/?data=https://meuslaudos.com/laudo/abc123&size=100x100"
          style={{ width: 80, height: 80 }}
        />
      </View>

      <Text style={{ marginTop: 10, fontStyle: 'italic', textAlign: 'center' }}>
        Laudo válido somente com assinatura do responsável técnico.
      </Text>
    </Page>
  </Document>
);


export const LaudoModal = ({ laudoModalOpen, setLaudoModalOpen }: LaudoModalProps) => {
  const [tipoExame, setTipoExame] = useState('Análise Citopatológica');
  const [dataNascimento, setDataNascimento] = useState('1978-03-15');
  const [sexo, setSexo] = useState('Masculino');
  const [dataColeta, setDataColeta] = useState('2025-06-15');
  const [medicoSolicitante, setMedicoSolicitante] = useState('Dr. Rafael Almeida');


  const [nomePaciente, setNomePaciente] = useState('João da Silva');
  const [idadePaciente, setIdadePaciente] = useState(45);
  const [identificacaoPaciente, setIdentificacaoPaciente] = useState('#12345');
  const [detalhesAnalise, setDetalhesAnalise] = useState(
    'Durante a análise microscópica, foi possível observar estruturas celulares compatíveis com um tecido saudável. Não foram identificados sinais de anormalidades significativas. A análise incluiu coloração por hematoxilina-eosina e aumento de até 1000x.'
  );
  const [conclusao, setConclusao] = useState(
    'Baseado nos resultados, não foram detectadas alterações relevantes. Recomenda-se acompanhamento regular e realização de exames complementares se necessário.'
  );
  const [assinaturaDoutor, setAssinaturaDoutor] = useState('');

  return (
    <Dialog open={laudoModalOpen} onOpenChange={() => setLaudoModalOpen(false)}>
      <DialogContent className="max-w-4xl w-full h-[95%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Laudo de Análise Microscópica</DialogTitle>
        </DialogHeader>
        <section className="p-4 border-b">
          <h2 className="text-lg font-semibold">Informações do Paciente</h2>
          <div className="space-y-2">
            <div>
              <strong>Nome:</strong>
              <Input type="text" value={nomePaciente} onChange={(e) => setNomePaciente(e.target.value)} />
            </div>
            <div>
              <strong>Idade:</strong>
              <Input type="number" value={idadePaciente} onChange={(e) => setIdadePaciente(Number(e.target.value))} />
            </div>
            <div>
              <strong>Identificação:</strong>
              <Input type="text" value={identificacaoPaciente} onChange={(e) => setIdentificacaoPaciente(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="p-4 border-b">
          <h2 className="text-lg font-semibold">Informações do Exame</h2>
          <div className="space-y-2">
            <div>
              <strong>Tipo de Exame:</strong>
              <Input value={tipoExame} onChange={(e) => setTipoExame(e.target.value)} />
            </div>
            <div>
              <strong>Data de Nascimento:</strong>
              <Input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
            </div>
            <div>
              <strong>Sexo:</strong>
              <Input value={sexo} onChange={(e) => setSexo(e.target.value)} />
            </div>
            <div>
              <strong>Data de Coleta:</strong>
              <Input type="date" value={dataColeta} onChange={(e) => setDataColeta(e.target.value)} />
            </div>
            <div>
              <strong>Médico Solicitante:</strong>
              <Input value={medicoSolicitante} onChange={(e) => setMedicoSolicitante(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="p-4 border-b">
          <h2 className="text-lg font-semibold">Detalhes da Análise</h2>
          <Textarea value={detalhesAnalise} onChange={(e) => setDetalhesAnalise(e.target.value)} />
        </section>
        <section className="p-4 border-b">
          <h2 className="text-lg font-semibold">Conclusão</h2>
          <Textarea value={conclusao} onChange={(e) => setConclusao(e.target.value)} />
        </section>
        <div className='flex gap-4'>
          <section>
            <h2 className="text-lg font-semibold">Assinatura do Profissional</h2>
            <Input placeholder='Assinatura do Profissional' value={assinaturaDoutor} onChange={(e) => setAssinaturaDoutor(e.target.value)} />
          </section>
        </div>

        {<DialogFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className='bg-akin-turquoise hover:bg-akin-turquoise/80' asChild>
              <PDFDownloadLink
                document={
                  <LaudoPDF
                    nomePaciente={nomePaciente}
                    idadePaciente={idadePaciente}
                    identificacaoPaciente={identificacaoPaciente}
                    detalhesAnalise={detalhesAnalise}
                    conclusao={conclusao}
                    assinaturaDoutor={assinaturaDoutor}
                    tipoExame={tipoExame}
                    dataNascimento={dataNascimento}
                    sexo={sexo}
                    dataColeta={dataColeta}
                    medicoSolicitante={medicoSolicitante}
                  />
                }
                fileName={`laudo_${nomePaciente.replace(' ', '_')}.pdf`}
              >
                {({ loading }) => (loading ? 'Gerando Laudo...' : 'Baixar Laudo PDF')}
              </PDFDownloadLink>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Botão de Compartilhamento com Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText('https://meuslaudos.com/laudo/abc123');
                    alert('Link copiado para a área de transferência!');
                  }}
                >
                  <LinkIcon className="w-4 h-4 cursor-pointer" /> Copiar Link
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 cursor-pointer"
                  onClick={() => {
                    const mensagem = encodeURIComponent(`Confira o laudo de ${nomePaciente}: https://meuslaudos.com/laudo/abc123`);
                    window.open(`https://wa.me/?text=${mensagem}`, '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4 cursor-pointer" /> WhatsApp
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 cursor-pointer"
                  onClick={() => {
                    const assunto = encodeURIComponent('Laudo Médico');
                    const corpo = encodeURIComponent(`Segue o laudo de ${nomePaciente}: https://meuslaudos.com/laudo/abc123`);
                    window.location.href = `mailto:?subject=${assunto}&body=${corpo}`;
                  }}
                >
                  <Mail className="w-4 h-4 cursor-pointer" /> Email
                </Button>
              </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={() => setLaudoModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
