import { useState } from "react";
import Messages from "./components/Messages";
import "./App.css";
import Conversations from "./components/Conversations";
import ConversationsList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import MessageInput from "./components/MessageInput";

function App() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  const handleMessagesUpdate = () => {};

  return (
    <div className="App">
      {selectedConversationId !== null && (
        <MessageInput
          conversationId={selectedConversationId}
          onMessagesUpdate={handleMessagesUpdate}
        />
      )}
      <Conversations />
      <Sidebar onSelect={setSelectedConversationId} /> 
      <Messages />
      <ConversationsList onSelect={setSelectedConversationId} />
      {selectedConversationId && <ChatWindow conversationId={selectedConversationId} />}

    </div>
  );
}

export default App;
