import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, User, LineChart, History, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/history", label: "History", icon: History },
    { 
      href: "/insights", 
      label: "Insights", 
      icon: LineChart,
      subtitle: "trends & streaks"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group" data-testid="link-home">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold tracking-tight text-lg text-foreground hidden sm:inline-block">Reading Tracker</span>
          </Link>
          
          {isAuthenticated ? (
            <nav className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className={`flex flex-col justify-center px-3 py-1.5 rounded-lg text-sm transition-all border-l-2 ${isActive ? 'bg-primary/5 text-primary border-primary font-medium' : 'text-muted-foreground border-transparent hover:bg-muted hover:text-foreground font-normal'}`}
                      data-testid={`link-nav-${item.label.toLowerCase()}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.subtitle && (
                        <span className="text-[10px] opacity-70 ml-6 -mt-1">{item.subtitle}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
              
              <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>
              
              <Link href="/add-session" className="hidden sm:flex">
                <Button size="sm" className="rounded-full shadow-sm gap-1.5" data-testid="button-nav-add">
                  <Plus className="w-4 h-4" />
                  <span>Add Session</span>
                </Button>
              </Link>
              
              <Link href="/profile" className={`p-2 rounded-full transition-all border ${location === '/profile' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-transparent hover:bg-muted'}`} data-testid="link-nav-profile">
                <User className="w-5 h-5" />
              </Link>
            </nav>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-login">Log in</Link>
            </div>
          )}
        </div>
      </header>

      {isAuthenticated && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm z-50 pb-safe">
          <div className="container px-2 py-2 flex items-center justify-between">
            {navItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-lg text-xs transition-colors ${isActive ? 'text-primary font-medium' : 'text-muted-foreground font-normal'}`} data-testid={`link-mobilenav-${item.label.toLowerCase()}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/10' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <Link href="/add-session" className="flex flex-col items-center gap-1 p-2 flex-1 text-xs text-primary font-medium" data-testid="link-mobilenav-add">
              <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-sm -mt-6 border-4 border-card">
                <Plus className="w-5 h-5" />
              </div>
              <span className="-mt-1">Add</span>
            </Link>
            
            <Link href="/insights" className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-lg text-xs transition-colors ${location === '/insights' ? 'text-primary font-medium' : 'text-muted-foreground font-normal'}`} data-testid="link-mobilenav-insights">
              <LineChart className={`w-5 h-5 ${location === '/insights' ? 'fill-primary/10' : ''}`} />
              <span>Insights</span>
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 pb-24 sm:pb-8">
        {children}
      </main>
    </div>
  );
}
