import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import React, { useState } from "react";
// import { Exam } from "../../patient/[id]/exam-history/useExamHookData";

interface Exam {
  id: number;
  estado: string;
  dataAgendamento: string;
  horaAgendamento: string;
  tecnicosAlocados: string[];
}

interface EditExamModalProps {
  exam: Exam;
  onUpdate: (updatedExam: Exam) => void;
}

export const EditExamModal: React.FC<EditExamModalProps> = ({ exam, onUpdate }) => {
  const [estado, setEstado] = useState<string>(exam.estado);
  const [dataAgendamento, setDataAgendamento] = useState<string>(exam.dataAgendamento);
  const [horaAgendamento, setHoraAgendamento] = useState<string>(exam.horaAgendamento);
  const [tecnicosAlocados, setTecnicosAlocados] = useState<string[]>(exam.tecnicosAlocados);

  const handleSubmit = () => {
    const updatedExam = { ...exam, estado, dataAgendamento, horaAgendamento, tecnicosAlocados };
    onUpdate(updatedExam);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <Select value={estado} onValueChange={(value:string) => setEstado(value)}>
              <SelectItem value="PENDENTE">PENDENTE</SelectItem>
              <SelectItem value="CONFIRMADO">CONFIRMADO</SelectItem>
              <SelectItem value="CANCELADO">CANCELADO</SelectItem>
            </Select>
          </div>

          {/* Data de Agendamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Agendamento</label>
            <Input
              type="date"
              value={dataAgendamento}
              onChange={(e) => setDataAgendamento(e.target.value)}
            />
          </div>

          {/* Hora de Agendamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Hora de Agendamento</label>
            <Input
              type="time"
              value={horaAgendamento}
              onChange={(e) => setHoraAgendamento(e.target.value)}
            />
          </div>

          {/* Técnicos Alocados */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Técnicos Alocados</label>
            <Input
              type="text"
              value={tecnicosAlocados.join(", ")}
              onChange={(e) => setTecnicosAlocados(e.target.value.split(", ").map((t) => t.trim()))}
              placeholder="Ex: Roberto Carlos, Maria Silva"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => console.log("Cancelado")}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleSubmit}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};