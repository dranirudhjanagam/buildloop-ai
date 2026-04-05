import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, MapPin, Rocket, Users, Search, Code, Megaphone, BarChart3, MessageSquare, Target, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface RoadmapStep {
  id?: string;
  week: number;
  week_title: string;
  task_title: string;
  task_description: string;
  is_done: boolean;
  sort_order: number;
}

interface NextStepsRoadmapProps {
  projectId?: string;
}

const WEEK_ICONS = [Search, Code, Users];
const TASK_ICONS = [
  [Target, MessageSquare, BarChart3, Zap],
  [Code, Rocket, Search, BarChart3],
  [Megaphone, Users, MessageSquare, MapPin],
];

const DEFAULT_ROADMAP: RoadmapStep[] = [
  // Week 1
  { week: 1, week_title: "Validate Problem", task_title: "Conduct 10 customer interviews", task_description: "Reach out to your target audience and conduct structured interviews to validate the problem exists and understand their pain points deeply.", is_done: false, sort_order: 0 },
  { week: 1, week_title: "Validate Problem", task_title: "Analyze competitor landscape", task_description: "Research existing solutions, identify gaps in the market, and document what competitors do well and where they fall short.", is_done: false, sort_order: 1 },
  { week: 1, week_title: "Validate Problem", task_title: "Create problem hypothesis document", task_description: "Write a clear problem statement with supporting evidence from your research. Define success metrics for validation.", is_done: false, sort_order: 2 },
  { week: 1, week_title: "Validate Problem", task_title: "Survey 50+ potential users", task_description: "Create and distribute a focused survey to quantitatively validate demand. Aim for statistically meaningful sample size.", is_done: false, sort_order: 3 },
  // Week 2
  { week: 2, week_title: "Build MVP", task_title: "Define core feature set", task_description: "Based on validation insights, identify the minimum set of features that solve the core problem. Ruthlessly cut scope.", is_done: false, sort_order: 0 },
  { week: 2, week_title: "Build MVP", task_title: "Build functional prototype", task_description: "Develop a working prototype focusing on the primary user flow. Use no-code tools or rapid frameworks to move fast.", is_done: false, sort_order: 1 },
  { week: 2, week_title: "Build MVP", task_title: "Internal testing & QA", task_description: "Test the prototype thoroughly. Fix critical bugs and ensure the core flow works smoothly end-to-end.", is_done: false, sort_order: 2 },
  { week: 2, week_title: "Build MVP", task_title: "Set up analytics & tracking", task_description: "Implement basic analytics to measure user behavior, feature usage, and conversion events from day one.", is_done: false, sort_order: 3 },
  // Week 3
  { week: 3, week_title: "Acquire First Users", task_title: "Launch on community platforms", task_description: "Share your MVP on Product Hunt, Reddit, Hacker News, and relevant communities. Write compelling launch copy.", is_done: false, sort_order: 0 },
  { week: 3, week_title: "Acquire First Users", task_title: "Personal outreach to 50 prospects", task_description: "Directly reach out to potential users via email, LinkedIn, or Twitter. Offer early access and personal onboarding.", is_done: false, sort_order: 1 },
  { week: 3, week_title: "Acquire First Users", task_title: "Collect and act on feedback", task_description: "Set up feedback channels, conduct user interviews with early adopters, and prioritize improvements based on real usage.", is_done: false, sort_order: 2 },
  { week: 3, week_title: "Acquire First Users", task_title: "Define growth loop", task_description: "Identify your primary acquisition channel and design a repeatable growth loop. Set weekly growth targets.", is_done: false, sort_order: 3 },
];

