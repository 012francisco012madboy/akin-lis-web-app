import { AlertDialogAction, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export const AlerDialogNextExam = ({
  isOpen,
  onClose,
  onIgnore
}: {
  isOpen: boolean;
  onClose: () => void;
  onIgnore: () => void
}) => {

  const handleViewProtocol = () => {
    // Aqui você pode implementar a lógica para mostrar o protocolo
    // Por exemplo, abrir um modal com o protocolo ou navegar para uma página específica
    console.log("Visualizar protocolo padrão");
    // Por enquanto, vamos apenas fechar o modal e proceder
    onIgnore();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[90%] max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">Protocolo Padrão</AlertDialogTitle>
          <AlertDialogDescription>
            Este exame possui um protocolo padrão a ser seguido. Se não estiver familiarizado com o mesmo,
            clique na opção &quot;Ver Protocolo&quot;, caso já conheça, pode ignorar esta mensagem e prosseguir.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="flex flex-col w-full gap-2 sm:flex-row justify-between">
            <Button
              className="w-full text-md sm:w-[150px] bg-akin-turquoise hover:bg-akin-turquoise/70"
              onClick={handleViewProtocol}
            >
              Ver Protocolo
            </Button>
            <Button
              className="w-full sm:w-[150px] bg-red-500 hover:bg-red-400 text-md"
              onClick={onIgnore}
            >
              Prosseguir
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
