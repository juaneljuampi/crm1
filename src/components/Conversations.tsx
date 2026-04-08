// src/components/Conversations.tsx
import { useEffect, useState } from "react";

interface Conversation {
  id: number;
  customer_number: string;
  status: string;
}

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/conversations`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Error en backend");
        }

        const text = await res.text();

        try {
          return JSON.parse(text);
        } catch {
          console.error("❌ No es JSON:", text);
          return [];
        }
      })
      .then((data) => {
        setConversations(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error cargando conversaciones:", err);
        setConversations([]);
      });
  }, []);

  return (
    <div className="chat-panel">
      {conversations.length === 0 ? (
        <p>No hay conversaciones</p>
      ) : (
        conversations.map((conv) => (
          <div key={conv.id} className="chat-item">
            <strong>{conv.customer_number}</strong> - {conv.status}
          </div>
        ))
      )}
    </div>
  );
}