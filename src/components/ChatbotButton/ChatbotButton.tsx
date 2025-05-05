"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { MessageCircleMoreIcon } from "lucide-react";

export default function ChatbotButton({ onToggle }: { onToggle: () => void }) {
  const [hasTriggered, setHasTriggered] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.get("http://34.10.126.45:5000/chefe_laboratorio");
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Chat ativado com sucesso:", data);
    },
    onError: (error) => {
      console.error("Erro ao ativar chat:", error);
    },
  });

  const handleClick = () => {
    onToggle(); // Abre o chat
    if (!hasTriggered) {
      mutation.mutate(); // Só chama o endpoint na primeira vez
      setHasTriggered(true);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 p-4 bg-akin-turquoise text-white rounded-full shadow-lg hover:bg-akin-turquoise/80 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      <MessageCircleMoreIcon size={24} />
    </motion.button>
  );
}
