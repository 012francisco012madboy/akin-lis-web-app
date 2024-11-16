"use client";

import { useState } from "react";

/////////////////////////////
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
    <div className="flex gap-x-2 mb-2 items-center">
      <label htmlFor={nome} className="flex gap-x-2 items-center">
        <input
          type="checkbox"
          className="w-fit"
          name="checkbox"
          value={id}
          id={nome}
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        {nome}
      </label>
    </div>
  );
}
