import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import TypingIndicator from "./TypingIndicator";

interface Message {
  role: "ai" | "user";
  content: string;
}

const AI_QUESTIONS = [
  "Who is your target user? Describe them in detail — their role, daily struggles, and what motivates them.",
  "What exact problem are you solving for them? Be specific about the pain point.",
  "Why is this problem urgent? What happens if they don't solve it now?",
  "What alternatives or workarounds exist today? How do people currently deal with this?",
  "Why will users choose your solution over everything else? What's your unfair advantage?",
];

interface ChatInterfaceProps {
  idea: string;
  onComplete: (answers: string[]) => void;
}

const ChatInterface = ({ idea, onComplete }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial AI message
    setTyping(true);
    const t1 = setTimeout(() => {
      setMessages([
        { role: "ai", content: `Great idea! "${idea}" — let me help you validate it. I'll ask you 5 key questions.` },
      ]);
      setTyping(false);
    }, 1500);

    const t2 = setTimeout(() => {
      setTyping(true);
    }, 2000);

    const t3 = setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", content: AI_QUESTIONS[0] }]);
      setTyping(false);
    }, 3500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [idea]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim() || typing) return;

    const userMsg = input.trim();
    setInput("");
    const newAnswers = [...answers, userMsg];
    setAnswers(newAnswers);
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    const nextIdx = questionIndex + 1;

    if (nextIdx >= AI_QUESTIONS.length) {
      setTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Excellent! I've gathered all the insights I need. Let me generate your validation report..." },
        ]);
        setTyping(false);
        setTimeout(() => onComplete(newAnswers), 2000);
      }, 1500);
    } else {
      setQuestionIndex(nextIdx);
      setTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "ai", content: AI_QUESTIONS[nextIdx] }]);
        setTyping(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="py-5 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-foreground text-sm">BuildLoop AI</h2>
          <p className="text-xs text-muted-foreground">Question {Math.min(questionIndex + 1, 5)} of 5</p>
        </div>
        {/* Progress bar */}
        <div className="ml-auto w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${((questionIndex + (answers.length > questionIndex ? 1 : 0)) / 5) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-md">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="py-4 border-t border-border">
        <div className="flex gap-3 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your answer..."
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={typing}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || typing}
            className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
