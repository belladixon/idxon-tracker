import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, LogOut } from "lucide-react";

export default function Profile() {
  const { username, logout } = useAuth();

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
      <Card className="border-border/50 shadow-sm text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto bg-secondary w-20 h-20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">{username}</CardTitle>
            <CardDescription className="mt-2">Your reading journal</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 text-sm text-muted-foreground pb-8">
          This is a personal space for you to track your reading habits. 
          Your consistency is what matters most.
        </CardContent>
        <CardFooter className="bg-muted/50 border-t justify-center py-6">
          <Button variant="outline" onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full px-6">
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