const NextStepsRoadmap = ({ projectId }: NextStepsRoadmapProps) => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<RoadmapStep[]>(DEFAULT_ROADMAP);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (projectId && user) loadSteps();
  }, [projectId, user]);

  const loadSteps = async () => {
    const { data } = await supabase
      .from("roadmap_steps")
      .select("*")
      .eq("project_id", projectId!)
      .order("week")
      .order("sort_order");

    if (data && data.length > 0) {
      setSteps(data.map((d: any) => ({
        id: d.id,
        week: d.week,
        week_title: d.week_title,
        task_title: d.task_title,
        task_description: d.task_description,
        is_done: d.is_done,
        sort_order: d.sort_order,
      })));
    }
    setLoaded(true);
  };

  const saveSteps = async (updatedSteps: RoadmapStep[]) => {
    if (!projectId || !user) return;

    // If steps have IDs, update; otherwise insert
    const hasIds = updatedSteps.some((s) => s.id);
    if (hasIds) {
      // Update each changed step
      for (const step of updatedSteps) {
        if (step.id) {
          await supabase
            .from("roadmap_steps")
            .update({ is_done: step.is_done } as any)
            .eq("id", step.id);
        }
      }
    } else {
      // First time: insert all
      const rows = updatedSteps.map((s) => ({
        project_id: projectId,
        user_id: user.id,
        week: s.week,
        week_title: s.week_title,
        task_title: s.task_title,
        task_description: s.task_description,
        is_done: s.is_done,
        sort_order: s.sort_order,
      }));
      const { data, error } = await supabase.from("roadmap_steps").insert(rows as any).select();
      if (error) {
        toast({ title: "Error", description: "Failed to save progress", variant: "destructive" });
        return;
      }
      if (data) {
        setSteps(data.map((d: any) => ({
          id: d.id,
          week: d.week,
          week_title: d.week_title,
          task_title: d.task_title,
          task_description: d.task_description,
          is_done: d.is_done,
          sort_order: d.sort_order,
        })));
        return;
      }
    }
  };

  const toggleStep = async (weekIdx: number, taskIdx: number) => {
    const updated = [...steps];
    const globalIdx = steps.findIndex(
      (s) => s.week === weekIdx + 1 && s.sort_order === taskIdx
    );
    if (globalIdx === -1) return;
    updated[globalIdx] = { ...updated[globalIdx], is_done: !updated[globalIdx].is_done };
    setSteps(updated);
    await saveSteps(updated);
  };

  const weeks = [1, 2, 3];
  const completedCount = steps.filter((s) => s.is_done).length;
  const totalCount = steps.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="mt-14"
    >
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
          Your <span className="gradient-text">Next Steps Roadmap</span>
        </h2>
        <p className="text-muted-foreground">Turn insights into action — week by week</p>
      </div>

      {/* Progress bar */}
      <div className="glass rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Overall Progress</span>
          <span className="text-sm font-bold text-primary">{progressPct}% complete</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{completedCount} of {totalCount} tasks completed</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

        <div className="space-y-8">
          {weeks.map((week, wi) => {
            const weekSteps = steps.filter((s) => s.week === week);
            const weekDone = weekSteps.filter((s) => s.is_done).length;
            const WeekIcon = WEEK_ICONS[wi];
            const allDone = weekDone === weekSteps.length;

            return (
              <motion.div
                key={week}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + wi * 0.15, duration: 0.5 }}
              >
                {/* Week header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${allDone ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-primary/10 border-primary/20 text-primary"}`}>
                    <WeekIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">
                      Week {week}: {weekSteps[0]?.week_title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{weekDone}/{weekSteps.length} tasks done</p>
                  </div>
                </div>

                {/* Tasks */}
                <div className="md:ml-16 grid gap-3">
                  {weekSteps.map((step, ti) => {
                    const TaskIcon = TASK_ICONS[wi]?.[ti] || Target;
                    return (
                      <motion.div
                        key={`${week}-${ti}`}
                        whileHover={{ scale: 1.01 }}
                        className={`glass rounded-xl p-4 cursor-pointer transition-all border ${step.is_done ? "border-green-500/20 bg-green-500/5" : "border-transparent hover:border-primary/20"}`}
                        onClick={() => toggleStep(wi, ti)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            {step.is_done ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <TaskIcon className="w-4 h-4 text-primary flex-shrink-0" />
                              <h4 className={`font-semibold text-sm ${step.is_done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {step.task_title}
                              </h4>
                            </div>
                            <p className={`text-xs leading-relaxed ${step.is_done ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
                              {step.task_description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default NextStepsRoadmap;
