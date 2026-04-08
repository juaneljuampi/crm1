import { useEffect, useState } from "react";

interface Message {
  id: number;
  conversation_id: number;
  sender: string;
  text: string;
  timestamp: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [number, setNumber] = useState("");
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);

  // 👇 URL base desde tu .env
  const API = `${import.meta.env.VITE_API_URL}/api`;

  // 🔥 cargar mensajes
  const loadMessages = async () => {
    if (!conversationId) return;

    try {
      const res = await fetch(`${API}/messages?conversationId=${conversationId}`);
      if (!res.ok) throw new Error("Error cargando mensajes");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error al cargar mensajes:", err);
      setMessages([]);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  // 🔥 enviar mensaje
  const sendMessage = async () => {
    if (!number || !text) {
      alert("Debes ingresar número y mensaje");
      return;
    }

    try {
      const res = await fetch(`${API}/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: number.trim(), body: text.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error enviando mensaje");

      // 👇 actualiza conversationId con el que devuelve el backend
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      setText("");
      await loadMessages();
    } catch (err) {
      console.error("❌ Error al enviar mensaje:", err);
      alert("No se pudo enviar el mensaje");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Chat básico</h2>

      {/* Lista de mensajes */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          height: "300px",
          overflowY: "auto",
          marginBottom: "1rem",
        }}
      >
        {messages.length === 0 ? (
          <p>No hay mensajes</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: "8px" }}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Formulario de envío */}
      <div>
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Número ej: 56992144697"
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
