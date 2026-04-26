import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, User, LineChart, History, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/history", label: "History", icon: History },
    { href: "/insights", label: "Insights", icon: LineChart },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b bg-card">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold tracking-tight text-lg text-foreground">Reading Tracker</span>
          </Link>
          
          {isAuthenticated ? (
            <nav className="flex items-center gap-1 sm:gap-4">
              <div className="hidden sm:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>
              <Link href="/profile" className={`p-2 rounded-full transition-colors ${location === '/profile' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                <User className="w-5 h-5" />
              </Link>
            </nav>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
            </div>
          )}
        </div>
      </header>

      {isAuthenticated && (
        <div className="sm:hidden border-b bg-card">
          <div className="container px-4 py-2 flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
