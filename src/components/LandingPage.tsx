import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, Target, Lightbulb, Brain, Shield, BarChart3, Sparkles, ChevronRight, Check, MessageSquare, FileText, Rocket } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Lightbulb, title: "Structured Thinking", desc: "AI guides you through proven validation frameworks used by top accelerators worldwide." },
  { icon: Target, title: "Rapid Validation", desc: "Go from raw idea to actionable validation plan in under 10 minutes." },
  { icon: Zap, title: "Learning Loops", desc: "Iterate fast with structured feedback cycles that sharpen your concept." },
  { icon: Brain, title: "AI-Powered Insights", desc: "Deep analysis of market fit, risks, and competitive landscape." },
  { icon: Shield, title: "Risk Assessment", desc: "Identify blind spots and critical risks before investing time and money." },
  { icon: BarChart3, title: "Validation Scoring", desc: "Get a quantified score across clarity, market need, and feasibility." },
];

const steps = [
  { num: "01", icon: Sparkles, title: "Describe Your Idea", desc: "Share your startup concept in plain language. No pitch deck needed.", color: "from-blue-500 to-cyan-400" },
  { num: "02", icon: MessageSquare, title: "AI-Guided Interview", desc: "Our AI asks targeted questions to uncover strengths, gaps, and opportunities.", color: "from-violet-500 to-purple-400" },
  { num: "03", icon: FileText, title: "Validation Report", desc: "Receive a detailed report with scores, risks, MVP ideas, and next steps.", color: "from-emerald-500 to-teal-400" },
];

const stats = [
  { value: "10min", label: "Average validation time" },
  { value: "5", label: "Key validation dimensions" },
  { value: "100%", label: "AI-powered analysis" },
  { value: "∞", label: "Ideas you can validate" },
];

const testimonials = [
  { quote: "BuildLoop helped me see critical blind spots in my idea before I spent months building the wrong thing.", name: "Sarah K.", role: "Founder, SaaS Startup" },
  { quote: "The validation score gave me the confidence to pitch my idea to investors with real data backing it up.", name: "Marcus T.", role: "Solo Entrepreneur" },
  { quote: "I've used many idea validation tools. BuildLoop's AI interview is genuinely the most insightful experience.", name: "Priya L.", role: "Product Manager" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-80px" },
};

const staggerChild = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  viewport: { once: true },
};

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const goAuth = () => navigate("/auth");

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 glass-strong"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="font-display text-lg font-bold">
              <span className="gradient-text">BuildLoop</span>{" "}
              <span className="text-foreground">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={goAuth} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={goAuth}
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all hover:brightness-110"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16"
      >
        <AnimatedBackground />
        <div className="absolute inset-0 dot-grid opacity-20" />

        {/* Floating orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[15%] w-72 h-72 rounded-full bg-primary/5 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[15%] w-96 h-96 rounded-full bg-accent/5 blur-[120px] pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-Powered Startup Validation
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95]">
            <span className="gradient-text">Validate</span>{" "}
            <span className="text-foreground">your</span>
            <br />
            <span className="text-foreground">startup idea</span>{" "}
            <span className="gradient-text">in minutes</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn raw ideas into validated concepts with AI-powered structured thinking, 
            risk analysis, and actionable validation plans.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={goAuth}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-border transition-all hover:brightness-110"
            >
              Start Validating Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-all text-lg"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Hero visual – mockup card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
          className="relative z-10 mt-20 max-w-3xl w-full"
        >
          <div className="glass-strong rounded-2xl p-1 glow-border">
            <div className="bg-card rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <span className="text-xs text-muted-foreground ml-2 font-mono">buildloop-ai</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-3">
                  <div className="glass rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Your Idea</p>
                    <p className="text-sm text-foreground">"An AI tool that helps remote teams run async standup meetings..."</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <p className="text-xs text-primary mb-1 flex items-center gap-1"><Brain className="w-3 h-3" /> AI Analysis</p>
                    <p className="text-sm text-muted-foreground">Strong market need. Consider differentiation from existing tools like Geekbot...</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="glass rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                    <p className="text-2xl font-display font-bold gradient-text">78%</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                    <p className="text-sm font-semibold text-warning">Medium</p>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Market Need</p>
                    <div className="w-full h-1.5 rounded-full bg-secondary mt-1">
                      <div className="h-full w-4/5 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats ribbon */}
      <section className="relative z-10 py-16 border-y border-border/50">
        <motion.div
          {...staggerContainer}
          className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((s, i) => (
            <motion.div key={i} {...staggerChild} className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-4">
              <Zap className="w-3 h-3 text-primary" /> Features
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
              Everything you need to <span className="gradient-text">validate</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Powered by advanced AI models trained on startup methodologies from Y Combinator, Lean Startup, and more.
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                {...staggerChild}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl glass hover-lift cursor-default relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-4">
              <Rocket className="w-3 h-3 text-primary" /> Process
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
              Three steps to <span className="gradient-text">clarity</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              A structured journey from raw idea to validated concept.
            </p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="glass rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden group hover-lift"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500`} />
                <div className="relative z-10 flex items-center gap-5 flex-shrink-0">
                  <span className="font-display text-4xl font-bold text-muted-foreground/20">{step.num}</span>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="relative z-10 py-24 px-6 border-y border-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
              Your validation <span className="gradient-text">report includes</span>
            </h2>
          </motion.div>

          <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Problem Statement — crystal clear articulation",
              "Ideal Customer Profile — who exactly needs this",
              "MVP Definition — what to build first",
              "Validation Plan — concrete next steps",
              "Key Risks — what could go wrong",
              "Scoring Dashboard — quantified analysis",
              "Market Need Assessment — is there real demand",
              "Execution Feasibility — can you actually build this",
            ].map((item, i) => (
              <motion.div
                key={i}
                {...staggerChild}
                className="flex items-start gap-3 p-4 rounded-xl glass hover-lift"
              >
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-foreground text-sm leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
              Loved by <span className="gradient-text">founders</span>
            </h2>
          </motion.div>

          <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                {...staggerChild}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-7 flex flex-col hover-lift"
              >
                <p className="text-foreground text-sm leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                <div>
                  <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-28 px-6">
        <motion.div
          {...fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass-strong rounded-3xl p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
                Ready to <span className="gradient-text">validate</span>?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Stop guessing. Start validating. Your next great startup begins with clarity.
              </p>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={goAuth}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-border transition-all hover:brightness-110"
              >
                Start Building Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display text-sm font-semibold">
              <span className="gradient-text">BuildLoop</span> AI
            </span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 BuildLoop AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
