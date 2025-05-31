// /pages/cadastro/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CadastroIndex() {
  const router = useRouter();

  useEffect(() => {
    router.push("/cadastro/step1");
  }, []);

  return null;
}
