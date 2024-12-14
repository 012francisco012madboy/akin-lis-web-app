import { AlertDialogAction, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { MedicalMaterialsModal } from "./_materialModal"
import { useState } from "react";

export const AlerDialogNextExam = ({ isOpen, onClose, onIgnore }: { isOpen: boolean; onClose: () => void; onIgnore: () => void }) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent className="w-[80%]">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-red-500">Protocolo padrão</AlertDialogTitle>
        <AlertDialogDescription>
          Este exame possui um protocolo padrão a ser seguido, se não estiver familiarizado com o mesmo, clique na opção ver, caso já conheça, pode ignorar esta mensagem.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <div className="flex flex-col w-full gap-2 sm:flex-row justify-between">
          <AlertDialogAction className="w-full text-md sm:w-[150px] bg-akin-turquoise hover:bg-akin-turquoise/70">
            Ver
          </AlertDialogAction>
          <AlertDialogAction
            className="w-full sm:w-[150px] bg-red-500 hover:bg-red-400 text-md"
            onClick={onIgnore}
          >
            Ignorar
          </AlertDialogAction>
        </div>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
