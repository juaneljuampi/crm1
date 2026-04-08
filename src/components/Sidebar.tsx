// src/components/Sidebar.tsx
import { useEffect, useState } from "react";

interface Conversation {
  id: number;
  customer_number: string;
  status: string;
}

export default function Sidebar({ onSelect }: { onSelect: (id: number) => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  // 🔥 cargar conversaciones
  const loadConversations = async () => {
    try {
      const res = await fetch(`${API}/conversations`);
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando conversaciones:", err);
      setConversations([]);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 🔥 enviar mensaje
  const sendMessage = async () => {
    if (!number || !message) {
      alert("⚠️ Debes ingresar número y mensaje");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: number.trim(),
          body: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error enviando mensaje");
      }

      await loadConversations();

      if (data.conversationId) {
        onSelect(data.conversationId);
      }

      setNumber("");
      setMessage("");
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      alert("❌ No se pudo enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 asignar conversación
  const assignConversation = async () => {
    if (!number) return;

    try {
      const res = await fetch(`${API}/conversations/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: number.trim(),
          assignedTo: "Juan",
        }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      await loadConversations();
    } catch (err) {
      console.error("Error asignando conversación:", err);
    }
  };

  // 🔥 plantilla
  const useTemplate = async () => {
    if (!number) return;

    try {
      const res = await fetch(`${API}/conversations/template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: number.trim(),
          templateName: "bienvenida",
        }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      await loadConversations();
    } catch (err) {
      console.error("Error usando plantilla:", err);
    }
  };

  return (
    <div className="sidebar">
      <h3>Conversaciones</h3>

      {/* LISTA */}
      <ul>
        {conversations.length === 0 ? (
          <p>No hay conversaciones</p>
        ) : (
          conversations.map((conv) => (
            <li key={conv.id} onClick={() => onSelect(conv.id)}>
              {conv.customer_number} ({conv.status})
            </li>
          ))
        )}
      </ul>

      {/* ENVÍO DE MENSAJE */}
      <div className="new-conversation">
        <h4>Enviar mensaje</h4>

        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Ej: 56992144697"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />

        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>

        <div style={{ marginBottom: "12px" }}></div>

        <button onClick={assignConversation}>Asignar</button>

        <div style={{ marginBottom: "12px" }}></div>

        <button onClick={useTemplate}>Plantillas</button>
      </div>
    </div>
  );
}
