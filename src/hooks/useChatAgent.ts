// hooks/useChatAgent.ts
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const enviarMensagem = async (texto: string) => {
  const response = await axios.post('http://34.10.126.45:5000/chefe_laboratorio', { texto })
  return response.data // esperado: { resposta: "..." }
}

export const useChatAgent = () => {
  return useMutation({ mutationFn: enviarMensagem })
}
