import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TechnicianDialogProps {
  technician: ITeamManagement;
  isOpen: boolean;
  onClose: () => void;
}

const TechnicianDialog: React.FC<TechnicianDialogProps> = ({ technician, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-xl font-semibold text-gray-800">{technician.nome_completo}</h2>
        </DialogHeader>
        <div className="space-y-6">
          {/* Filtros */}
          <div className="flex items-center gap-4">
            {/* <DatePickerWithRange onChange={handleDateRangeChange} /> */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Filtrar
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Total de Exames:</span>
              {/* <span className="text-gray-800">{technician.totalExams}</span> */}
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Tempo Médio:</span>
              {/* <span className="text-gray-800">{technician.avgTime} min</span> */}
            </div>
            <div>
              <span className="font-medium text-gray-700">Materiais Usados:</span>
              {/* <ul className="list-disc list-inside text-gray-800 mt-1">
                {technician.materialsUsed.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul> */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6">
          <Button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicianDialog;
