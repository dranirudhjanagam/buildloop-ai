import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
}

const IdeaInput = ({ onSubmit }: IdeaInputProps) => {
  const [idea, setIdea] = useState("");

  const handleSubmit = () => {
    if (idea.trim()) onSubmit(idea.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <AnimatedBackground />
      <div className="absolute inset-0 dot-grid opacity-15" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="flex items-center gap-2 mb-3 justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Step 1 of 3</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center mb-3 tracking-tight">
          What's your <span className="gradient-text">idea</span>?
        </h2>
        <p className="text-muted-foreground text-center mb-10 text-lg">
          Describe your startup idea and we'll help you validate it.
        </p>

        <div className="gradient-border rounded-2xl">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your startup idea..."
            rows={5}
            className="w-full bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-5 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-lg leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) handleSubmit();
            }}
          />
        </div>

        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!idea.trim()}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg disabled:opacity-40 disabled:cursor-not-allowed glow-border transition-all hover:brightness-110"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default IdeaInput;
