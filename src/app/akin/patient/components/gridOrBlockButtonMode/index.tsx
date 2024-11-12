import { AlignJustify, Grid } from "lucide-react";


interface IStateProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

export const GridOrBlockDisplayButton = ({ displayMode, setDisplayMode }: IStateProps) => {
  return (
    <div className="flex items-center gap-2 *:p-2 *:rounded-lg border rounded-lg bg-akin-yellow-light/20">
      <div data-showDisplay={displayMode} className="hover:cursor-pointer data-[showDisplay='list']:bg-akin-turquoise data-[showDisplay='list']:shadow data-[showDisplay='list']:border data-[showDisplay='list']:text-white" onClick={() => setDisplayMode("list")}>
        <AlignJustify />
      </div>
      <div data-showDisplay={displayMode} className="hover:cursor-pointer data-[showDisplay='block']:bg-akin-turquoise data-[showDisplay='block']:shadow data-[showDisplay='block']:border data-[showDisplay='block']:text-white" onClick={() => setDisplayMode("block")}>
        <Grid />
      </div>
    </div>
  );
};