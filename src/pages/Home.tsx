// src/pages/Home.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [showWidget, setShowWidget] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      
      {/* SIDEBAR (CRM PRINCIPAL) */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <Sidebar onSelect={setSelectedConversation} />
      </div>

      {/* CHAT GRANDE */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedConversation ? (
          <>
            <ChatWindow conversationId={selectedConversation} />
            <MessageInput
              conversationId={selectedConversation}
              onMessagesUpdate={() => {}}
            />
          </>
        ) : (
          <div style={{ padding: "2rem" }}>
            <h2>Selecciona una conversación</h2>
          </div>
        )}
      </div>

      {/* WIDGET FLOTANTE (INDEPENDIENTE) */}
      {showWidget && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            height: "500px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          <div style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
            <strong>Widget WhatsApp</strong>
          </div>

          <div style={{ flex: 1, padding: "10px" }}>
            <p>Acá puedes poner otro flujo (chat bot, formulario, etc)</p>
          </div>
        </div>
      )}

      {/* BOTÓN WHATSAPP */}
      <WhatsAppButton onClick={() => setShowWidget(!showWidget)} />
    </div>
  );
}
