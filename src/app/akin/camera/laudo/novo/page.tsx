"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Eye, Save, Download, Edit } from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface ExamParameter {
  id: string
  parameter: string
  result: string
  unit: string
  reference: string
}

interface PatientData {
  name: string
  id: string
  birthDate: string
  sex: string
  collectionDate: string
  issueDate: string
  requestingDoctor: string
}

interface ReportData {
  institution: string
  examType: string
  patient: PatientData
  parameters: ExamParameter[]
  observations: string
  technician: string
  registration: string
}

export default function NovoLaudoPage() {
  const [reportData, setReportData] = useState<ReportData>({
    institution: "",
    examType: "",
    patient: {
      name: "",
      id: "",
      birthDate: "",
      sex: "",
      collectionDate: "",
      issueDate: new Date().toISOString().split("T")[0],
      requestingDoctor: "",
    },
    parameters: [{ id: "1", parameter: "", result: "", unit: "", reference: "" }],
    observations: "",
    technician: "",
    registration: "",
  })

  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const addParameter = () => {
    const newParameter: ExamParameter = {
      id: Date.now().toString(),
      parameter: "",
      result: "",
      unit: "",
      reference: "",
    }
    setReportData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, newParameter],
    }))
  }

  const removeParameter = (id: string) => {
    setReportData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((p) => p.id !== id),
    }))
  }

  const updateParameter = (id: string, field: keyof ExamParameter, value: string) => {
    setReportData((prev) => ({
      ...prev,
      parameters: prev.parameters.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadedImages((prev) => [...prev, ...Array.from(files)])
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const generatePDF = async () => {
    if (!reportRef.current) return

    try {
      const element = reportRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.getDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = `Laudo_${reportData.patient.name.replace(/\s+/g, "_") || "Paciente"}_${reportData.patient.issueDate}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    }
  }

  const isFormValid = () => {
    return (
      reportData.institution &&
      reportData.examType &&
      reportData.patient.name &&
      reportData.patient.id &&
      reportData.technician &&
      reportData.registration
    )
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                ← Voltar para Edição
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Preview do Laudo</h1>
                <p className="text-gray-600 mt-1">Visualização antes da impressão</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button onClick={generatePDF} disabled={!isFormValid()}>
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>

          {/* Preview do Laudo */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg" ref={reportRef}>
              <CardContent className="p-8">
                {/* Cabeçalho */}
                <div className="text-center mb-8 border-2 border-blue-500 p-6">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Logo</span>
                    </div>
                    <p className="text-sm text-gray-600">{reportData.institution || "Logotipo da Instituição"}</p>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Laudo de {reportData.examType || "Exame"}</h1>
                  <div className="text-left">
                    <p>
                      <strong>Tipo de Exame:</strong> {reportData.examType || "________________________________"}
                    </p>
                  </div>
                </div>

                {/* Dados do Paciente */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-1">
                    Dados do Paciente
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Nome:</strong> {reportData.patient.name || "________________________________"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>ID do Paciente:</strong> {reportData.patient.id || "________________________________"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Data de Nascimento:</strong>{" "}
                        {reportData.patient.birthDate
                          ? new Date(reportData.patient.birthDate).toLocaleDateString("pt-BR")
                          : "__/__/____"}{" "}
                        <strong>Sexo:</strong> {reportData.patient.sex || "__"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Data de Coleta:</strong>{" "}
                        {reportData.patient.collectionDate
                          ? new Date(reportData.patient.collectionDate).toLocaleDateString("pt-BR")
                          : "__/__/____"}{" "}
                        <strong>Data de Emissão:</strong>{" "}
                        {reportData.patient.issueDate
                          ? new Date(reportData.patient.issueDate).toLocaleDateString("pt-BR")
                          : "__/__/____"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p>
                        <strong>Médico Solicitante:</strong>{" "}
                        {reportData.patient.requestingDoctor || "________________________________"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resultados do Exame */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-1">
                    Resultados do Exame
                  </h2>
                  <div className="border border-gray-300">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left font-semibold">Parâmetro</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold">Resultado</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold">Unidade</th>
                          <th className="border border-gray-300 p-3 text-left font-semibold">
                            Intervalo de Referência
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.parameters.map((param, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 p-3">
                              {param.parameter || "________________________________"}
                            </td>
                            <td className="border border-gray-300 p-3 bg-yellow-50 font-semibold">
                              {param.result || "____________"}
                            </td>
                            <td className="border border-gray-300 p-3">{param.unit || "________"}</td>
                            <td className="border border-gray-300 p-3">{param.reference || "____________"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Observações */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-2">Observações e Interpretações:</h3>
                  <div className="min-h-[100px] border-b border-gray-300 pb-4">
                    <p className="text-sm leading-relaxed">
                      {reportData.observations ||
                        "________________________________________________________________________________________________________________________________________________________________________________________________________________________________"}
                    </p>
                  </div>
                </div>

                {/* Imagens Anexas */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-1">
                    Imagens Anexas
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">Adicionar imagens capturadas durante o exame:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {uploadedImages.length > 0 ? (
                      uploadedImages.slice(0, 2).map((image, index) => (
                        <div key={index} className="border border-gray-300 h-32 flex items-center justify-center">
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`Imagem ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="border-2 border-dashed border-gray-300 h-32 flex items-center justify-center bg-gray-50">
                          <span className="text-gray-500 text-sm">Imagem 1</span>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 h-32 flex items-center justify-center bg-gray-50">
                          <span className="text-gray-500 text-sm">Imagem 2</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Rodapé */}
                <div className="flex justify-between items-end mt-12">
                  <div>
                    <div className="border-b border-gray-400 w-64 mb-2"></div>
                    <p className="text-sm">
                      <strong>Técnico Responsável</strong>
                    </p>
                    <p className="text-sm">
                      <strong>{reportData.technician || "Nome do Técnico"}</strong>
                    </p>
                    <p className="text-sm">
                      <strong>Nº Reg. Prof.:</strong> {reportData.registration || "____________"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 border border-gray-400 flex items-center justify-center mb-2">
                      <span className="text-xs text-gray-500">QR</span>
                    </div>
                    <p className="text-xs text-gray-500">QR Code</p>
                  </div>
                </div>

                <div className="text-center mt-8 pt-4 border-t border-gray-300">
                  <p className="text-xs text-gray-500">Laudo válido somente com assinatura do responsável técnico.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Laudo Médico</h1>
            <p className="text-gray-600 mt-2">Preencha os dados para gerar o laudo</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(true)} disabled={!isFormValid()}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Configurações Gerais */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institution">Instituição *</Label>
                    <Select
                      value={reportData.institution}
                      onValueChange={(value) => setReportData((prev) => ({ ...prev, institution: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a instituição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital-central">Hospital Central</SelectItem>
                        <SelectItem value="clinica-medica">Clínica Médica São Paulo</SelectItem>
                        <SelectItem value="laboratorio-exames">Laboratório de Exames</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="examType">Tipo de Exame *</Label>
                    <Input
                      id="examType"
                      value={reportData.examType}
                      onChange={(e) => setReportData((prev) => ({ ...prev, examType: e.target.value }))}
                      placeholder="Ex: Microscopia"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados do Paciente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Dados do Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Nome *</Label>
                    <Input
                      id="patientName"
                      value={reportData.patient.name}
                      onChange={(e) =>
                        setReportData((prev) => ({
                          ...prev,
                          patient: { ...prev.patient, name: e.target.value },
                        }))
                      }
                      placeholder="Nome completo do paciente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientId">ID do Paciente *</Label>
                    <Input
                      id="patientId"
                      value={reportData.patient.id}
                      onChange={(e) =>
                        setReportData((prev) => ({
                          ...prev,
                          patient: { ...prev.patient, id: e.target.value },
                        }))
                      }
                      placeholder="ID ou número do prontuário"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={reportData.patient.birthDate}
                      onChange={(e) =>
                        setReportData((prev) => ({
                          ...prev,
                          patient: { ...prev.patient, birthDate: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="sex">Sexo</Label>
                    <Select
                      value={reportData.patient.sex}
                      onValueChange={(value) =>
                        setReportData((prev) => ({
                          ...prev,
                          patient: { ...prev.patient, sex: value },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="requestingDoctor">Médico Solicitante</Label>
                    <Input
                      id="requestingDoctor"
                      value={reportData.patient.requestingDoctor}
                      onChange={(e) =>
                        setReportData((prev) => ({
                          ...prev,
                          patient: { ...prev.patient, requestingDoctor: e.target.value },
                        }))
                      }
                      placeholder="Nome do médico"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="collectionDate">Data de Coleta</Label>
                    <Input
                      id="collectionDate"
                      type="date"
                      value={reportData.patient.collectionDate}
                      onChange={(e) =>
                        setReportData((prev) => ({
                          ...prev,
                          patient: { ...prev.patient, collectionDate: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="issueDate">Data de Emissão</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={reportData.patient.issueDate}
                      onChange={(e) =>
                        setReportData((prev) => ({
                          ...prev,
                          patient: { ...prev.patient, issueDate: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultados do Exame */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600 flex justify-between items-center">
                  Resultados do Exame
                  <Button onClick={addParameter} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Parâmetro
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.parameters.map((param, index) => (
                    <div key={param.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">Parâmetro {index + 1}</span>
                        {reportData.parameters.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeParameter(param.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-4 gap-3">
                        <div>
                          <Label>Parâmetro</Label>
                          <Input
                            value={param.parameter}
                            onChange={(e) => updateParameter(param.id, "parameter", e.target.value)}
                            placeholder="Nome do parâmetro"
                          />
                        </div>
                        <div>
                          <Label>Resultado</Label>
                          <Input
                            value={param.result}
                            onChange={(e) => updateParameter(param.id, "result", e.target.value)}
                            placeholder="Valor do resultado"
                          />
                        </div>
                        <div>
                          <Label>Unidade</Label>
                          <Input
                            value={param.unit}
                            onChange={(e) => updateParameter(param.id, "unit", e.target.value)}
                            placeholder="mg/dL, %, etc."
                          />
                        </div>
                        <div>
                          <Label>Intervalo de Referência</Label>
                          <Input
                            value={param.reference}
                            onChange={(e) => updateParameter(param.id, "reference", e.target.value)}
                            placeholder="Ex: 10-50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle>Observações e Interpretações</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={reportData.observations}
                  onChange={(e) => setReportData((prev) => ({ ...prev, observations: e.target.value }))}
                  placeholder="Descreva as observações e interpretações dos resultados..."
                  rows={6}
                />
              </CardContent>
            </Card>

            {/* Imagens Anexas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Imagens Anexas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageUpload">Adicionar Imagens</Label>
                    <Input
                      id="imageUpload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1"
                    />
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative border rounded-lg p-2">
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-center mt-1 truncate">{image.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Responsável Técnico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="technician">Nome do Técnico *</Label>
                  <Input
                    id="technician"
                    value={reportData.technician}
                    onChange={(e) => setReportData((prev) => ({ ...prev, technician: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="registration">Nº Reg. Prof. *</Label>
                  <Input
                    id="registration"
                    value={reportData.registration}
                    onChange={(e) => setReportData((prev) => ({ ...prev, registration: e.target.value }))}
                    placeholder="Número do registro"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Rascunho
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowPreview(true)}
                  disabled={!isFormValid()}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar Laudo
                </Button>
                <Button variant="secondary" className="w-full" onClick={generatePDF} disabled={!isFormValid()}>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status do Formulário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div
                    className={`flex items-center gap-2 ${reportData.institution ? "text-green-600" : "text-red-600"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${reportData.institution ? "bg-green-600" : "bg-red-600"}`}
                    ></div>
                    Instituição
                  </div>
                  <div className={`flex items-center gap-2 ${reportData.examType ? "text-green-600" : "text-red-600"}`}>
                    <div
                      className={`w-2 h-2 rounded-full ${reportData.examType ? "bg-green-600" : "bg-red-600"}`}
                    ></div>
                    Tipo de Exame
                  </div>
                  <div
                    className={`flex items-center gap-2 ${reportData.patient.name ? "text-green-600" : "text-red-600"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${reportData.patient.name ? "bg-green-600" : "bg-red-600"}`}
                    ></div>
                    Nome do Paciente
                  </div>
                  <div
                    className={`flex items-center gap-2 ${reportData.patient.id ? "text-green-600" : "text-red-600"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${reportData.patient.id ? "bg-green-600" : "bg-red-600"}`}
                    ></div>
                    ID do Paciente
                  </div>
                  <div
                    className={`flex items-center gap-2 ${reportData.technician ? "text-green-600" : "text-red-600"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${reportData.technician ? "bg-green-600" : "bg-red-600"}`}
                    ></div>
                    Técnico Responsável
                  </div>
                  <div
                    className={`flex items-center gap-2 ${reportData.registration ? "text-green-600" : "text-red-600"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${reportData.registration ? "bg-green-600" : "bg-red-600"}`}
                    ></div>
                    Registro Profissional
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dicas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Preencha todos os campos obrigatórios (*)</li>
                  <li>• Verifique as datas antes de gerar o PDF</li>
                  <li>• Adicione imagens em alta qualidade</li>
                  <li>• Use o preview para verificar o layout</li>
                  <li>• O PDF será gerado com o nome do paciente</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
