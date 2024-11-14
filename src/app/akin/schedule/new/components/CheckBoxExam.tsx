"use client";

import { Checkbox } from "primereact/checkbox";
import { useState } from "react";

/////////////////////////////
interface ICheckboxExam {
  id: string | number;
  nome: string;
  descricao?: string;
  preco?: string;
  status?: "DISPONÍVEL" | "INDISPONÍVEL"
}

export function CheckBoxExam({ id, nome, descricao }: ICheckboxExam) {
  const [isChecked, setIsChecked] = useState(false);

  function onChange() {
    setIsChecked((state) => !state);
  }
  return (
    <div className="flex gap-x-2 mb-2 items-center ">
      {/* <Checkbox className="border border-akin-yellow-light rounded-lg" checked={isChecked} onChange={onChange} value={description} name="opc_checkbox" inputId={value} data-description={description}>
        <span hidden>{description}</span>
      </Checkbox> */}

      <label htmlFor={nome} className="flex gap-x-2">
        {/* <input type="checkbox" className="w-fit" name="opc_checkbox" value={description} id={value} /> */}
        <input type="checkbox" className="w-fit" name="opc_checkbox" value={`${nome}`} id={nome} />
        {nome}
      </label>
    </div>
  );
}
