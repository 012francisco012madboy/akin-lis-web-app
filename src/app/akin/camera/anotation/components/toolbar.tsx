"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MousePointer2,
  Pencil,
  Hand,
  ZoomIn,
  RotateCcw,
  Download,
  Square,
  Circle,
  Hexagon,
  ArrowRight,
  Minus,
  Type,
  X,
} from "lucide-react"
import type { Tool, Figure } from "../page"

interface ToolbarProps {
  activeTool: Tool
  selectedFigure: Figure | null
  figures: Figure[]
  zoomLevel: number
  onToolChange: (tool: Tool) => void
  onFigureSelect: (figure: Figure | null) => void
  onZoomChange: (zoom: number) => void
  onNewImage: () => void
}

const SHAPE_ICONS = {
  rectangle: Square,
  circle: Circle,
  polygon: Hexagon,
  arrow: ArrowRight,
  line: Minus,
  text: Type,
}

export function Toolbar({
  activeTool,
  selectedFigure,
  figures,
  zoomLevel,
  onToolChange,
  onFigureSelect,
  onZoomChange,
  onNewImage,
}: ToolbarProps) {
  const exportImage = () => {
    // Esta função será chamada do canvas
    const event = new CustomEvent("exportImage")
    window.dispatchEvent(event)
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-2">
        {/* Ferramentas principais */}
        <div className="flex items-center gap-1">
          <Button
            variant={activeTool === "select" ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange("select")}
            title="Selecionar (V)"
          >
            <MousePointer2 className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "draw" ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange("draw")}
            title="Desenhar (D)"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "pan" ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange("pan")}
            title="Mover (H)"
          >
            <Hand className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "zoom" ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange("zoom")}
            title="Zoom (Z)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Seletor de figuras */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Figura:</span>
          <Select
            value={selectedFigure?.id || "none"}
            onValueChange={(value) => {
              if (value === "none") {
                onFigureSelect(null)
              } else {
                const figure = figures.find((f) => f.id === value)
                onFigureSelect(figure || null)
              }
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecionar figura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Nenhuma
                </div>
              </SelectItem>
              {figures.map((figure) => {
                const Icon = SHAPE_ICONS[figure.shape]
                return (
                  <SelectItem key={figure.id} value={figure.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color: figure.color }} />
                      {figure.name}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          {selectedFigure && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFigure.color }} />
              {selectedFigure.name}
            </Badge>
          )}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Controles de zoom */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Zoom:</span>
          <Select value={zoomLevel.toString()} onValueChange={(value) => onZoomChange(Number.parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="125">125%</SelectItem>
              <SelectItem value="150">150%</SelectItem>
              <SelectItem value="200">200%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        {/* Ações */}
        <div className="flex items-center gap-1">
          <Button onClick={exportImage} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={onNewImage} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Nova Imagem
          </Button>
        </div>
      </div>
    </div>
  )
}
