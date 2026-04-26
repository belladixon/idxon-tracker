import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Feather } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col gap-16 py-12 md:py-24">
      <section className="text-center max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-2xl mb-4">
          <BookOpen className="w-8 h-8 text-secondary-foreground" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-foreground tracking-tight">
          Read more,<br />stress less.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          A personal, low-pressure space for students who read in small stolen moments throughout their day. No goals, no judgments—just a quiet celebration of your consistency.
        </p>
        <div className="pt-8">
          <Link href={isAuthenticated ? "/dashboard" : "/login"} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full shadow-sm hover:shadow-md">
            {isAuthenticated ? "Go to Dashboard" : "Start your journal"}
          </Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 pt-16 border-t border-border/50">
        <div className="space-y-3 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <Feather className="w-6 h-6 text-primary" />
          <h3 className="font-medium text-lg">Low Pressure</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Log 5 minutes or 50. It all counts. We focus on consistency over quantity.</p>
        </div>
        <div className="space-y-3 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <Sparkles className="w-6 h-6 text-primary" />
          <h3 className="font-medium text-lg">Visual Progress</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Watch your scattered reading moments turn into a satisfying visual history.</p>
        </div>
        <div className="space-y-3 bg-card p-6 rounded-3xl border border-border/50 shadow-sm sm:col-span-2 md:col-span-1">
          <BookOpen className="w-6 h-6 text-primary" />
          <h3 className="font-medium text-lg">Your Private Space</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Not social, not a competition. Just a quiet reflection of your effort.</p>
        </div>
      </section>
    </div>
  );
}
