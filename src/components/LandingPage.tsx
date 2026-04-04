import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Lightbulb } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";

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
      <AnimatedBackground />
      <div className="absolute inset-0 dot-grid opacity-20" />

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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-primary" />
          AI-Powered Startup Validation
        </motion.div>

        <h1 className="font-display text-6xl sm:text-8xl font-bold tracking-tight mb-5">
          <span className="gradient-text">BuildLoop</span>{" "}
          <span className="text-foreground">AI</span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground font-light mb-3">
          From idea to validation, faster
        </p>

        <p className="text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed text-lg">
          Turn your idea into a validated startup using AI-powered structured thinking and rapid learning loops.
        </p>

        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-border transition-all hover:brightness-110"
        >
          Start Building
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-28 max-w-4xl w-full"
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl glass hover-lift cursor-default"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LandingPage;
