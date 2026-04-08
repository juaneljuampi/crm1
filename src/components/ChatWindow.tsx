import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// 👇 Usa variable de entorno para WebSocket
const socket = io(import.meta.env.VITE_WS_URL);

interface Message {
  id: number;
  conversation_id: number;
  sender: string;
  body: string;
  timestamp: string;
}

type ChatWindowProps = {
  conversationId: number;
};

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  // 👇 Cargar historial al abrir conversación
  useEffect(() => {
    if (conversationId) {
      fetch(`${import.meta.env.VITE_API_URL}/messages?conversationId=${conversationId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMessages(data);
          } else {
            setMessages([]);
            console.error("Error cargando mensajes:", data);
          }
        })
        .catch((err) => {
          console.error("Error en fetch:", err);
          setMessages([]);
        });
    }
  }, [conversationId]);

  // 👇 Escuchar mensajes en tiempo real
  useEffect(() => {
    socket.on("newMessage", (msg: Message) => {
      if (msg.conversation_id === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch(`${import.meta.env.VITE_API_URL}/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, message: text.trim(), mode: "text" }),
    });

    setText("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          background: "#ECE5DD",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              margin: "0.5rem 0",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              maxWidth: "60%",
              alignSelf: m.sender === "customer" ? "flex-start" : "flex-end",
              background: m.sender === "customer" ? "white" : "#DCF8C6",
            }}
          >
            {m.body}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", padding: "0.5rem", background: "#f0f0f0" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendMessage} style={{ marginLeft: "0.5rem" }}>
          Enviar
        </button>
      </div>
    </div>
  );
}
