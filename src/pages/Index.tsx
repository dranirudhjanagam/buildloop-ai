import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import IdeaInput from "@/components/IdeaInput";
import ChatInterface from "@/components/ChatInterface";
import ResultsDashboard from "@/components/ResultsDashboard";

interface Message {
  role: "assistant" | "user";
  content: string;
}

type Screen = "landing" | "idea" | "chat" | "results";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("landing");
  const [idea, setIdea] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);

  const handleIdeaSubmit = (text: string) => {
    setIdea(text);
    setScreen("chat");
  };

  const handleChatComplete = (conv: Message[]) => {
    setConversation(conv);
    setScreen("results");
  };

  const handleRestart = () => {
    setIdea("");
    setConversation([]);
    setScreen("landing");
  };

  return (
    <div>
      {screen === "landing" && <LandingPage onStart={() => setScreen("idea")} />}
      {screen === "idea" && <IdeaInput onSubmit={handleIdeaSubmit} />}
      {screen === "chat" && <ChatInterface idea={idea} onComplete={handleChatComplete} />}
      {screen === "results" && <ResultsDashboard idea={idea} conversation={conversation} onRestart={handleRestart} />}
    </div>
  );
};

export default Index;
