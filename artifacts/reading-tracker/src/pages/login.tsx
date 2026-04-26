import { useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function Login() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();

  const doLogin = () => {
    const value = inputRef.current?.value ?? "";
    const trimmed = value.trim();
    if (trimmed) {
      login(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      doLogin();
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16">
      <Card className="border-border/50 shadow-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <BookOpen className="w-6 h-6 text-primary" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-serif">Welcome back</CardTitle>
          <CardDescription>Enter your name to open your reading journal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Your name
              </label>
              <Input
                id="username"
                ref={inputRef}
                data-testid="input-username"
                placeholder="e.g. Alex"
                defaultValue=""
                onKeyDown={handleKeyDown}
                className="bg-background"
                autoComplete="name"
                aria-required="true"
                aria-describedby="username-hint"
              />
              <p id="username-hint" className="text-xs text-muted-foreground">
                This is only stored locally in your browser.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            data-testid="button-open-journal"
            className="w-full rounded-full"
            onClick={doLogin}
          >
            Open Journal
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
