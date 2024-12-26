import { Copy } from "lucide-react";
import { useState } from "react";

// Componentes reutilizáveis
export function InfoItem({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <article className="w-[300px] bg-gray-100 p-1 tracking-tighter rounded-md shadow-sm">
      <h4 className="flex justify-between items-center text-sm text-gray-400 font-medium">
        {label}
        {
          copied ? (
            <span className="text-xs text-green-500 block ">
              Copiado!
            </span>
          ) : (
            <Copy size={18} className="cursor-pointer" onClick={handleCopy} />
          )
        }
      </h4>
      <p>{value}</p>
    </article>
  );
}