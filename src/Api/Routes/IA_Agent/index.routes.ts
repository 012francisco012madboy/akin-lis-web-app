import { agentUrl } from "../../api";

interface IA_AgentRoutesInterface {
  user_id: string;
  session_id: string;
  email: string;
  senha: string;
  message: string;
  audioFile?: File;
  tipo?: string;
}

class IA_AgentRoutes {

  async sendMessageToAgent(data: IA_AgentRoutesInterface, tipo: string) {
    const formData = new FormData();

    formData.append('user_id', data.user_id);
    formData.append('session_id', data.session_id);
    formData.append('email', data.email);
    formData.append('senha', data.senha);
    formData.append('message', data.message);

    if (data.audioFile) {
      formData.append('audioFile', data.audioFile, 'audio.mp3');
    }

    const response = await agentUrl.post(`/${tipo}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
}

export const iaAgentRoutes = new IA_AgentRoutes();