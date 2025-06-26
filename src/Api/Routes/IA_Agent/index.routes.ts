import { agentUrl } from "../../api";

interface IA_AgentRoutesInterface {
  message: string;
  user_id: string;
  session_id: string;
  email: string;
  senha: string;
  tipo?: string;
}

class IA_AgentRoutes {

 async sendMessageToAgent(data: IA_AgentRoutesInterface) {
    const response = await agentUrl.post(`/${data.tipo}`, data);
    return response.data;
  }
}

export const iaAgentRoutes = new IA_AgentRoutes();