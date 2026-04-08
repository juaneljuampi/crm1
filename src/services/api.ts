const API_URL = import.meta.env.VITE_API_URL;

export async function getConversations() {
  const res = await fetch(`${API_URL}/conversations`);
  return res.json();
}

export async function getMessages(conversationId: number) {
  const res = await fetch(`${API_URL}/messages/${conversationId}`);
  return res.json();
}

export async function sendMessage(to: string, body: string) {
  const res = await fetch(`${API_URL}/send-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, body }),
  });
  return res.json();
}
