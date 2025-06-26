"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit3, Trash2, Save } from "lucide-react"
import type { Figure } from "../page"

const SHAPE_OPTIONS = [
  { value: "rectangle", label: "Retângulo" },
  { value: "circle", label: "Círculo" },
  { value: "triangle", label: "Triângulo" },
]

const COLOR_OPTIONS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#3b82f6",
  "#60a5fa",
  "#81e6d9",
  "#ec4899",
]

interface FigureManagerProps {
  figures: Figure[]
  selectedFigure: Figure | null
  onAddFigure: (figure: Omit<Figure, "id">) => void
  onUpdateFigure: (id: string, updates: Partial<Figure>) => void
  onDeleteFigure: (id: string) => void
  onSelectFigure: (figure: Figure | null) => void
}

export function FigureManager({
  figures,
  selectedFigure,
  onAddFigure,
  onUpdateFigure,
  onDeleteFigure,
  onSelectFigure,
}: FigureManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingFigure, setEditingFigure] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    shape: "rectangle" as const,
    color: "#ef4444",
  })

  const handleAddFigure = () => {
    if (formData.name.trim()) {
      onAddFigure(formData)
      setFormData({ name: "", shape: "rectangle", color: "#ef4444" })
      setShowAddDialog(false)
    }
  }

  const handleEditStart = (figure: Figure) => {
    setEditingFigure(figure.id)
    setFormData({
      name: figure.name,
      //@ts-ignore
      shape: figure.shape,
      color: figure.color,
    })
  }

  const handleEditSave = (id: string) => {
    onUpdateFigure(id, formData)
    setEditingFigure(null)
    setFormData({ name: "", shape: "rectangle", color: "#ef4444" })
  }

  const handleEditCancel = () => {
    setEditingFigure(null)
    setFormData({ name: "", shape: "rectangle", color: "#ef4444" })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Gerenciar Figuras</CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Figura</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="figure-name">Nome</Label>
                    <Input
                      id="figure-name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome da figura"
                    />
                  </div>

                  <div>
                    <Label htmlFor="figure-shape">Formato</Label>
                    <Select
                      value={formData.shape}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, shape: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHAPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Cor</Label>
                    <div className="grid grid-cols-10 gap-1 mt-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded border-2 ${
                            formData.color === color ? "border-gray-800" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData((prev) => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddFigure}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {figures.map((figure) => (
            <Card key={figure.id} className="border-l-4" style={{ borderLeftColor: figure.color }}>
              <CardContent className="p-3">
                {editingFigure === figure.id ? (
                  <div className="space-y-3">
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome da figura"
                    />

                    <Select
                      value={formData.shape}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, shape: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHAPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-10 gap-1">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          className={`w-4 h-4 rounded border ${
                            formData.color === color ? "border-gray-800" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData((prev) => ({ ...prev, color }))}
                        />
                      ))}
                    </div>

                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => handleEditSave(figure.id)}>
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: figure.color }} />
                      <span className="font-medium text-sm">{figure.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {SHAPE_OPTIONS.find((opt) => opt.value === figure.shape)?.label}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={selectedFigure?.id === figure.id ? "default" : "outline"}
                        onClick={() => onSelectFigure(selectedFigure?.id === figure.id ? null : figure)}
                      >
                        {selectedFigure?.id === figure.id ? "Ativo" : "Selecionar"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditStart(figure)}>
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onDeleteFigure(figure.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
