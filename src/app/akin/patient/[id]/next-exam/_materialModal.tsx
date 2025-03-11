import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox/combobox";
import Link from "next/link";
import { useParams } from "next/navigation";

const availableMaterials = [
  "Siringa",
  "Bandeja",
  "Bastão de vidro",
  "Placa de Petri",
  "Proveta",
  "Vidro de relógio"
];

type Material = {
  material: string;
  quantity: number;
};

export const MedicalMaterialsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  exam_id: string;
  patient_name: string;
  exam_name: string;
}> = ({ isOpen, onClose, exam_id, patient_name, exam_name }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  //@ts-ignore
  const { id } = useParams();

  const addMaterial = () => {
    if (selectedMaterial && quantity && !isNaN(Number(quantity))) {
      setMaterials((prev) => [
        ...prev,
        { material: selectedMaterial, quantity: Number(quantity) },
      ]);
      setSelectedMaterial(null);
      setQuantity("");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{patient_name} - {exam_name}</AlertDialogTitle>
          <AlertDialogDescription>Os materiais são de uso clínico, use com cuidado!</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Selecione o material</label>
            <Combobox
              options={availableMaterials}
              value={selectedMaterial}
              onChange={setSelectedMaterial}
              placeholder="Escolha um material"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Quantidade</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Insira a quantidade"
            />
          </div>

          <Button variant="outline" onClick={addMaterial}>
            Adicionar material
          </Button>

          <ul className="space-y-2">
            {materials.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{item.material}</span>
                <span>x{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Link href={`/akin/patient/${id}/ready-exam/${exam_id}`} passHref>
            <Button className="bg-akin-turquoise hover:bg-akin-turquoise/80" onClick={onClose}>
              Seguinte
            </Button>
          </Link>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
