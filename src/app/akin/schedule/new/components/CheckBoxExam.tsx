"use client";
import { useState } from "react";

interface ICheckboxExam {
  id: string | number;
  nome: string;
  descricao?: string;
  preco?: string;
  status?: "DISPONÍVEL" | "INDISPONÍVEL";
}

export function CheckBoxExam({ id, nome, descricao }: ICheckboxExam) {
  const [isChecked, setIsChecked] = useState(false);

  // Função para alterar o estado da checkbox
  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(event.target.checked);
    console.log(`Checkbox ${nome} (${id}) está ${event.target.checked ? "selecionada" : "desmarcada"}`);
  }

  return (
    <div className="flex items-center gap-4 mb-4">
      <label htmlFor={nome} className="flex items-center gap-3 text-lg font-medium text-akin-dark">
        {/* Checkbox com borda arredondada e efeito de foco */}
        <input
          type="checkbox"
          className="w-5 h-5 text-akin-primary border-2 rounded-md   transition-all"
          name="checkbox"
          value={id}
          id={nome}
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        {/* Nome do exame */}
        <span className="text-sm text-akin-dark/80">{nome}</span>
      </label>
      {/* Se houver descrição, exibe com o texto mais suave */}
      {descricao && <p className="text-xs text-akin-dark/60 mt-1">{descricao}</p>}
    </div>
  );
}
