import { useGetInsights, useGetWeeklyHistory } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Trophy, Clock, Library, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Insights() {
  const { data: insights, isLoading: isInsightsLoading } = useGetInsights();
  const { data: history, isLoading: isHistoryLoading } = useGetWeeklyHistory();

  const isLoading = isInsightsLoading || isHistoryLoading;

  // Format the week label to be shorter, e.g. "Apr 21 – Apr 27" -> "Apr 21"
  const formattedHistory = history?.map(h => ({
    ...h,
    shortWeekLabel: h.weekLabel.split(' –')[0] || h.weekLabel
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif tracking-tight">Your Insights</h1>
        <p className="text-lg text-muted-foreground font-light">Here's a deeper look at your reading habits over time.</p>
      </header>

      {isLoading ? (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i} className={`border-border/50 ${i === 1 ? 'md:col-span-4 h-40' : 'sm:col-span-2'}`}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
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
            <Card className="border-border/50 shadow-md md:col-span-4 bg-[#fffaf0] dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-900/30 rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Flame className="w-48 h-48 text-orange-500" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-orange-700/80 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-4 pb-8">
                <div className="flex items-baseline gap-3">
                  <div className="text-6xl md:text-7xl font-serif text-orange-900 dark:text-orange-100">{insights.currentStreak}</div>
                  <div className="text-xl font-medium text-orange-700/60 dark:text-orange-300/60">days</div>
                </div>
                {insights.currentStreak > 0 ? (
                  <p className="text-lg text-orange-800/80 dark:text-orange-200/80 mt-4 font-serif italic">You're on a roll. Keep it up!</p>
                ) : (
                  <p className="text-lg text-orange-800/80 dark:text-orange-200/80 mt-4 font-serif italic">Today is a great day to start a streak.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm rounded-2xl">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Longest Streak</CardTitle>
                <Trophy className="w-4 h-4 text-yellow-500 opacity-80" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-serif">{insights.longestStreak}</div>
                  <div className="text-sm font-medium text-muted-foreground">days</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm rounded-2xl">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg. Session</CardTitle>
                <Clock className="w-4 h-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-serif">{Math.round(insights.averageDurationMinutes)}</div>
                  <div className="text-sm font-medium text-muted-foreground">min</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm sm:col-span-2 rounded-2xl">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All-Time Time</CardTitle>
                <Activity className="w-4 h-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-serif">{insights.totalMinutes}</div>
                  <div className="text-sm font-medium text-muted-foreground">minutes total</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm sm:col-span-2 rounded-2xl">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All-Time Sessions</CardTitle>
                <Library className="w-4 h-4 text-primary opacity-80" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-serif">{insights.totalSessions}</div>
                  <div className="text-sm font-medium text-muted-foreground">sessions total</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-card/50 border-b border-border/30 pb-6 pt-8 px-8">
              <CardTitle className="text-2xl font-serif">Past 8 Weeks</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {formattedHistory.length > 0 ? (
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...formattedHistory].reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="shortWeekLabel" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 13, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                        dy={15}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 13, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'hsl(var(--secondary)/0.5)' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '1rem',
                          boxShadow: 'var(--shadow-md)',
                          padding: '12px'
                        }}
                        labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '13px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, fontSize: '15px' }}
                        formatter={(value: number) => [`${value} min`, 'Reading Time']}
                        labelFormatter={(label, items) => items[0]?.payload?.weekLabel || label}
                      />
                      <Bar 
                        dataKey="totalMinutes" 
                        fill="hsl(var(--primary))" 
                        radius={[6, 6, 0, 0]} 
                        maxBarSize={48}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground text-lg font-light italic">
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
