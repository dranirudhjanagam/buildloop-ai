import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, LogOut, Zap, Calendar, TrendingUp } from "lucide-react";

interface Project {
  id: string;
  idea: string;
  scores: any;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, idea, scores, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) setProjects(data);
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen px-6 py-8 relative">
      <div className="absolute inset-0 dot-grid opacity-10" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">My Projects</h1>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              New Project
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={signOut}
              className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground mb-4">No projects yet. Start validating your first idea!</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-border"
            >
              <Plus className="w-4 h-4" />
              Start Building
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project, i) => {
              const overall = project.scores?.overall_score;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground truncate">{project.idea}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {overall != null && (
                      <div className="flex items-center gap-2 ml-4">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className={`font-display text-2xl font-bold ${getScoreColor(overall)}`}>
                          {overall}%
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
