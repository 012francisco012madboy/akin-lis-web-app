"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Tool, Figure } from "../page"

interface StatusBarProps {
  activeTool: Tool
  selectedFigure: Figure | null
  selectedAnnotation: string | null
  zoomLevel: number
  annotationsCount: number
  canvasPosition: { x: number; y: number }
}

const TOOL_LABELS = {
  select: "Seleção",
  draw: "Desenho",
  pan: "Navegação",
  zoom: "Zoom",
}

export function StatusBar({
  activeTool,
  selectedFigure,
  selectedAnnotation,
  zoomLevel,
  annotationsCount,
  canvasPosition,
}: StatusBarProps) {
  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Ferramenta:</span>
          <Badge variant="outline">{TOOL_LABELS[activeTool]}</Badge>
        </div>

        <Separator orientation="vertical" className="h-4" />

        <div>
          Anotações: <span className="font-medium">{annotationsCount}</span>
        </div>

        {selectedFigure && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span>Figura ativa:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFigure.color }} />
                {selectedFigure.name}
              </Badge>
            </div>
          </>
        )}

        {selectedAnnotation && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <div>
              <Badge variant="default">Anotação selecionada</Badge>
            </div>
          </>
        )}

        <div className="flex-1" />

        <div>
          Zoom: <span className="font-medium">{zoomLevel}%</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        <div className="text-xs">
          Atalhos: V-Selecionar | D-Desenhar | H-Mover | Z-Zoom | ESC-Desselecionar | DEL-Excluir
        </div>
      </div>
    </div>
  )
}
