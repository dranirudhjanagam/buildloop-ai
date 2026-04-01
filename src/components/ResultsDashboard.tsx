import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Users, Rocket, ClipboardCheck, AlertTriangle, RotateCcw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface Section {
  title: string;
  content: string;
}

interface ResultsDashboardProps {
  idea: string;
  conversation: Message[];
  onRestart: () => void;
}

const SECTION_ICONS = [Target, Users, Rocket, ClipboardCheck, AlertTriangle];

const ResultsDashboard = ({ idea, conversation, onRestart }: ResultsDashboardProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-report", {
        body: { idea, conversation },
      });

      if (error) {
        throw error;
      }

      if (data?.sections) {
        setSections(data.sections);
      } else {
        throw new Error("Invalid report format");
      }
    } catch (e: any) {
      console.error("Report generation error:", e);
      toast({ title: "Error", description: "Failed to generate report. Using fallback.", variant: "destructive" });
      // Fallback sections
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Generating your validation report...</p>
        </motion.div>
      </div>
    );
  }

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
          {sections.map((section, i) => {
            const Icon = SECTION_ICONS[i] || Target;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i, duration: 0.5 }}
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
