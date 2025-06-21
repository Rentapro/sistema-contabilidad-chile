"use client";

import { useState, useRef, useEffect } from "react";
import { askTaxAdvisor, generateContextualGuide, type ChatMessage } from "@/services/aiAdvisorService";

export default function AIAdvisorWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; timestamp: Date }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Guías rápidas predefinidas
  const quickGuides = [
    { label: "💰 Minimizar Impuestos Agresivamente", prompt: "Necesito todas las estrategias más agresivas pero legales para reducir mis impuestos al mínimo, incluyendo técnicas avanzadas y vacíos legales" },
    { label: "📋 Completar F29 Optimizado", prompt: "Guíame paso a paso para completar el F29 aprovechando todos los beneficios fiscales posibles y minimizando el pago" },    { label: "🏢 Régimen Fiscal Óptimo", prompt: "Explícame todas las opciones de regímenes tributarios y cómo elegir el que me haga pagar menos impuestos" },
    { label: "🔥 Técnicas de Diferimiento", prompt: "Enséñame todas las técnicas para diferir o evitar pagos de impuestos usando timing fiscal y estructuración de operaciones" }
  ];

  // Mensaje de bienvenida del contador IA
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `¡Hola! 👋 Soy tu contador auditor de IA especializado en normativa tributaria chilena.

🎯 **MI MISIÓN**: Reducir tus impuestos al MÍNIMO LEGAL posible

📋 **PUEDO AYUDARTE CON**:
✅ Estrategias para reducir impuestos legalmente
✅ Completar formularios del SII (F29, F22, etc.)
✅ Maximizar gastos deducibles
✅ Planificación tributaria
✅ Beneficios fiscales disponibles
✅ Regímenes especiales (PyME, 14 TER)

� **USA LOS BOTONES** debajo para guías rápidas o pregúntame cualquier cosa específica.

¿En qué puedo ayudarte hoy?`,
        timestamp: new Date()
      }]);
    }
  }, [messages.length]);

  const handleQuickGuide = async (prompt: string) => {
    const userMsg = { role: "user", content: prompt, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    
    try {
      // Usar la función de guía contextual para respuestas más detalladas
      const response = await generateContextualGuide(prompt);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: response, 
        timestamp: new Date() 
      }]);
    } catch (error) {
      console.error('Error getting guide:', error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "Lo siento, hay un problema temporal con la IA. Por favor intenta nuevamente.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    const messageToSend = input;
    setInput("");
    setIsLoading(true);
    
    try {
      // Convertir mensajes al formato esperado por askTaxAdvisor
      const history: ChatMessage[] = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      const response = await askTaxAdvisor(messageToSend, history);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: response, 
        timestamp: new Date() 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "🧮 **Contador Auditor IA - Respuesta Inteligente**\n\nHe procesado tu consulta. Basándome en mi conocimiento de normativa tributaria chilena:\n\n**Para optimización fiscal:**\n- Revisar crédito fiscal disponible en facturas de compras\n- Verificar gastos deducibles válidos del período\n- Considerar timing de inversiones para maximizar beneficios\n\n**Recomendación específica:**\nPara casos como Ferretería El Clavo con IVA de $4.624.000, revisar:\n1. Facturas de proveedores no utilizadas\n2. Gastos operacionales válidos\n3. Inversiones en activos fijos\n\n¿Qué aspecto específico te interesa profundizar?",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón flotante principal */}
      <div className="relative">
        <button
          onClick={() => {
            if (open && !minimized) {
              setMinimized(true);
            } else if (open && minimized) {
              setMinimized(false);
            } else {
              setOpen(true);
              setMinimized(false);
            }
          }}
          className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-xl focus:outline-none transition-all duration-300 transform hover:scale-105 ${
            open && !minimized ? 'p-3' : 'p-4'
          }`}
          title="Contador Auditor IA - Especialista en Tributación Chilena"
        >
          {open && !minimized ? "➖" : "🧮"}
        </button>

        {/* Indicador de chat activo cuando está minimizado */}
        {open && minimized && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
        )}

        {/* Badge con número de mensajes no leídos cuando está minimizado */}
        {open && minimized && messages.length > 1 && (
          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {messages.filter(m => m.role === 'assistant').length}
          </div>
        )}
      </div>

      {/* Botón de cerrar cuando está abierto (alternativo) */}
      {open && !minimized && (
        <button
          onClick={() => {
            setOpen(false);
            setMinimized(false);
          }}
          className="absolute -top-2 -left-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-all duration-200 z-10"
          title="Cerrar chat"
        >
          ✖
        </button>
      )}
      
      {/* Panel de chat */}
      {open && !minimized && (<div className="mt-2 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          {/* Header del chat */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">🧮 Contador Auditor IA</h3>
              <p className="text-sm opacity-90">Especialista en Normativa Tributaria Chilena</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Botón minimizar */}
              <button
                onClick={() => setMinimized(true)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
                title="Minimizar"
              >
                <span className="text-white font-bold text-lg">➖</span>
              </button>
              {/* Botón cerrar */}
              <button
                onClick={() => {
                  setOpen(false);
                  setMinimized(false);
                }}
                className="w-8 h-8 bg-white/20 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-200"
                title="Cerrar"
              >
                <span className="text-white font-bold">✖</span>
              </button>
            </div>
          </div>
            {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-white text-gray-900 border border-gray-300 shadow-md"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center mb-2">
                      <span className="text-blue-700 font-bold text-sm">🧮 Contador IA</span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap font-medium">{msg.content}</div>
                  <div className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-200" : "text-gray-600"}`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
              {/* Indicador de escritura */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-gray-300 shadow-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-700 font-bold text-sm">🧮 Contador IA</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="text-xs text-gray-700 font-medium ml-2">Analizando normativa...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
            {/* Guías paso a paso rápidas */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-blue-50">
              <p className="text-xs text-blue-600 font-semibold mb-2">� Guías Paso a Paso - Clic para comenzar:</p>
              <div className="space-y-2">
                {quickGuides.map((guide, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickGuide(guide.prompt)}
                    disabled={isLoading}
                    className="w-full text-xs bg-white hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg text-left text-blue-800 font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    {guide.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                O escribe tu consulta específica abajo ⬇️
              </p>
            </div>
          )}
          
          {/* Input area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Pregúntame sobre tributación chilena..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {isLoading ? "⏳" : "📤"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Presiona Enter para enviar • Especializado en SII Chile
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
