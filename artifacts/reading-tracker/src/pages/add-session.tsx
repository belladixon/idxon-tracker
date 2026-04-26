import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useCreateSession, 
  getListSessionsQueryKey, 
  getGetWeeklySummaryQueryKey,
  getGetWeeklyHistoryQueryKey,
  getGetInsightsQueryKey 
} from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

const sessionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date in YYYY-MM-DD format"),
  durationMinutes: z.coerce.number().int().min(1, "Must be at least 1 minute"),
  notes: z.string().optional()
});

type SessionFormValues = z.infer<typeof sessionSchema>;

export default function AddSession() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      durationMinutes: undefined as any,
      notes: ""
    }
  });

  const createSession = useCreateSession();

  const onSubmit = (values: SessionFormValues) => {
    createSession.mutate(
      { data: { ...values, notes: values.notes || null } },
      {
        onSuccess: () => {
          toast({
            title: "Session saved",
            description: "Your reading session has been recorded.",
          });
          
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetWeeklySummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetWeeklyHistoryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetInsightsQueryKey() });
          
          setLocation("/dashboard");
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to save session. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button 
        variant="ghost" 
        className="text-muted-foreground -ml-4 rounded-full px-4 hover:bg-secondary/50" 
        onClick={() => setLocation("/dashboard")}
        data-testid="button-back-dashboard"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-secondary/30 rounded-full mb-2">
          <Sparkles className="w-5 h-5 text-secondary-foreground" />
        </div>
        <p className="text-lg font-serif text-foreground/80 italic">
          "Every session counts, no matter how short."
        </p>
      </div>

      <Card className="border-border/50 shadow-md rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-card pt-8 pb-6 border-b border-border/30">
          <CardTitle className="text-3xl font-serif text-center">Log a Session</CardTitle>
          <CardDescription className="text-center text-base">Record your reading time.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 pt-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground uppercase tracking-wide text-xs font-semibold">Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-background h-12 rounded-xl" data-testid="input-session-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground uppercase tracking-wide text-xs font-semibold">Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="e.g. 15, 30, 60" {...field} className="bg-background h-12 rounded-xl text-lg" data-testid="input-session-duration" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground uppercase tracking-wide text-xs font-semibold">Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What did you read? Thoughts, feelings..." 
                        className="resize-none min-h-[120px] bg-background rounded-xl p-4 text-base" 
                        {...field}
                        data-testid="input-session-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="pb-8 pt-4 px-6">
              <Button 
                type="submit" 
                size="lg"
                className="w-full rounded-full h-14 text-lg font-medium shadow-sm hover:shadow-md transition-shadow" 
                disabled={createSession.isPending}
                data-testid="button-save-session"
              >
                {createSession.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Session"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
