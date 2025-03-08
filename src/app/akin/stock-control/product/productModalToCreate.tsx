import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: { nome: string; quantidade: number; unidade_de_medida: string }) => void;
}

export function ProductModal({ open, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({ nome: "", quantidade: 0, unidade_de_medida: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-xl font-semibold">Cadastrar Produto</h2>
        </DialogHeader>
        <div>
          <Input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Input name="quantidade" type="number" placeholder="Quantidade" value={formData.quantidade} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Input name="unidade_de_medida" placeholder="Unidade de Medida" value={formData.unidade_de_medida} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="ghost" disabled={isLoading}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-akin-turquoise hover:bg-akin-turquoise/80" disabled={isLoading}>
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
