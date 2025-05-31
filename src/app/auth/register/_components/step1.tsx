// /pages/cadastro/step1.tsx
import { useRouter } from "next/router";
import { useFormData } from "../../../../context/FormContext";

export default function Step1() {
  const { data, setData } = useFormData();
  const router = useRouter();

  return (
    <div>
      <h2>Cadastro - Passo 1</h2>
      <input placeholder="Nome" value={data.nome} onChange={(e) => setData({ ...data, nome: e.target.value })} />
      <input placeholder="Email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
      <input placeholder="Senha" type="password" value={data.senha} onChange={(e) => setData({ ...data, senha: e.target.value })} />
      <select value={data.tipo} onChange={(e) => setData({ ...data, tipo: e.target.value as any })}>
        <option value="TECNICO">Técnico</option>
        <option value="CHEFE">Chefe de Laboratório</option>
        <option value="RECEPCIONISTA">Recepcionista</option>
      </select>
      <button onClick={() => router.push("/cadastro/step2")}>Próximo</button>
    </div>
  );
}
