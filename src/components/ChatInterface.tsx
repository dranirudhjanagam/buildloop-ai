import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TypingIndicator from "./TypingIndicator";
import AnimatedBackground from "./AnimatedBackground";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatInterfaceProps {
  idea: string;
  onComplete: (conversation: Message[]) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatInterface = ({ idea, onComplete }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    streamAIResponse([
      { role: "user", content: `My startup idea is: "${idea}". Please begin the validation process.` },
    ]);
  }, [idea]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const streamAIResponse = async (conversationMessages: Message[]) => {
    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: conversationMessages }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 429) toast({ title: "Rate limited", description: "Please wait a moment and try again.", variant: "destructive" });
        else if (resp.status === 402) toast({ title: "Credits exhausted", description: "Please add funds to continue.", variant: "destructive" });
        else toast({ title: "Error", description: err.error || "Something went wrong", variant: "destructive" });
        setIsStreaming(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (assistantContent.includes("VALIDATION_COMPLETE")) {
        const cleanContent = assistantContent.replace("VALIDATION_COMPLETE", "").trim();
        setMessages((prev) =>
          prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: cleanContent || "Excellent! I've gathered all the insights I need. Let me generate your validation report..." } : m))
        );
        const finalConversation = [...conversationMessages, { role: "assistant" as const, content: cleanContent }];
        setTimeout(() => onComplete(finalConversation), 2000);
      } else {
        setQuestionCount((c) => c + 1);
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        toast({ title: "Error", description: "Failed to get AI response", variant: "destructive" });
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setInput("");
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    const fullConversation: Message[] = [
      { role: "user", content: `My startup idea is: "${idea}". Please begin the validation process.` },
      ...newMessages,
    ];
    streamAIResponse(fullConversation);
  };

  const displayMessages = messages.filter(
    (m) => !(m.role === "user" && m.content.startsWith('My startup idea is: "'))
  );

  const progressPct = (Math.min(questionCount, 5) / 5) * 100;

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4 relative">
      <AnimatedBackground />

      {/* Header */}
      <div className="relative z-10 py-5 border-b border-border/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-foreground">BuildLoop AI</h2>
          <p className="text-xs text-muted-foreground">Question {Math.min(questionCount + 1, 5)} of 5</p>
        </div>
        <div className="ml-auto w-36 h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto py-6 space-y-4">
        <AnimatePresence>
          {displayMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "glass rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isStreaming && displayMessages[displayMessages.length - 1]?.role !== "assistant" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="glass rounded-2xl rounded-bl-md">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="relative z-10 py-4 border-t border-border/50">
        <div className="flex gap-3 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your answer..."
            className="flex-1 glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={isStreaming}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-all glow-border"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
