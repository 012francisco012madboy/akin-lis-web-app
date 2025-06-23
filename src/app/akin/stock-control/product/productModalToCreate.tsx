import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { stockMaterialRoutes } from "@/Api/Routes/stock-material";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: { nome: string; quantidade: number; unidade_de_medida: string }) => void;
}

export function ProductModal({ open, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({ nome: "", quantidade: 0, unidade_de_medida: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["materialCategory"],
    queryFn: async () => {
      const response = await stockMaterialRoutes.getAllMaterialCategory();
      return response;
    },
  });

  const { data: measureTypes, isLoading: isLoadingMeasureTypes } = useQuery({
    queryKey: ["measureTypes"],
    queryFn: async () => {
      const response = await stockMaterialRoutes.getAllMeasureTpes();
      return response;
    },
  });

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
          <div className="mb-4">
            <Select
              onValueChange={(value) => setFormData({ ...formData, unidade_de_medida: value })}
              disabled={isLoadingCategories}

            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" className="mb-4 focus-visible:ring-akin-turquoise" />
              </SelectTrigger>
              <SelectContent className="mb-4">
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.nome}>
                    {category.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select
            onValueChange={(value) => setFormData({ ...formData, unidade_de_medida: value })}
            disabled={isLoadingMeasureTypes}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a unidade de medida" className="mb-4 focus-visible:ring-akin-turquoise" />
            </SelectTrigger>
            <SelectContent>
              {measureTypes?.map((measure) => (
                <SelectItem key={measure.id} value={measure.nome}>
                  {measure.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
