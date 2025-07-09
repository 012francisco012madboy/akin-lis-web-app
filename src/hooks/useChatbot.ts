"use client";

import { useState, useCallback, useRef } from "react";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
  type: "text" | "audio";
  audioUrl?: string;
  isTyping?: boolean;
}

interface ChatbotState {
  messages: Message[];
  isMinimized: boolean;
  isRecording: boolean;
  audioFile: File | null;
  isMuted: boolean;
  isLoading: boolean;
}

export const useChatbot = () => {
  const [state, setState] = useState<ChatbotState>({
    messages: [],
    isMinimized: false,
    isRecording: false,
    audioFile: null,
    isMuted: false,
    isLoading: false,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: `${message.sender}-${Date.now()}`,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  }, []);

  const addTypingIndicator = useCallback(() => {
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      sender: "agent",
      text: "",
      timestamp: new Date(),
      type: "text",
      isTyping: true,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, typingMessage],
    }));
  }, []);

  const removeTypingIndicator = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => !msg.isTyping),
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
    }));
  }, []);

  const toggleMinimized = useCallback(() => {
    setState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  }, []);

  const toggleMuted = useCallback(() => {
    setState(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mp3' });

        setState(prev => ({
          ...prev,
          audioFile,
          isRecording: false,
        }));

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();

      setState(prev => ({
        ...prev,
        isRecording: true,
      }));

      return true;
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      return false;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      return true;
    }
    return false;
  }, []);

  const clearAudioFile = useCallback(() => {
    setState(prev => ({
      ...prev,
      audioFile: null,
    }));
  }, []);

  const playNotificationSound = useCallback(() => {
    if (state.isMuted) return;

    // Criar um tom de notificação simples
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, [state.isMuted]);

  return {
    state,
    actions: {
      addMessage,
      addTypingIndicator,
      removeTypingIndicator,
      clearMessages,
      toggleMinimized,
      toggleMuted,
      setLoading,
      startRecording,
      stopRecording,
      clearAudioFile,
      playNotificationSound,
    },
  };
};
