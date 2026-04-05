
CREATE TABLE public.roadmap_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  week integer NOT NULL,
  week_title text NOT NULL,
  task_title text NOT NULL,
  task_description text NOT NULL,
  is_done boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.roadmap_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roadmap steps" ON public.roadmap_steps
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roadmap steps" ON public.roadmap_steps
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmap steps" ON public.roadmap_steps
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmap steps" ON public.roadmap_steps
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
