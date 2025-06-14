'use client';

import { createContext, useContext, useState, ReactNode } from "react";
import { askTaxAdvisor } from "@/services/aiAdvisorService";
import type { ChatMessage } from '@/services/aiAdvisorService';

interface AIAdvisorContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

const AIAdvisorContext = createContext<AIAdvisorContextType | undefined>(undefined);

export function useAIAdvisor() {
  const context = useContext(AIAdvisorContext);
  if (context === undefined) {
    throw new Error('useAIAdvisor debe ser usado dentro de un AIAdvisorProvider');
  }
  return context;
}

interface AIAdvisorProviderProps {
  children: ReactNode;
}

export default function AIAdvisorProvider({ children }: AIAdvisorProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    
    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Obtener respuesta del AI
      const response = await askTaxAdvisor(message, messages);
      
      // Agregar respuesta del asistente
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al comunicarse con el asesor AI:', error);
      
      // Agregar mensaje de error
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value = {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };

  return (
    <AIAdvisorContext.Provider value={value}>
      {children}
    </AIAdvisorContext.Provider>
  );
}
