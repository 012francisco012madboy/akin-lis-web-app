import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox/combobox";


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

export const MedicalMaterialsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("");

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Paulo Miguel</DialogTitle>
          <DialogDescription>Os materiais são de uso clínico, use com cuidado!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Selecione o material</label>
            <Combobox
              options={availableMaterials}
              value={selectedMaterial}
              onChange={setSelectedMaterial}
              placeholder="Choose a material"
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
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-akin-turquoise hover:bg-akin-turquoise/80">Seguinte</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};