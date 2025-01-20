import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MessageSquareText, MoreHorizontal, Phone } from "lucide-react";

interface TechnicianCardGridProps {
  technicians: ITeamManagement[];
  handleDelete: (id: string) => void;
  setEditTechnician: (technician: ITeamManagement) => void;
  setFormModalOpen: (open: boolean) => void;
  setSelectedTechnician: (technician: ITeamManagement) => void;
  setModalOpen: (open: boolean) => void;
}

const TechnicianCardGrid: React.FC<TechnicianCardGridProps> = ({
  technicians,
  handleDelete,
  setEditTechnician,
  setFormModalOpen,
  setSelectedTechnician,
  setModalOpen,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 min-w-max">
      {technicians && technicians.map((technician) => (
        <Card key={technician.id}>
          <CardHeader className="flex justify-between relative">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback>{technician.nome_completo?.charAt(0) || ''}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{technician.nome_completo}</h2>
                <p className="text-sm text-gray-500">{technician.cargo}</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger>
                <MoreHorizontal className="size-5 cursor-pointer absolute top-5 right-5" />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2">
                  <Button variant="destructive" onClick={() => technician.id && handleDelete(technician.id)}>
                    Remover
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      setEditTechnician(technician);
                      setFormModalOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            {/* <p className="flex-wrap text-wrap">Email: {technician.}</p> */}
            {/* <p>Contato: {technician.phone}</p> */}
            {/* <p>
              Status:{" "}
              <span
                className={`font-bold ${technician.status === "Ocupado" ? "text-red-500" : "text-green-500"
                  }`}
              >
                {technician.status}
              </span>
            </p> */}
          </CardContent>
          <CardFooter className="flex flex-col xl:flex-row justify-between gap-2">
            <div className="flex gap-2">
              <Button className="size-[40px] rounded-full" variant="outline">
                {/* Mensagem */}
                <MessageSquareText />
              </Button>
              <Button className="size-[40px] rounded-full" variant="outline">
                {/* Chamada */}
                <Phone />
              </Button>
            </div>

            <Button
              className="w-max bg-akin-turquoise hover:bg-akin-turquoise/80"
              onClick={() => {
                setSelectedTechnician(technician);
                setModalOpen(true);
              }}
            >
              Ver Mais
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TechnicianCardGrid;
