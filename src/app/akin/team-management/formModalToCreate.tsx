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
    technician || { nome_completo: "", nome: "", cargo: "", email: "", contacto_telefonico: "", status: "ATIVO", id_unidade_saude: "1", id_chefe_lab: user?.id, data_nascimento: "", numero_identificacao: "", id_sexo: 0, senha: "", tipo: "TECNICO" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (technician) {
      // Editar técnico existente
      onSave({ ...formData, id: technician.id });
    } else {
      // Criar novo técnico
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-xl font-semibold">{technician ? "Editar Técnico" : "Cadastrar Técnico"}</h2>
        </DialogHeader>
        <div>
          <Input name="nome_completo" placeholder="Nome" value={formData.nome_completo} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Input name="nome" placeholder="Nome de Usuário" value={formData.nome} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Input name="cargo" placeholder="Cargo" value={formData.cargo} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
          <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="mb-4 focus-visible:ring-akin-turquoise" />
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
          <Button onClick={onClose} variant="ghost">Cancelar</Button>
          <Button onClick={handleSave} className="bg-akin-turquoise hover:bg-akin-turquoise/80">{technician ? "Salvar" : "Cadastrar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}