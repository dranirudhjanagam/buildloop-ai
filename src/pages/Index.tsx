import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "@/components/LandingPage";
import IdeaInput from "@/components/IdeaInput";
import ChatInterface from "@/components/ChatInterface";
import ResultsDashboard from "@/components/ResultsDashboard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "assistant" | "user";
  content: string;
}

type Screen = "idea" | "chat" | "results";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("idea");
  const [idea, setIdea] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    setScreen("idea");
  };

  const handleSaveProject = async (sections: any[], scores: any) => {
    if (!user) return;
    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      idea,
      conversation: conversation as any,
      results: sections as any,
      scores: scores as any,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to save project", variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: "Project saved to your dashboard" });
      navigate("/dashboard");
    }
  };

  return (
    <div>
      {screen === "idea" && <IdeaInput onSubmit={handleIdeaSubmit} />}
      {screen === "chat" && <ChatInterface idea={idea} onComplete={handleChatComplete} />}
      {screen === "results" && (
        <ResultsDashboard
          idea={idea}
          conversation={conversation}
          onRestart={handleRestart}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};

export default Index;
