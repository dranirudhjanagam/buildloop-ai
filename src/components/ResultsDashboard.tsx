import { motion } from "framer-motion";
import { Target, Users, Rocket, ClipboardCheck, AlertTriangle, RotateCcw } from "lucide-react";

interface ResultsDashboardProps {
  idea: string;
  answers: string[];
  onRestart: () => void;
}

const ResultsDashboard = ({ idea, answers, onRestart }: ResultsDashboardProps) => {
  const sections = [
    {
      icon: Target,
      title: "Problem Statement",
      content: `Your target users face the problem of: ${answers[1] || "N/A"}. This is urgent because ${answers[2] || "N/A"}.`,
    },
    {
      icon: Users,
      title: "Ideal Customer Profile",
      content: `Primary user: ${answers[0] || "N/A"}. They currently deal with this by using: ${answers[3] || "existing alternatives"}.`,
    },
    {
      icon: Rocket,
      title: "MVP Idea",
      content: `Build a focused solution for "${idea}" that specifically addresses the core pain point. Start with the smallest version that delivers value to your target user and differentiates through: ${answers[4] || "your unique approach"}.`,
    },
    {
      icon: ClipboardCheck,
      title: "Validation Plan",
      content: `1. Interview 10-15 potential users matching your ICP\n2. Build a landing page to test messaging and collect signups\n3. Create a no-code prototype for user testing\n4. Run a 2-week pre-sale or waitlist campaign\n5. Measure conversion rates and gather qualitative feedback`,
    },
    {
      icon: AlertTriangle,
      title: "Key Risks",
      content: `• Market risk: Existing alternatives (${answers[3] || "competitors"}) may be "good enough"\n• Adoption risk: Users may not perceive urgency strongly enough\n• Execution risk: Building too much before validating core assumptions\n• Differentiation risk: Your advantage (${answers[4] || "unique value"}) needs continuous reinforcement`,
    },
  ];

  return (
    <div className="min-h-screen px-6 py-12 relative">
      <div className="absolute inset-0 dot-grid opacity-15" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Your <span className="gradient-text">Validation Report</span>
          </h1>
          <p className="text-muted-foreground">AI-generated insights for: "{idea}"</p>
        </motion.div>

        <div className="space-y-5">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">{section.title}</h3>
              </div>
              <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-medium hover:bg-secondary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
