import { useGetInsights, useGetWeeklyHistory } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Trophy, Clock, Library, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Insights() {
  const { data: insights, isLoading: isInsightsLoading } = useGetInsights();
  const { data: history, isLoading: isHistoryLoading } = useGetWeeklyHistory();

  const isLoading = isInsightsLoading || isHistoryLoading;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-serif tracking-tight">Your Insights</h1>
        <p className="text-muted-foreground mt-1">Understanding your reading habits over time.</p>
      </header>

      {isLoading ? (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
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
          <Card className="border-border/50">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      ) : (!insights || !history) ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6 text-center text-destructive">
            Failed to load insights. Please try again later.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border/50 shadow-sm md:col-span-2 bg-gradient-to-br from-card to-secondary/30">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
                <Flame className="w-4 h-4 text-orange-500 opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-serif">{insights.currentStreak}</div>
                  <div className="text-sm font-medium text-muted-foreground">days</div>
                </div>
                {insights.currentStreak > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">You're on a roll. Keep it up!</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Longest Streak</CardTitle>
                <Trophy className="w-4 h-4 text-yellow-500 opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-serif">{insights.longestStreak}</div>
                  <div className="text-sm font-medium text-muted-foreground">days</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Session</CardTitle>
                <Clock className="w-4 h-4 text-primary opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-serif">{Math.round(insights.averageDurationMinutes)}</div>
                  <div className="text-sm font-medium text-muted-foreground">min</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm sm:col-span-2">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">All-Time Time</CardTitle>
                <Activity className="w-4 h-4 text-primary opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-serif">{insights.totalMinutes}</div>
                  <div className="text-sm font-medium text-muted-foreground">minutes total</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm sm:col-span-2">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">All-Time Sessions</CardTitle>
                <Library className="w-4 h-4 text-primary opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-serif">{insights.totalSessions}</div>
                  <div className="text-sm font-medium text-muted-foreground">sessions total</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Past 8 Weeks</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...history].reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="weekLabel" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'hsl(var(--secondary))' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                        formatter={(value: number) => [`${value} min`, 'Reading Time']}
                      />
                      <Bar 
                        dataKey="totalMinutes" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Not enough data to display chart.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
