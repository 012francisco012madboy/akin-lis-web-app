// "use client"
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Trash2 } from "lucide-react";
// import { DialogTitle } from "@radix-ui/react-dialog";

// interface Exame {
//   id: number | null;
//   data: string | null;
//   hora: string | null;
// }

// export default function AgendamentoForm() {
//   const [exames, setExames] = useState<Exame[]>([{ id: null, data: null, hora: null }]);
//   const [paciente, setPaciente] = useState<string | null>(null);
//   const [unidadeDeSaude, setUnidadeDeSaude] = useState<number | null>(null);

//   const handleAddExame = () => {
//     setExames([...exames, { id: null, data: null, hora: null }]);
//   };

//   const handleRemoveExame = (index: number) => {
//     const updatedExames = exames.filter((_, i) => i !== index);
//     setExames(updatedExames);
//   };

//   const handleExameChange = (index: number, field: keyof Exame, value: any) => {
//     const updatedExames = [...exames];
//     updatedExames[index][field] = value;
//     setExames(updatedExames);
//   };

//   const handleSubmit = () => {
//     const payload = {
//       id_paciente: paciente,
//       id_unidade_de_saude: unidadeDeSaude,
//       exames_paciente: exames.filter((exame) => exame.id && exame.data && exame.hora),
//     };
//     console.log("Agendamento:", payload);
//   };

//   return (
//     <div className="p-6 bg-white rounded-md shadow">
//       <h2 className="text-lg font-semibold mb-4">Novo Agendamento</h2>
//       {/* Seleção de Paciente */}
//       <Select onValueChange={(value) => setPaciente(value)}>
//         <SelectTrigger>
//           <SelectValue placeholder="Selecione um paciente" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="cm282av0o0015lfq0i7pa5f3e">Paciente 1</SelectItem>
//           <SelectItem value="cm282av0o0015lfq0i7pa5f4f">Paciente 2</SelectItem>
//         </SelectContent>
//       </Select>

//       {/* Seleção de Unidade de Saúde */}
//       <Select onValueChange={(value) => setUnidadeDeSaude(Number(value))}>
//         <SelectTrigger >
//           <SelectValue placeholder="Selecione uma unidade de saúde" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="1">Unidade 1</SelectItem>
//           <SelectItem value="2">Unidade 2</SelectItem>
//           <SelectItem value="3">Unidade 3</SelectItem>
//           <SelectItem value="4">Unidade 4</SelectItem>
//           <SelectItem value="5">Unidade 5</SelectItem>
//           <SelectItem value="6">Unidade 6</SelectItem>
//           <SelectItem value="7">Unidade 7</SelectItem>
//           <SelectItem value="8">Unidade 8</SelectItem>
//           <SelectItem value="9">Unidade 9</SelectItem>

//           <SelectItem value="10">Unidade 10</SelectItem>
//           <SelectItem value="2">Unidade 2</SelectItem>
//         </SelectContent>
//       </Select>

//       {/* Lista de Exames */}
//       <div className="mt-6">
//         {exames.map((exame, index) => (
//           <div key={index} className="flex items-center gap-4 mb-4">
//             {/* Tipo de Exame */}
//             <Select onValueChange={(value) => handleExameChange(index, "id", Number(value))}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Selecione o exame" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="3">Exame 3</SelectItem>
//                 <SelectItem value="9">Exame 9</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Data do Exame */}
//             <Dialog>
//               <DialogTitle>Data de Agendamento</DialogTitle>
//               <DialogTrigger asChild>
//                 <Input placeholder="Selecione a data" value={exame.data || ""} readOnly />
//               </DialogTrigger>
//               <DialogContent>
//                 <Calendar mode="single" onSelect={(date) => handleExameChange(index, "data", date.toISOString().split("T")[0])} />
//               </DialogContent>
//             </Dialog>

//             {/* Hora do Exame */}
//             <Input
//               type="time"
//               value={exame.hora || ""}
//               onChange={(e) => handleExameChange(index, "hora", e.target.value)}
//             />

//             {/* Remover Exame */}
//             <Button variant="ghost" onClick={() => handleRemoveExame(index)}>
//               <Trash2 className="w-4 h-4 text-red-500" />
//             </Button>
//           </div>
//         ))}
//       </div>

//       {/* Botão para Adicionar Exame */}
//       <Button className="mt-4" variant="outline" onClick={handleAddExame}>
//         Adicionar Exame
//       </Button>

//       {/* Botão para Salvar */}
//       <Button className="mt-6 w-full" onClick={handleSubmit}>
//         Salvar Agendamento
//       </Button>
//     </div>
//   );
// }
{/* Seleção de Exames */ }
{/* <div className="w-full lg:w-[20rem]">
          <ExamSelection exams={availableExams} isLoading={isLoading} isSaving={isSaving} />
        </div> 
        

          const resetForm = () => {
    // Limpar checkboxes
    const checkboxes = document.querySelectorAll('input[name="checkbox"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox) => (checkbox.checked = !checkbox.checked));

    // Resetar os campos de data e hora
    const identityInput = document.querySelector('input[name="identity"]') as HTMLInputElement;
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;

    const resetAllInputsAfterSchedule = document.querySelector('input[id="text"]') as HTMLInputElement;

    if (identityInput) identityInput.value = "";
    if (resetAllInputsAfterSchedule) resetAllInputsAfterSchedule.value = "";
    if (nameInput) {
      nameInput.value = ""
      nameInput.placeholder = "Nome completo do paciente"
    }
  };

 */}


   // const handleSubmit = async () => {
  //   // try {
  //   //   const response = await ___api.post("/schedule", { schedules });
  //   console.log("Agendamento realizado com sucesso: ");
  //   // schedules.map((e) => console.log(
  //   //  `Exame: ${e.exam[0]}\n 
  //   //   Date: ${e.date}\n 
  //   //   Hora: ${e.time}`
  //   // ))

  //   // alert("Agendamento realizado!");
  //   // } catch (error) {
  //   //   console.error("Erro ao agendar:", error);
  //   //   alert("Erro ao realizar o agendamento.");
  //   // }
  // };