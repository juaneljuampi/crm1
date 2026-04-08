// src/components/MessageInput.tsx
import { useState } from "react";
import { getMessages } from "../services/api";

interface Props {
  conversationId: number;
  onMessagesUpdate: (msgs: any[]) => void;
}

export default function MessageInput({ conversationId, onMessagesUpdate }: Props) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        message: text.trim(),
        mode: "text",
      }),
    });

    await res.json();

    // refrescar mensajes después de enviar
    const msgs = await getMessages(conversationId);
    onMessagesUpdate(msgs);

    // limpiar input
    setText("");
  };

  return (
    <div className="message-input">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Escribe un mensaje..."
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
