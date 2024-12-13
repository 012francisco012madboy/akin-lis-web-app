import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Custom Combobox Component

interface ComboboxProps {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Combobox: React.FC<ComboboxProps> = ({ options, value, onChange, placeholder }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  const handleOptionClick = (option: string) => {
    onChange(option);
    setQuery(option);
    setIsOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative" ref={comboboxRef}>
      <Input
        type="text"
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className="mb-2"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${value === option ? "bg-gray-200" : ""
                  }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};


const availableMaterials = [
  "Siringa",
  "Bandeja",
  "Bastão de vidro",
  "Placa de Petri",
  "Proveta",
  "Vidro de relógio"
];

type Material = {
  material: string;
  quantity: number;
};

const MedicalMaterialsModal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("");

  const addMaterial = () => {
    if (selectedMaterial && quantity && !isNaN(Number(quantity))) {
      setMaterials((prev) => [
        ...prev,
        { material: selectedMaterial, quantity: Number(quantity) },
      ]);
      setSelectedMaterial(null);
      setQuantity("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Paulo Miguel</DialogTitle>
          <DialogDescription>Os materiais são de uso clínico, use com cuidado!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Selecione o material</label>
            <Combobox
              options={availableMaterials}
              value={selectedMaterial}
              onChange={setSelectedMaterial}
              placeholder="Choose a material"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Quantidade</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Insira a quantidade"
            />
          </div>

          <Button variant="outline" onClick={addMaterial}>
            Adicionar material
          </Button>

          <ul className="space-y-2">
            {materials.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{item.material}</span>
                <span>x{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button className="bg-akin-turquoise hover:bg-akin-turquoise/80">Seguinte</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalMaterialsModal;
