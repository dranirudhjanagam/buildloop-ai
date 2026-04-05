import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Sparkles, ChevronUp } from "lucide-react";
import CircularProgress from "./CircularProgress";

interface Improvement {
  title: string;
  original_summary: string;
  improved: string;
  change_reason: string;
}

interface ScorePrediction {
  problem_clarity: number;
  market_need: number;
  feasibility: number;
  risk_level: "Low" | "Medium" | "High";
  overall_score: number;
}

interface OriginalScores {
  problem_clarity: number;
  market_need: number;
  feasibility: number;
  risk_level: "Low" | "Medium" | "High";
  overall_score: number;
}

interface IdeaComparisonProps {
  improvements: Improvement[];
  scorePrediction: ScorePrediction;
  originalScores: OriginalScores;
  onClose: () => void;
}

const ScoreDelta = ({ label, original, improved }: { label: string; original: number; improved: number }) => {
  const delta = improved - original;
  const isPositive = delta > 0;
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{original}/10</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">{improved}/10</span>
        {delta !== 0 && (
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${isPositive ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
            {isPositive ? "+" : ""}{delta}
          </span>
        )}
      </div>
    </div>
  );
};

const IdeaComparison = ({ improvements, scorePrediction, originalScores, onClose }: IdeaComparisonProps) => {
  const overallDelta = scorePrediction.overall_score - originalScores.overall_score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered Improvements
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground">Your Upgraded Idea</h2>
        <p className="text-muted-foreground mt-2">Side-by-side comparison with AI-suggested improvements</p>
      </div>

      {/* Score Comparison Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg text-foreground">Predicted Score Improvement</h3>
          {overallDelta > 0 && (
            <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <ChevronUp className="w-4 h-4" />
              +{overallDelta}% overall
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall comparison */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Original</p>
            <CircularProgress
              value={originalScores.overall_score}
              size={90}
              strokeWidth={8}
              colorClass="text-muted-foreground"
              ringClass="stroke-muted-foreground/50"
              delay={0.3}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <ArrowRight className="w-6 h-6 text-green-400 hidden md:block" />
            <div className="md:hidden h-px w-full bg-border my-2" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-green-400 uppercase tracking-wider font-semibold">Improved</p>
            <CircularProgress
              value={scorePrediction.overall_score}
              size={90}
              strokeWidth={8}
              colorClass="text-green-400"
              ringClass="stroke-green-500"
              delay={0.5}
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <ScoreDelta label="Problem Clarity" original={originalScores.problem_clarity} improved={scorePrediction.problem_clarity} />
          <ScoreDelta label="Market Need" original={originalScores.market_need} improved={scorePrediction.market_need} />
          <ScoreDelta label="Feasibility" original={originalScores.feasibility} improved={scorePrediction.feasibility} />
        </div>
      </motion.div>

      {/* Improvement Cards */}
      <div className="space-y-6">
        {improvements.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass rounded-2xl p-6 hover-lift"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="font-display font-semibold text-lg text-foreground">{item.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Original */}
              <div className="rounded-xl bg-secondary/30 border border-border/50 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">Original</p>
                <p className="text-sm text-secondary-foreground leading-relaxed">{item.original_summary}</p>
              </div>
              {/* Improved */}
              <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-4">
                <p className="text-xs uppercase tracking-wider text-green-400 mb-2 font-semibold">Improved</p>
                <p className="text-sm text-foreground leading-relaxed">{item.improved}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">{item.change_reason}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center mt-10"
      >
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="px-8 py-3.5 rounded-xl glass font-semibold text-foreground hover-lift"
        >
          Back to Report
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default IdeaComparison;
