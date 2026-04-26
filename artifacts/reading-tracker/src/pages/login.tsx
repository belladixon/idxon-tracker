import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16">
      <Card className="border-border/50 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Welcome back</CardTitle>
          <CardDescription>Enter your name to open your journal</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  Your name
                </label>
                <Input
                  id="username"
                  placeholder="e.g. Alex"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background"
                  autoFocus
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full rounded-full" disabled={!username.trim()}>
              Open Journal
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
