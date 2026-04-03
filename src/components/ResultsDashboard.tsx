import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Users, Rocket, ClipboardCheck, AlertTriangle, RotateCcw, Loader2, TrendingUp, Brain, Gauge, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface Section {
  title: string;
  content: string;
}

interface Scores {
  problem_clarity: number;
  market_need: number;
  feasibility: number;
  risk_level: "Low" | "Medium" | "High";
  overall_score: number;
}

interface ResultsDashboardProps {
  idea: string;
  conversation: Message[];
  onRestart: () => void;
  savedSections?: Section[];
  savedScores?: Scores;
  onSave?: (sections: Section[], scores: Scores | null) => void;
}

const SECTION_ICONS = [Target, Users, Rocket, ClipboardCheck, AlertTriangle];

const getScoreColor = (score: number, max: number = 10) => {
  const pct = (score / max) * 100;
  if (pct >= 70) return "text-green-400";
  if (pct >= 40) return "text-yellow-400";
  return "text-red-400";
};

const getProgressColor = (score: number, max: number = 10) => {
  const pct = (score / max) * 100;
  if (pct >= 70) return "[&>div]:bg-green-500";
  if (pct >= 40) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-500";
};

const getRiskColor = (level: string) => {
  if (level === "Low") return "text-green-400 bg-green-500/10 border-green-500/20";
  if (level === "Medium") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  return "text-red-400 bg-red-500/10 border-red-500/20";
};

const getOverallColor = (score: number) => {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
};

const getOverallRingColor = (score: number) => {
  if (score >= 70) return "stroke-green-500";
  if (score >= 40) return "stroke-yellow-500";
  return "stroke-red-500";
};

const ResultsDashboard = ({ idea, conversation, onRestart, savedSections, savedScores }: ResultsDashboardProps) => {
  const [sections, setSections] = useState<Section[]>(savedSections || []);
  const [scores, setScores] = useState<Scores | null>(savedScores || null);
  const [loading, setLoading] = useState(!savedSections);

  useEffect(() => {
    if (!savedSections) generateReport();
  }, []);

  const generateReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-report", {
        body: { idea, conversation },
      });

      if (error) throw error;

      if (data?.sections) setSections(data.sections);
      else throw new Error("Invalid report format");

      if (data?.scores) setScores(data.scores);
    } catch (e: any) {
      console.error("Report generation error:", e);
      toast({ title: "Error", description: "Failed to generate report. Using fallback.", variant: "destructive" });
      setSections([
        { title: "Problem Statement", content: "Could not generate AI report. Please try again." },
        { title: "Ideal Customer Profile", content: "N/A" },
        { title: "MVP Idea", content: "N/A" },
        { title: "Validation Plan", content: "N/A" },
        { title: "Key Risks", content: "N/A" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Generating your validation report...</p>
        </motion.div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 54;
  const overallOffset = scores ? circumference - (scores.overall_score / 100) * circumference : circumference;

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

        {/* Validation Score Section */}
        {scores && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-5 text-center">Validation Score</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Overall Score - Large */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="md:row-span-2 bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center"
              >
                <p className="text-sm text-muted-foreground mb-3">Overall Score</p>
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-secondary" />
                    <motion.circle
                      cx="60" cy="60" r="54" fill="none" strokeWidth="8"
                      className={getOverallRingColor(scores.overall_score)}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: overallOffset }}
                      transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-display text-3xl font-bold ${getOverallColor(scores.overall_score)}`}>
                      {scores.overall_score}%
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Individual Scores */}
              {[
                { label: "Problem Clarity", value: scores.problem_clarity, icon: Brain },
                { label: "Market Need", value: scores.market_need, icon: TrendingUp },
                { label: "Feasibility", value: scores.feasibility, icon: Gauge },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-display text-2xl font-bold ${getScoreColor(item.value)}`}>
                      {item.value}<span className="text-sm text-muted-foreground font-normal">/10</span>
                    </span>
                  </div>
                  <Progress
                    value={item.value * 10}
                    className={`h-2 mt-3 bg-secondary ${getProgressColor(item.value)}`}
                  />
                </motion.div>
              ))}

              {/* Risk Level */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-card border border-border rounded-xl p-5 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getRiskColor(scores.risk_level)}`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <p className={`font-display text-lg font-bold ${getRiskColor(scores.risk_level).split(" ")[0]}`}>
                    {scores.risk_level}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Report Sections */}
        <div className="space-y-5">
          {sections.map((section, i) => {
            const Icon = SECTION_ICONS[i] || Target;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i + (scores ? 0.7 : 0), duration: 0.5 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{section.title}</h3>
                </div>
                <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </motion.div>
            );
          })}
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
