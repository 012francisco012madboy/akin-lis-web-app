// export default function New({ }: INew) {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [availableExams, setAvailableExams] = useState<IExamProps[]>([]);
//   const [availablePatients, setAvailablePatients] = useState<Patient[]>([]);
//   const [patientAutoComplete, setPatientAutoComplete] = useState<{ value: string; id: string }[]>([]);
//   const [selectedPatientId, setSelectedPatientId] = useState<string>("");
//   const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
//   const [loggedUser] = useState(DEFAULT_USER);

//   useEffect(() => {
//     fetchPatientsAndExams();
//   }, []);

//   useEffect(() => {
//     if (selectedPatientId) {
//       const patient = availablePatients.find((patient) => patient.id === selectedPatientId);
//       setSelectedPatient(patient);
//     }
//   }, [selectedPatientId, availablePatients]);

//   const fetchPatientsAndExams = async () => {
//     try {
//       const patientsResponse = await ___api.get("pacients");
//       const patientsData = patientsResponse.data.map((patient: Patient) => ({ value: patient.nome, id: patient.id }));
//       setPatientAutoComplete(patientsData);
//       setAvailablePatients(patientsResponse.data);

//       const examsResponse = await ___api.get("/exam-types");
//       setAvailableExams(examsResponse.data.data);

//       ___showSuccessToastNotification({ message: "Dados obtidos com sucesso!" });
//     } catch (error) {
//       ___showErrorToastNotification({ message: "Erro ao buscar dados" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const validateSchedule = (data: FormData) => {
//     const scheduleDate = data.get("schedule_date") as string;
//     const scheduleTime = data.get("schedule_time") as string;

//     const selectedExams = Array.from(document.querySelectorAll('input[name="opc_checkbox"]:checked')).map(
//       (checkbox) => Number((checkbox as HTMLInputElement).value.split("_")[0])
//     );

//     const errors = [];
//     if (!selectedExams.length) errors.push("Selecione pelo menos um exame");

//     const today = new Date();
//     const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
//     if (scheduleDateTime < today) errors.push("A data e hora do agendamento devem ser futuras.");

//     if (!selectedPatient) errors.push("Selecione um paciente para o agendamento.");

//     if (errors.length > 0) {
//       ___showErrorToastNotification({ messages: errors });
//       return { isValid: false };
//     }

//     return {
//       isValid: true,
//       data: {
//         id_paciente: selectedPatient.id,
//         id_unidade_de_saude: loggedUser.id_unidade_de_saude,
//         data_agendamento: scheduleDate.replace(/\//g, "-"),
//         hora_agendamento: scheduleTime,
//         exames_paciente: selectedExams.map((id) => ({ id })),
//       },
//     };
//   };

//   const handleSubmit = async (data: FormData) => {
//     const validation = validateSchedule(data);

//     if (!validation.isValid) return;

//     setIsSaving(true);
//     try {
//       const response = await ___api.post("/schedulings/set-schedule", validation.data);

//       if (response.status === 201) {
//         ___showSuccessToastNotification({ message: "Agendamento marcado com sucesso" });
//         setSelectedPatient(undefined);
//       } else {
//         ___showErrorToastNotification({ message: "Erro ao marcar agendamento. Tente novamente." });
//       }
//     } catch (error) {
//       ___showErrorToastNotification({ message: "Erro ao marcar agendamento. Contate o suporte." });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="h-screen px-4">
//       <h1 className="font-light text-3xl my-6">Novo Agendamento</h1>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSubmit(new FormData(e.currentTarget));
//         }}
//         className="flex flex-wrap w-full gap-3"
//       >
//         <div className="flex flex-col flex-1 gap-5">
//           <PatientDetails
//             isLoading={isLoading}
//             selectedPatient={selectedPatient}
//             autoCompleteData={patientAutoComplete}
//             onPatientSelect={setSelectedPatientId}
//           />
//           <ScheduleDetails />
//         </div>
//         <ExamSelection exams={availableExams} isLoading={isLoading} isSaving={isSaving} />
//       </form>
//     </div>
//   );
// }
