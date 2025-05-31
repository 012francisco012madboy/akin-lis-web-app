// /pages/cadastro/step3.tsx
import { useRouter } from "next/router";
import { useFormData } from "../../../../context/FormContext";
import { useSubmitForm } from "../../../../services/mutation";

export default function Step3() {
  const { data, setData } = useFormData();
  const router = useRouter();
  const { mutate, isPending, isSuccess } = useSubmitForm();

  const handleSubmit = () => {
    mutate(data, {
      onSuccess: () => router.push("/cadastro/success"),
    });
  };

  return (
    <div>
      <h2>Cadastro - Passo 3</h2>
      <input placeholder="Nº Identificação" value={data.numero_identificacao} onChange={(e) => setData({ ...data, numero_identificacao: e.target.value })} />
      <input placeholder="ID Sexo" value={data.id_sexo} onChange={(e) => setData({ ...data, id_sexo: Number(e.target.value) })} />
      <input placeholder="Cargo" value={data.cargo} onChange={(e) => setData({ ...data, cargo: e.target.value })} />
      <input placeholder="Contacto Telefónico" value={data.contacto_telefonico} onChange={(e) => setData({ ...data, contacto_telefonico: e.target.value })} />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Enviando..." : "Finalizar Cadastro"}
      </button>
    </div>
  );
}
