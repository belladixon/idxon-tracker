import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, User, LineChart, History, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_TITLES: Record<string, string> = {
  "/": "Reading Tracker — Read more, stress less",
  "/login": "Log In — Reading Tracker",
  "/dashboard": "Dashboard — Reading Tracker",
  "/add-session": "Log a Session — Reading Tracker",
  "/history": "Your History — Reading Tracker",
  "/insights": "Your Insights — Reading Tracker",
  "/profile": "Profile — Reading Tracker",
};

export function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    const title = PAGE_TITLES[location] ?? "Reading Tracker";
    document.title = title;
  }, [location]);

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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header className="border-b bg-card sticky top-0 z-10" role="banner">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 group"
            data-testid="link-home"
            aria-label="Reading Tracker — go to home"
          >
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors" aria-hidden="true">
              <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <span className="font-semibold tracking-tight text-lg text-foreground hidden sm:inline-block">Reading Tracker</span>
          </Link>

          {isAuthenticated ? (
            <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main navigation">
              <div className="hidden sm:flex items-center gap-1" role="list">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="listitem"
                      className={`flex flex-col justify-center px-3 py-1.5 rounded-lg text-sm transition-all border-l-2 ${isActive ? 'bg-primary/5 text-primary border-primary font-medium' : 'text-muted-foreground border-transparent hover:bg-muted hover:text-foreground font-normal'}`}
                      data-testid={`link-nav-${item.label.toLowerCase()}`}
                      aria-label={item.subtitle ? `${item.label} — ${item.subtitle}` : item.label}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span>{item.label}</span>
                      </div>
                      {item.subtitle && (
                        <span className="text-[10px] opacity-70 ml-6 -mt-1" aria-hidden="true">{item.subtitle}</span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="w-px h-6 bg-border mx-1 hidden sm:block" aria-hidden="true"></div>

              <Link href="/add-session" className="hidden sm:flex">
                <Button
                  size="sm"
                  className="rounded-full shadow-sm gap-1.5"
                  data-testid="button-nav-add"
                  aria-label="Add a reading session"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Session</span>
                </Button>
              </Link>

              <Link
                href="/profile"
                className={`p-2 rounded-full transition-all border ${location === '/profile' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground border-transparent hover:bg-muted'}`}
                data-testid="link-nav-profile"
                aria-label="View your profile"
                aria-current={location === '/profile' ? "page" : undefined}
              >
                <User className="w-5 h-5" aria-hidden="true" />
              </Link>
            </nav>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-nav-login"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </header>

      {isAuthenticated && (
        <nav
          className="sm:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm z-50 pb-safe"
          aria-label="Mobile navigation"
        >
          <div className="container px-2 py-2 flex items-center justify-between">
            {navItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-lg text-xs transition-colors ${isActive ? 'text-primary font-medium' : 'text-muted-foreground font-normal'}`}
                  data-testid={`link-mobilenav-${item.label.toLowerCase()}`}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/10' : ''}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="/add-session"
              className="flex flex-col items-center gap-1 p-2 flex-1 text-xs text-primary font-medium"
              data-testid="link-mobilenav-add"
              aria-label="Add a reading session"
              aria-current={location === '/add-session' ? "page" : undefined}
            >
              <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-sm -mt-6 border-4 border-card" aria-hidden="true">
                <Plus className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="-mt-1">Add</span>
            </Link>

            <Link
              href="/insights"
              className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-lg text-xs transition-colors ${location === '/insights' ? 'text-primary font-medium' : 'text-muted-foreground font-normal'}`}
              data-testid="link-mobilenav-insights"
              aria-label="Insights — trends and streaks"
              aria-current={location === '/insights' ? "page" : undefined}
            >
              <LineChart className={`w-5 h-5 ${location === '/insights' ? 'fill-primary/10' : ''}`} aria-hidden="true" />
              <span>Insights</span>
            </Link>
          </div>
        </nav>
      )}

      <main id="main-content" className="flex-1 container max-w-4xl mx-auto px-4 py-8 pb-24 sm:pb-8" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
