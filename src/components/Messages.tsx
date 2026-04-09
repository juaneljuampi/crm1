import { useEffect, useState } from "react";
import api from "../api/client";

interface Message {
  id: number;
  conversation_id: number;
  sender: string;
  text: string;
  timestamp: string;
}

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  // 🔥 cargar mensajes
  const loadMessages = async () => {
    try {
      const res = await api.get("/messages");
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Error cargando mensajes:", err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // 🔥 enviar mensaje
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await api.post("/send", { to: "56992144697", body: text });
      setText("");
      await loadMessages();
    } catch (err) {
      console.error("❌ Error enviando mensaje:", err);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      backgroundColor: "#ece5dd" 
    }}>
      {/* Header estilo WhatsApp */}
      <div style={{ backgroundColor: "#075E54", color: "white", padding: "1rem" }}>
        <h3>WhatsApp CRM</h3>
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              maxWidth: "70%",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: msg.sender === "me" ? "#DCF8C6" : "white",
              alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
            }}
          >
            <p style={{ margin: 0 }}>{msg.text}</p>
            <small style={{ fontSize: "0.7rem", color: "#555" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>

      {/* Input abajo */}
      <div style={{ display: "flex", padding: "0.5rem", backgroundColor: "#f0f0f0" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
        />
        <button 
          onClick={sendMessage} 
          style={{ marginLeft: "10px", backgroundColor: "#25D366", color: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px" }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
