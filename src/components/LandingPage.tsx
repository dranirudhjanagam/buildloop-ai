import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Lightbulb } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

const features = [
  { icon: Lightbulb, title: "Structured Thinking", desc: "AI guides you through proven validation frameworks" },
  { icon: Target, title: "Rapid Validation", desc: "Go from raw idea to actionable validation plan" },
  { icon: Zap, title: "Learning Loops", desc: "Iterate fast with structured feedback cycles" },
];

const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-primary" />
          AI-Powered Startup Validation
        </motion.div>

        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight mb-4">
          <span className="gradient-text">BuildLoop</span>{" "}
          <span className="text-foreground">AI</span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground font-light mb-3">
          From idea to validation, faster
        </p>

        <p className="text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Turn your idea into a validated startup using AI-powered structured thinking and rapid learning loops.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-border transition-all hover:brightness-110"
        >
          Start Building
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 max-w-4xl w-full"
      >
        {features.map((f, i) => (
          <div key={i} className="p-6 rounded-xl bg-card/50 border border-border backdrop-blur-sm">
            <f.icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LandingPage;
