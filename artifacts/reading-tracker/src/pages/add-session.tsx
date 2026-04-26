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
import { ArrowLeft, Loader2 } from "lucide-react";

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
      durationMinutes: 15,
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
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button 
        variant="ghost" 
        className="text-muted-foreground -ml-4" 
        onClick={() => setLocation("/dashboard")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Log a Session</CardTitle>
          <CardDescription>Record your reading time. Every minute counts.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-background" />
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
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} className="bg-background" />
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
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What did you read? Thoughts, feelings..." 
                        className="resize-none min-h-[100px] bg-background" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full rounded-full" 
                disabled={createSession.isPending}
              >
                {createSession.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
