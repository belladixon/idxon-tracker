import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListSessions, 
  useDeleteSession, 
  useUpdateSession,
  getListSessionsQueryKey,
  getGetWeeklySummaryQueryKey,
  getGetWeeklyHistoryQueryKey,
  getGetInsightsQueryKey
} from "@workspace/api-client-react";
import type { Session } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Trash2, Clock, Calendar, Check, X, BookOpen } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function History() {
  const { data: sessions, isLoading, isError } = useListSessions();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-serif tracking-tight">Your History</h1>
        <p className="text-muted-foreground mt-1">A look back at the moments you've dedicated to reading.</p>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6 text-center text-destructive">
            Failed to load your history. Please try again later.
          </CardContent>
        </Card>
      ) : !sessions || sessions.length === 0 ? (
        <Card className="border-border/50 bg-card/50 text-center py-12">
          <CardContent className="space-y-4 pt-6">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-lg">No sessions yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Your history is waiting to be written. Log your first reading session to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <SessionRow key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionRow({ session }: { session: Session }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState(session.date);
  const [editDuration, setEditDuration] = useState(session.durationMinutes.toString());
  const [editNotes, setEditNotes] = useState(session.notes || "");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetWeeklySummaryQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetWeeklyHistoryQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetInsightsQueryKey() });
  };

  const handleSave = () => {
    const duration = parseInt(editDuration, 10);
    if (isNaN(duration) || duration < 1) {
      toast({ title: "Invalid duration", variant: "destructive" });
      return;
    }
    
    updateSession.mutate({
      id: session.id,
      data: {
        date: editDate,
        durationMinutes: duration,
        notes: editNotes || null
      }
    }, {
      onSuccess: () => {
        toast({ title: "Session updated" });
        setIsEditing(false);
        invalidateQueries();
      },
      onError: () => {
        toast({ title: "Failed to update", variant: "destructive" });
      }
    });
  };

  const handleDelete = () => {
    deleteSession.mutate({ id: session.id }, {
      onSuccess: () => {
        toast({ title: "Session deleted" });
        invalidateQueries();
      },
      onError: () => {
        toast({ title: "Failed to delete", variant: "destructive" });
      }
    });
  };

  if (isEditing) {
    return (
      <Card className="border-primary bg-primary/5">
        <CardContent className="p-4 sm:p-6 space-y-4 pt-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Date</label>
              <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Duration (minutes)</label>
              <Input type="number" min="1" value={editDuration} onChange={e => setEditDuration(e.target.value)} className="bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Notes</label>
            <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} className="bg-background resize-none min-h-[80px]" />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={updateSession.isPending}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={updateSession.isPending}>
              <Check className="w-4 h-4 mr-1" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm hover-elevate transition-all group">
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-start">
        <div className="bg-secondary text-secondary-foreground rounded-xl p-3 flex flex-col items-center justify-center shrink-0 w-16 h-16 sm:w-20 sm:h-20">
          <span className="text-lg sm:text-2xl font-serif font-medium leading-none">{session.durationMinutes}</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-medium opacity-80 mt-1">min</span>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Calendar className="w-4 h-4" />
            {format(parseISO(session.date), 'MMM d, yyyy')}
          </div>
          {session.notes && (
            <p className="text-foreground text-sm sm:text-base leading-relaxed">
              {session.notes}
            </p>
          )}
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete session?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this reading session from your history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
