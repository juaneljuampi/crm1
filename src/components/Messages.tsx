import { useEffect, useState } from "react";

interface Message {
  id: number;
  conversation_id: number;
  sender: string;
  text: string;
  timestamp: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // 👇 URL base desde tu .env
  const API = import.meta.env.VITE_API_URL + "/api";

  // 🔥 cargar todos los mensajes
  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/messages`);
      if (!res.ok) throw new Error("Error cargando mensajes");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error al cargar mensajes:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "auto" }}>
      <h2>📩 Mensajes</h2>

      {loading ? (
        <p>Cargando mensajes...</p>
      ) : messages.length === 0 ? (
        <p>No hay mensajes disponibles</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {messages.map((msg) => (
            <li
              key={msg.id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "0.5rem 0",
              }}
            >
              <strong>{msg.sender}:</strong> {msg.text}
              <br />
              <small>
                Conversación #{msg.conversation_id} · {new Date(msg.timestamp).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
