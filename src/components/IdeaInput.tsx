import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

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
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />

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

        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2">
          What's your <span className="gradient-text">idea</span>?
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Describe your startup idea and we'll help you validate it.
        </p>

        <div className="gradient-border rounded-xl">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your startup idea..."
            rows={5}
            className="w-full bg-card rounded-xl px-6 py-5 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) handleSubmit();
            }}
          />
        </div>

        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!idea.trim()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:brightness-110"
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
