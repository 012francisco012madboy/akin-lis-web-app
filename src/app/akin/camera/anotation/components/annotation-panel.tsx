"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Trash2, Edit3 } from "lucide-react"
import { useState } from "react"
import type { Figure, Annotation } from "../page"


interface AnnotationPanelProps {
  annotations: Annotation[]
  figures: Figure[]
  selectedAnnotation: string | null
  selectedFigure: Figure | null
  onSelectAnnotation: (id: string | null) => void
  onSelectFigure: (figure: Figure) => void
  onUpdateAnnotation: (id: string, updates: Partial<Annotation>) => void
  onDeleteAnnotation: (id: string) => void
}

export function AnnotationPanel({
  annotations,
  figures,
  selectedAnnotation,
  selectedFigure,
  onSelectAnnotation,
  onSelectFigure,
  onUpdateAnnotation,
  onDeleteAnnotation,
}: AnnotationPanelProps) {
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const handleEditStart = (annotation: Annotation) => {
    setEditingAnnotation(annotation.id)
    setEditText(annotation.text)
  }

  const handleEditSave = (id: string) => {
    onUpdateAnnotation(id, { text: editText })
    setEditingAnnotation(null)
    setEditText("")
  }

  const handleEditCancel = () => {
    setEditingAnnotation(null)
    setEditText("")
  }

  return (
    <div className="space-y-4">
      {/* Seletor de figuras */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ferramenta Ativa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {figures.map((figure) => (
            <Button
              key={figure.id}
              variant={selectedFigure?.id === figure.id ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onSelectFigure(figure)}
            >
              <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: figure.color }} />
              {figure.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Lista de anotações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Anotações ({annotations.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {annotations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhuma anotação criada</p>
          ) : (
            annotations.map((annotation, index) => {
              const figure = figures.find((f) => f.id === annotation.figureId)
              if (!figure) return null

              return (
                <Collapsible
                  key={annotation.id}
                  open={selectedAnnotation === annotation.id}
                  onOpenChange={(open) => onSelectAnnotation(open ? annotation.id : null)}
                >
                  <Card className="border-l-4" style={{ borderLeftColor: figure.color }}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {selectedAnnotation === annotation.id ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <span className="font-medium text-sm">Anotação {index + 1}</span>
                            <Badge variant="secondary" className="text-xs">
                              {figure.name}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        {editingAnnotation === annotation.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="text-sm"
                              rows={3}
                            />
                            <div className="flex gap-1">
                              <Button size="sm" onClick={() => handleEditSave(annotation.id)}>
                                Salvar
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleEditCancel}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700">{annotation.text || "Sem texto"}</p>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => handleEditStart(annotation)}>
                                <Edit3 className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => onDeleteAnnotation(annotation.id)}>
                                <Trash2 className="h-3 w-3 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
