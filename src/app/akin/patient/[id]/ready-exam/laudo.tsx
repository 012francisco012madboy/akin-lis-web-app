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
  image: { width: 150, height: 150, margin: 5 },
  imgDiv:{
        display:'flex',
        justifyContent:'between',
        gap:5
  }
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
        <View style={styles.imgDiv}>
          <Image src="data:image/jpeg;base64,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" style={styles.image} />
          <Image src="data:image/jpeg;base64,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" style={styles.image} />
        </View>
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
  const [assinaturaDoutor, setAssinaturaDoutor] = useState('');
  const [crmDoutor, setCrmDoutor] = useState('');

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
            <Input placeholder='Assinatura do Profissional' value={assinaturaDoutor} onChange={(e) => setAssinaturaDoutor(e.target.value)} />
          </section>

          <section>
            <h2 className="text-lg font-semibold">CRM</h2>
            <Input placeholder="CRM do Doutor" value={crmDoutor} onChange={(e) => setCrmDoutor(e.target.value)} />
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
