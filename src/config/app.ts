import osapiLogo from "@/assets/images/osapi-logo.png";
import osapiLogoWhite from "@/assets/images/osapi-logo-white.png";
import { 
  Home, 
  CalendarCheck, 
  LayoutDashboard, 
  UserRound, 
  CreditCard, 
  MessageSquareMore, 
  Send, 
  Mail, 
  LogOut, 
  Settings2, 
  Settings, 
  Cog, 
  Wrench, 
  UsersRound, 
  CalendarPlus2, 
  CalendarSearch, 
  CalendarCheck2, 
  UserRoundCog
} from "lucide-react";

export const APP_CONFIG = {
  COMPANY_NAME: "OsapiCare AKIN",
  APP_NAME: "AKIN",
  VERSION: "1.0",
  LOGO: osapiLogo,
  LOGO_WHITE: osapiLogoWhite,
  ROUTES: {
    MENU: [
      { 
        label: "Dashboard", 
        icon: LayoutDashboard, 
        path: "/akin/dashboard", 
        access: [ "CHEFE", "TECNICO"] 
      },
      { 
        label: "Agendamentos", 
        icon: CalendarCheck, 
        path: "/akin/schedule/new", 
        access: ["RECEPCIONISTA", "CHEFE"] 
      },
      { 
        label: "Pacientes", 
        icon: UsersRound, 
        path: "/akin/patient", 
        access: ["RECEPCIONISTA","CHEFE", "TECNICO"] 
      },
      { 
        label: "Gestão Equipe", 
        icon: UserRoundCog, 
        path: "/akin/team-management", 
        access: ["CHEFE", "TECNICO"] 
      },
      { 
        label: "Pagamentos", 
        icon: CreditCard, 
        path: "/akin/payment", 
        access: ["RECEPCIONISTA"] 
      },
      { 
        label: "Mensagens", 
        icon: MessageSquareMore, 
        path: "/akin/message", 
        access: ["RECEPCIONISTA","TECNICO", "CHEFE"] 
      },
      { 
        label: "Definições", 
        icon: Settings, 
        path: "/akin/setting", 
        access: ["CHEFE"] 
      },
      { 
        label: "Perfil", 
        icon: UserRound, 
        path: "/akin/profile", 
        access: ["RECEPCIONISTA", "CHEFE", "TECNICO"] 
      },
      { 
        label: "Sair", 
        icon: LogOut, 
        path: "/logout", 
        access: ["RECEPCIONISTA", "CHEFE", "TECNICO"] 
      },
    ],
    SCHEDULE: [
      { 
        label: "Novo", 
        icon: CalendarPlus2, 
        path: "/akin/schedule/new", 
        access: ["RECEPCIONISTA"] 
      },
      { 
        label: "Solicitações", 
        icon: CalendarSearch, 
        path: "/akin/schedule/request", 
        access: ["RECEPCIONISTA"] 
      },
      { 
        label: "Concluídos", 
        icon: CalendarCheck2, 
        path: "/akin/schedule/completed", 
        access: ["RECEPCIONISTA","CHEFE"] 
      },
    ],
    PATIENT: {
      INDIVIDUAL_PATIENT_LINK(id: string) {
        return `/akin/patient/${id}`;
      },
    },
    ALTERNATIVE: {
      PROFILE: { 
        label: "Perfil", 
        icon: null, 
        path: "/akin/...", 
        access: ["RECEPCIONISTA", "CHEFE", "TECNICO"] 
      },
    },
  },
};

export const SERVER_ENVIRONMENT = typeof window === "undefined";
