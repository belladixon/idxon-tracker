import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetWeeklySummary } from "@workspace/api-client-react";
import { Plus, BookOpen, Clock, CalendarDays, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { username } = useAuth();
  const { data: summary, isLoading, isError } = useGetWeeklySummary();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif tracking-tight text-foreground">Hello, {username}</h1>
          <p className="text-lg text-muted-foreground">Here is your reading summary for this week.</p>
        </div>
        <Link href="/add-session" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto rounded-full shadow-md hover:shadow-lg transition-all gap-2 h-14 px-8 text-base" data-testid="button-dashboard-add">
            <Plus className="w-5 h-5" />
            Add Session
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="grid sm:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-border/50 h-32">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError || !summary ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6 text-center text-destructive">
            Failed to load your weekly summary. Please try again later.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{summary.weekLabel}</h2>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="border-border/50 shadow-sm hover-elevate transition-all overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
                <CardTitle className="text-sm font-medium text-foreground/70 uppercase tracking-wide">Sessions</CardTitle>
                <BookOpen className="w-5 h-5 text-primary opacity-80 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent className="relative z-10 pt-4 pb-8">
                <div className="text-5xl font-serif text-primary/90">{summary.totalSessions}</div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-sm hover-elevate transition-all overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-transparent opacity-50"></div>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
                <CardTitle className="text-sm font-medium text-foreground/70 uppercase tracking-wide">Time Read</CardTitle>
                <Clock className="w-5 h-5 text-secondary-foreground opacity-80 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent className="relative z-10 pt-4 pb-8">
                <div className="text-5xl font-serif text-secondary-foreground/90 flex items-baseline gap-2">
                  {summary.totalMinutes} <span className="text-xl font-sans font-medium opacity-60">min</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover-elevate transition-all overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-transparent opacity-50"></div>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
                <CardTitle className="text-sm font-medium text-foreground/70 uppercase tracking-wide">Days Read</CardTitle>
                <CalendarDays className="w-5 h-5 text-accent-foreground opacity-80 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent className="relative z-10 pt-4 pb-8">
                <div className="text-5xl font-serif text-accent-foreground/90">{summary.daysRead}</div>
              </CardContent>
            </Card>
          </div>

          {summary.totalSessions > 0 && (
            <div className="pt-4 text-center sm:text-left text-muted-foreground italic font-serif text-lg">
              You've logged {summary.totalSessions} session{summary.totalSessions === 1 ? '' : 's'} this week. That's something to be proud of.
            </div>
          )}
          
          <div className="pt-8 flex justify-center sm:justify-start">
            <Link href="/insights" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors gap-1 group" data-testid="link-view-trends">
              View your trends 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
