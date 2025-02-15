import { Combobox } from "@/components/combobox/combobox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { useState } from "react";

const genderOptions = ["Masculino", "Femenino"]
export function FormModal({ open, technician, onClose, onSave }: any) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ITeamManagement>(
    technician || { nome_completo: "", usuario: { nome: "", email: "", hash: "", hashedRt: "", tipo: "", status: "", criado_aos: "", atualizado_aos: "" }, cargo: "Tecnico de Laboratório", email: "", contacto_telefonico: "", status: "ATIVO", id_unidade_saude: "CLI2527", id_chefe_lab: user?.id, data_nascimento: "", numero_identificacao: "", id_sexo: 0, senha: "", tipo: "TECNICO" }
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (technician && (name === "nome" || name === "email")) {
      setFormData({
        ...formData,
        //@ts-ignore
        usuario: {
          ...formData.usuario,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (technician) {
        // Editar técnico existente
        await onSave({ ...formData, id: technician.id });
        onClose();
      } else {
        const { usuario, ...newTechnicianData } = formData;
        await onSave(newTechnicianData);
        onClose();
      }
    } catch (error) {
      console.error("Erro ao salvar técnico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-xl font-semibold">{technician ? "Editar Técnico" : "Cadastrar Técnico"}</h2>
        </DialogHeader>
        <div>
          <Input name="nome_completo" placeholder="Nome" value={formData.nome_completo} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Input name="nome" placeholder="Nome de Usuário" value={technician ? formData.usuario?.nome : formData.nome} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          {/* <div className="mb-4">
            <Select
              onValueChange={(value) => setFormData({ ...formData, tipo: value })}

            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cargo" className="mb-4 focus-visible:ring-akin-turquoise" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="TECNICO">Técnico</SelectItem>
                <SelectItem value="CHEFE">Chefe de Laboratório</SelectItem>
                <SelectItem value="RECEPCIONISTA" >Recepcionista</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <Input name="email" placeholder="Email" value={technician ? formData.usuario?.email : formData.email} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Input name="contacto_telefonico" placeholder="Telefone" value={formData.contacto_telefonico} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Input name="data_nascimento" type="date" placeholder="Data de Nascimento" value={formData.data_nascimento} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Input name="numero_identificacao" placeholder="Número de Identificação" value={formData.numero_identificacao} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Combobox
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                id_sexo: value === "Masculino" ? 1 : 2,
              }))
            }
            value={formData.id_sexo === 1 ? "Masculino" : "Feminino"}
            options={genderOptions}
            placeholder="Genero"
          />
          <Input name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="ghost" disabled={isLoading}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-akin-turquoise hover:bg-akin-turquoise/80" disabled={isLoading}>
            {technician ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}