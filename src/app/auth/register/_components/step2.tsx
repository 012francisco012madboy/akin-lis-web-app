// /pages/cadastro/step2.tsx
import { useRouter } from "next/router";
import { useFormData } from "../../../../context/FormContext";

export default function Step2() {
  const { data, setData } = useFormData();
  const router = useRouter();

  return (
    <div>
      <h2>Cadastro - Passo 2</h2>
      <input placeholder="ID Unidade de Saúde" value={data.id_unidade_saude} onChange={(e) => setData({ ...data, id_unidade_saude: e.target.value })} />
      <input placeholder="Nome Completo" value={data.nome_completo} onChange={(e) => setData({ ...data, nome_completo: e.target.value })} />
      <input placeholder="Data de Nascimento" type="date" value={data.data_nascimento} onChange={(e) => setData({ ...data, data_nascimento: e.target.value })} />
      <button onClick={() => router.push("/cadastro/step3")}>Próximo</button>
    </div>
  );
}
