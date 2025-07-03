import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox/combobox";
import { Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const availableMaterials = [
  "Siringa",
  "Bandeja",
  "Bastão de vidro",
  "Placa de Petri",
  "Proveta",
  "Vidro de relógio",
  "Microscópio",
  "Lâmina",
  "Lamínula",
  "Pipeta",
  "Béquer",
  "Tubo de ensaio"
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
    if (selectedMaterial && quantity && !isNaN(Number(quantity)) && Number(quantity) > 0) {
      // Verificar se o material já foi adicionado
      const existingMaterialIndex = materials.findIndex(m => m.material === selectedMaterial);

      if (existingMaterialIndex >= 0) {
        // Se o material já existe, atualizar a quantidade
        setMaterials((prev) => prev.map((item, index) =>
          index === existingMaterialIndex
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        ));
      } else {
        // Se é um novo material, adicionar à lista
        setMaterials((prev) => [
          ...prev,
          { material: selectedMaterial, quantity: Number(quantity) },
        ]);
      }

      setSelectedMaterial(null);
      setQuantity("");
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setMaterials((prev) => prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleClose = () => {
    // Limpar o estado ao fechar
    setMaterials([]);
    setSelectedMaterial(null);
    setQuantity("");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Materiais para {patient_name} - {exam_name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Selecione os materiais clínicos necessários para este exame. Use com cuidado e responsabilidade!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Seção de adicionar material */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3">Adicionar Material</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Material</label>
                <Combobox
                  options={availableMaterials}
                  value={selectedMaterial}
                  onChange={setSelectedMaterial}
                  placeholder="Escolha um material"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantidade</label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantidade"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={addMaterial}
                  disabled={!selectedMaterial || !quantity || Number(quantity) <= 0}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de materiais selecionados */}
          <div>
            <h3 className="font-medium mb-3">Materiais Selecionados ({materials.length})</h3>
            {materials.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum material selecionado ainda.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {materials.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-white">
                    <div className="flex-1">
                      <span className="font-medium">{item.material}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, Number(e.target.value))}
                        className="w-20"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMaterial(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>

          <Link href={`/akin/patient/${id}/ready-exam/${exam_id}`} passHref>
            <Button
              className="bg-akin-turquoise hover:bg-akin-turquoise/80"
              onClick={handleClose}
              disabled={materials.length === 0}
            >
              Continuar ({materials.length} materiais)
            </Button>
          </Link>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
