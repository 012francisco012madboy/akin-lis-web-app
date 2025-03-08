import { AlignJustify, Grid } from "lucide-react";

interface IStateProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  isGrid?: boolean;
}

export const GridOrBlockDisplayButton = ({ displayMode, setDisplayMode, isGrid }: IStateProps) => {
  return (
    <div className="flex items-center gap-2 p-1 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
      {/* Botão para visualização em lista */}
      <button
        onClick={() => setDisplayMode("list")}
        data-showDisplay={displayMode}
        aria-label="Alterar para visualização em lista"
        className={`flex items-center justify-center w-10 h-10 rounded-md transition-all 
          ${displayMode === "list"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
      >
        <AlignJustify size={20} />
      </button>

      {
        isGrid && (
          // Botão para visualização em blocos
          <button
            onClick={() => setDisplayMode("block")}
            data-showDisplay={displayMode}
            aria-label="Alterar para visualização em blocos"
            className={`flex items-center justify-center w-10 h-10 rounded-md transition-all 
              ${displayMode === "block"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            <Grid size={20} />
          </button>
        )
      }

      {/* Botão para visualização em blocos */}
      {/* <button
        onClick={() => setDisplayMode("block")}
        data-showDisplay={displayMode}
        aria-label="Alterar para visualização em blocos"
        className={`flex items-center justify-center w-10 h-10 rounded-md transition-all 
          ${displayMode === "block"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
      >
        <Grid size={20} />
      </button> */}
    </div>
  );
};
