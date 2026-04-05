import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ResultsDashboard from "@/components/ResultsDashboard";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        navigate("/dashboard");
        return;
      }
      setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </motion.button>
      </div>
      <ResultsDashboard
        idea={project.idea}
        conversation={project.conversation || []}
        onRestart={() => navigate("/dashboard")}
        savedSections={project.results}
        savedScores={project.scores}
        projectId={project.id}
      />
    </div>
  );
};

export default ProjectDetail;
