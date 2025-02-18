import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  crmDoutor: string;
  conclusao: string;
}

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  section: { marginBottom: 10, borderBottom: '1px solid #ccc', paddingBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  text: { marginBottom: 5 },
  image: { width: 150, height: 150, margin: 5 }
});

const getDate = new Date();
const LaudoPDF: React.FC<InfoPatient> = ({ nomePaciente, idadePaciente, identificacaoPaciente, detalhesAnalise, conclusao, assinaturaDoutor, crmDoutor }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Laudo de Análise Microscópica</Text>
        <Text>Emitido em: {getDate.toLocaleDateString()}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Informações do Paciente</Text>
        <Text>Nome: {nomePaciente}</Text>
        <Text>Idade: {idadePaciente}</Text>
        <Text>Identificação: {identificacaoPaciente}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Detalhes da Análise</Text>
        <Text>{detalhesAnalise}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Imagens Capturadas</Text>
        <Image src="https://github.com/mariosalvador.png" style={styles.image} />
        <Image src="https://github.com/mariosalvador.png" style={styles.image} />
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Conclusão</Text>
        <Text>{conclusao}</Text>
      </View>
      <View>
        <Text style={styles.title}>Assinatura do Profissional</Text>
        <Text>{assinaturaDoutor}</Text>
        <Text>CRM: {crmDoutor}</Text>
      </View>
    </Page>
  </Document>
);

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
  const [assinaturaDoutor, setAssinaturaDoutor] = useState('Assinatura do Profissional');
  const [crmDoutor, setCrmDoutor] = useState('CRM');

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
          <h2 className="text-lg font-semibold">Detalhes da Análise</h2>
          <Textarea value={detalhesAnalise} onChange={(e) => setDetalhesAnalise(e.target.value)} />
        </section>
        <section className="p-4 border-b">
          <h2 className="text-lg font-semibold">Conclusão</h2>
          <Textarea value={conclusao} onChange={(e) => setConclusao(e.target.value)} />
        </section>
        <div className='flex flex-col gap-4'>
          <section>
            <h2 className="text-lg font-semibold">Assinatura do Profissional</h2>
            <Input value={assinaturaDoutor} onChange={(e) => setAssinaturaDoutor(e.target.value)} />
          </section>

          <section>
            <h2 className="text-lg font-semibold">CRM</h2>
            <Input value={crmDoutor} onChange={(e) => setCrmDoutor(e.target.value)} />
          </section>
        </div>

        <DialogFooter>
          <PDFDownloadLink
            document={<LaudoPDF nomePaciente={nomePaciente} idadePaciente={idadePaciente} identificacaoPaciente={identificacaoPaciente} detalhesAnalise={detalhesAnalise} conclusao={conclusao} assinaturaDoutor={assinaturaDoutor} crmDoutor={crmDoutor} />}
            fileName={`laudo_${nomePaciente.replace(' ', '_')}.pdf`}
          >
            {({ loading }) => (loading ? 'Gerando PDF...' : 'Baixar PDF')}
          </PDFDownloadLink>
          <Button variant="outline" onClick={() => setLaudoModalOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
