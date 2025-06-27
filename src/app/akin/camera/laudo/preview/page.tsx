"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Edit, QrCode } from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { useRef } from "react"

export default function PreviewLaudoPage() {
  // Dados de exemplo para preview
  const reportData = {
    institution: "Hospital Central",
    examType: "Microscopia",
    patient: {
      name: "João Silva Santos",
      id: "12345678",
      birthDate: "1985-03-15",
      sex: "M",
      collectionDate: "2024-01-15",
      issueDate: "2024-01-16",
      requestingDoctor: "Dr. Maria Oliveira",
    },
    parameters: [
      { parameter: "Hemoglobina", result: "14.2", unit: "g/dL", reference: "12.0-16.0" },
      { parameter: "Hematócrito", result: "42.5", unit: "%", reference: "36.0-48.0" },
      { parameter: "Leucócitos", result: "7.800", unit: "/mm³", reference: "4.000-11.000" },
    ],
    observations:
      "Exame dentro dos parâmetros normais. Hemograma completo sem alterações significativas. Recomenda-se acompanhamento médico de rotina.",
    technician: "Carlos Eduardo Silva",
    registration: "CRF-12345",
  }

  const reportRef = useRef<HTMLDivElement>(null)

  const generatePDF = async () => {
    if (!reportRef.current) return

    try {
      // Configurar o elemento para impressão
      const element = reportRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })
//@ts-ignore
      const imgData = canvas.getDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Adicionar primeira página
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Adicionar páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Download do PDF
      const fileName = `Laudo_${reportData.patient.name.replace(/\s+/g, "_")}_${reportData.patient.issueDate}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/akin/camera/laudo/novo">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Preview do Laudo</h1>
              <p className="text-gray-600 mt-1">Visualização antes da impressão</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/laudo/novo">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Button onClick={generatePDF}>
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
                  <p className="text-sm text-gray-600">Logotipo da Instituição</p>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Laudo de {reportData.examType}</h1>
                <div className="text-left">
                  <p>
                    <strong>Tipo de Exame:</strong> ________________________________
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
                      <strong>Nome:</strong> {reportData.patient.name}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>ID do Paciente:</strong> {reportData.patient.id}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Data de Nascimento:</strong>{" "}
                      {new Date(reportData.patient.birthDate).toLocaleDateString("pt-BR")} <strong>Sexo:</strong>{" "}
                      {reportData.patient.sex}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Data de Coleta:</strong>{" "}
                      {new Date(reportData.patient.collectionDate).toLocaleDateString("pt-BR")}{" "}
                      <strong>Data de Emissão:</strong>{" "}
                      {new Date(reportData.patient.issueDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p>
                      <strong>Médico Solicitante:</strong> {reportData.patient.requestingDoctor}
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
                        <th className="border border-gray-300 p-3 text-left font-semibold">Intervalo de Referência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.parameters.map((param, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-3">{param.parameter}</td>
                          <td className="border border-gray-300 p-3 bg-yellow-50 font-semibold">{param.result}</td>
                          <td className="border border-gray-300 p-3">{param.unit}</td>
                          <td className="border border-gray-300 p-3">{param.reference}</td>
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
                  <p className="text-sm leading-relaxed">{reportData.observations}</p>
                </div>
              </div>

              {/* Imagens Anexas */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-1">Imagens Anexas</h2>
                <p className="text-sm text-gray-600 mb-4">Adicionar imagens capturadas durante o exame:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-300 h-32 flex items-center justify-center bg-gray-50">
                    <span className="text-gray-500 text-sm">Imagem 1</span>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 h-32 flex items-center justify-center bg-gray-50">
                    <span className="text-gray-500 text-sm">Imagem 2</span>
                  </div>
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
                    <strong>Nº Reg. Prof.:</strong> {reportData.registration}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 border border-gray-400 flex items-center justify-center mb-2">
                    <QrCode className="h-8 w-8 text-gray-400" />
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
