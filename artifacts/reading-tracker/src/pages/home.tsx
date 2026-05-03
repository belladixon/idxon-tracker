import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Feather, ChevronDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 py-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl mx-auto space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center justify-center p-4 bg-secondary/50 rounded-3xl mb-4 backdrop-blur-sm border border-secondary/20">
            <BookOpen className="w-10 h-10 text-primary" />
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground tracking-tight leading-[1.1]">
            Read more,<br />
            <span className="text-primary/90 italic">stress less.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
            A personal, low-pressure space for students who read in small stolen moments throughout their day. No goals, no judgments—just a quiet celebration of your consistency.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] transition-all gap-2" data-testid="button-hero-cta">
                {isAuthenticated ? "Go to Dashboard" : "Start your journal"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground/50" />
        </motion.div>
      </section>

      {/* How it Works Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-4 bg-secondary/10"
      >
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif">How it works</h2>
            <p className="text-muted-foreground text-lg">A simple rhythm to build a lasting habit.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { num: "01", title: "Log a session", desc: "Open the app and quickly record the minutes you spent reading." },
              { num: "02", title: "See your week", desc: "Watch your small moments add up into a satisfying weekly total." },
              { num: "03", title: "Notice your patterns", desc: "Discover when you read best and gently build your streaks." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-serif italic mb-2">
                  {step.num}
                </div>
                <h3 className="text-xl font-medium">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-4"
      >
        <div className="max-w-3xl mx-auto space-y-8 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">The Philosophy</h2>
          <div className="space-y-6 text-lg text-foreground/80 leading-relaxed font-light">
            <p>
              Reading Tracker was built for the overwhelmed college student. Between required readings, assignments, and life, reading for pleasure often becomes just another stressful task on an endless to-do list.
            </p>
            <p>
              We believe that every minute counts. Reading for 10 minutes while waiting for class is a victory. Skimming a chapter on the bus is a win. This app is designed to capture those fragmented moments and show you that they matter.
            </p>
            <p>
              There are no punishing goals here. No notifications telling you that you're falling behind. Just a gentle, warm space to reflect on the time you've carved out for yourself. Consistency over quantity, always.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-4 bg-primary/5"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif">Designed for peace of mind</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 bg-card p-8 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Feather className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium text-xl">Low Pressure</h3>
              <p className="text-muted-foreground leading-relaxed">Log 5 minutes or 50. It all counts. We focus on consistency over quantity.</p>
            </div>
            <div className="space-y-4 bg-card p-8 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-medium text-xl">Visual Progress</h3>
              <p className="text-muted-foreground leading-relaxed">Watch your scattered reading moments turn into a satisfying visual history.</p>
            </div>
            <div className="space-y-4 bg-card p-8 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-shadow md:col-span-3 lg:col-span-1 lg:mt-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium text-xl">Your Private Space</h3>
              <p className="text-muted-foreground leading-relaxed">Not social, not a competition. Just a quiet reflection of your effort.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bottom CTA */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-32 px-4 text-center"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif">Ready to start?</h2>
          <p className="text-xl text-muted-foreground font-light mb-8">Begin your journey to stress-free reading today.</p>
          <Link href={isAuthenticated ? "/dashboard" : "/login"}>
            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-md hover:shadow-lg transition-all" data-testid="button-bottom-cta">
              {isAuthenticated ? "Go to your Dashboard" : "Create your account"}
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
