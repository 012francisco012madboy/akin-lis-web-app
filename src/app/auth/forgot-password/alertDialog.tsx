import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AlertDialogDemoProps {
  children?: React.ReactNode,
  isOpen: boolean,
  onClose: () => void,
}

export function AlertSendEmail({ children, isOpen, onClose }: AlertDialogDemoProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Email </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-red-500">Se este usuário existe, receberá um email de recuperação</span>.
            Verifique a sua caixa de mensagem do email ou spam, clique no link de recuperação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
          {/* <AlertDialogAction className=" bg-akin-turquoise hover:bg-akin-turquoise/90" onClick={() => {
            window.location.href = "https://mail.google.com/mail/u/0/#inbox"
            onClose()
          }}>Continuar</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
