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
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Your History</h1>
          <p className="text-muted-foreground mt-1">A look back at the moments you've dedicated to reading.</p>
        </div>
        {sessions && sessions.length > 0 && (
          <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
            {sessions.length} session{sessions.length === 1 ? '' : 's'} logged
          </div>
        )}
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
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
        <Card className="border-border/50 bg-card/50 text-center py-16 rounded-3xl">
          <CardContent className="space-y-5 pt-6">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl">No sessions yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
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
      <Card className="border-primary bg-primary/5 rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-6 space-y-4 pt-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</label>
              <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="bg-background" data-testid={`input-edit-date-${session.id}`} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration (minutes)</label>
              <Input type="number" min="1" value={editDuration} onChange={e => setEditDuration(e.target.value)} className="bg-background" data-testid={`input-edit-duration-${session.id}`} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Notes</label>
            <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} className="bg-background resize-none min-h-[80px]" data-testid={`input-edit-notes-${session.id}`} />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={updateSession.isPending} data-testid={`button-cancel-edit-${session.id}`}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={updateSession.isPending} className="rounded-full" data-testid={`button-save-edit-${session.id}`}>
              <Check className="w-4 h-4 mr-1" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm hover-elevate transition-all group rounded-2xl">
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-start">
        <div className="bg-secondary text-secondary-foreground rounded-2xl p-3 flex flex-col items-center justify-center shrink-0 w-20 h-20 shadow-sm border border-secondary-foreground/10">
          <span className="text-2xl sm:text-3xl font-serif font-medium leading-none">{session.durationMinutes}</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-medium opacity-70 mt-1">min</span>
        </div>
        
        <div className="flex-1 space-y-3 py-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium uppercase tracking-wide">
            <Calendar className="w-4 h-4 text-primary/70" />
            {format(parseISO(session.date), 'MMM d, yyyy')}
          </div>
          {session.notes && (
            <p className="text-foreground text-base leading-relaxed font-light">
              {session.notes}
            </p>
          )}
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 shrink-0 pt-2 sm:pt-0">
          <Button variant="secondary" size="sm" className="h-9 px-3 text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary" onClick={() => setIsEditing(true)} data-testid={`button-edit-session-${session.id}`}>
            <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10" data-testid={`button-delete-session-${session.id}`}>
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-serif text-2xl">Delete session?</AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  This will permanently remove this reading session from your history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid={`button-confirm-delete-${session.id}`}>
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
