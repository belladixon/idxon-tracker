import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetWeeklySummary } from "@workspace/api-client-react";
import { Plus, BookOpen, Clock, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { username } = useAuth();
  const { data: summary, isLoading, isError } = useGetWeeklySummary();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Hello, {username}</h1>
          <p className="text-muted-foreground mt-1">Here is your reading summary for this week.</p>
        </div>
        <Link href="/add-session">
          <Button className="rounded-full shadow-sm hover:shadow-md transition-shadow gap-2">
            <Plus className="w-4 h-4" />
            Add Session
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-border/50">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
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
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{summary.weekLabel}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="border-border/50 shadow-sm hover-elevate transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sessions</CardTitle>
                <BookOpen className="w-4 h-4 text-primary opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif">{summary.totalSessions}</div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-sm hover-elevate transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Time Read</CardTitle>
                <Clock className="w-4 h-4 text-primary opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif">
                  {summary.totalMinutes} <span className="text-lg text-muted-foreground font-sans">min</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover-elevate transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Days Read</CardTitle>
                <CalendarDays className="w-4 h-4 text-primary opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif">{summary.daysRead}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
