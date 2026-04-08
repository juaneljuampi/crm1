import { useEffect, useState } from "react";

interface Conversation {
  id: number;
  customer_number: string;
  status: string;
}

interface Props {
  onSelect: (id: number) => void;
}

export default function ConversationsList({ onSelect }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/conversations`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Error en backend");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          console.error("Respuesta inválida:", data);
          setConversations([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando conversaciones:", err);
        setConversations([]);
      });
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>Conversaciones</h3>

      {conversations.length === 0 ? (
        <p>No hay conversaciones</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {conversations.map((conv) => (
            <li
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <strong>{conv.customer_number}</strong>
              <p style={{ margin: 0, color: "#555" }}>
                Estado: {conv.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}