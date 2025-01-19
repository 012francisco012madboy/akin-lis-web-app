interface Technician {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: "Ocupado" | "Livre";
  patient?: string;
  exam?: string;
  totalExams: number;
  avgTime: string;
  materialsUsed: string[];
}

const initialTechnicians: Technician[] = [
  {
    id: "1",
    name: "João Silva",
    role: "Técnico de Laboratório",
    email: "joao.silva@example.com",
    phone: "+244 912 345 678",
    status: "Livre",
    totalExams: 50,
    avgTime: "15",
    materialsUsed: ["Luvas", "Reagente A", "Tubo de ensaio"],
  },
  {
    id: "2",
    name: "Maria Oliveira",
    role: "Técnica de Radiologia",
    email: "maria.oliveira@example.com",
    phone: "+244 923 456 789",
    status: "Ocupado",
    totalExams: 75,
    avgTime: "20",
    materialsUsed: ["Avental de chumbo", "Placa de radiografia"],
  },
  {
    id: "3",
    name: "Carlos Fernandes",
    role: "Técnico de Hematologia",
    email: "carlos.fernandes@example.com",
    phone: "+244 934 567 890",
    status: "Livre",
    totalExams: 40,
    avgTime: "18",
    materialsUsed: ["Microscópio", "Lâmina de sangue", "Corante"],
  },
  {
    id: "4",
    name: "Ana Costa",
    role: "Técnica de Microbiologia",
    email: "ana.costa@example.com",
    phone: "+244 945 678 901",
    status: "Ocupado",
    totalExams: 65,
    avgTime: "25",
    materialsUsed: ["Placa de Petri", "Meio de cultura", "Bico de Bunsen"],
  },
  {
    id: "5",
    name: "Pedro Sousa",
    role: "Técnico de Patologia",
    email: "pedro.sousa@example.com",
    phone: "+244 956 789 012",
    status: "Livre",
    totalExams: 55,
    avgTime: "22",
    materialsUsed: ["Centrífuga", "Faca histológica", "Bloco de parafina"],
  },
];


  // const handleDelete = (id: string) => {
  //   setTechnicians((prev) => prev.filter((tech) => tech.id !== id));
  //   ___showErrorToastNotification({ message: "Técnico removido com sucesso!" });
  // };

  // const handleSave = (technician: Technician) => {
  //   if (editTechnician) {
  //     setTechnicians((prev) => prev.map((tech) => (tech.id === technician.id ? technician : tech)));
  //   } else {
  //     setTechnicians((prev) => [...prev, { ...technician, id: Date.now().toString() }]);
  //   }
  //   setFormModalOpen(false);
  //   ___showSuccessToastNotification({ message: `Técnico ${editTechnician ? "editado" : "cadastrado"} com sucesso!` });
  // };

  // const filteredTechnicians = technicians.filter((tech) => {
  //   const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesFilter = filterStatus ? tech.status === filterStatus : true;
  //   return matchesSearch && matchesFilter;
  // });
