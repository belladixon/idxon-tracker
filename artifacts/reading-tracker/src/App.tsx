import { Switch, Route } from "wouter";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import AddSession from "@/pages/add-session";
import History from "@/pages/history";
import Insights from "@/pages/insights";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/add-session" component={() => <ProtectedRoute component={AddSession} />} />
        <Route path="/history" component={() => <ProtectedRoute component={History} />} />
        <Route path="/insights" component={() => <ProtectedRoute component={Insights} />} />
        <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}
