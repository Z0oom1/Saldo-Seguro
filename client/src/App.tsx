import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FinancialProvider } from "./contexts/FinancialContext";
import { Spinner } from "@/components/ui/spinner";
import { storage } from "@/lib/storage";

// Lazy loading pages
const Home = lazy(() => import("./pages/Home"));
const AddTransaction = lazy(() => import("./pages/AddTransaction"));
const History = lazy(() => import("./pages/History"));
const Analysis = lazy(() => import("./pages/Analysis"));
const Settings = lazy(() => import("./pages/Settings"));
const Goals = lazy(() => import("./pages/Goals"));
const Budget = lazy(() => import("./pages/Budget"));
const Alerts = lazy(() => import("./pages/Alerts"));
const EditTransaction = lazy(() => import("./pages/EditTransaction"));
const Monthly = lazy(() => import("./pages/Monthly"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const user = storage.getCurrentUser();
    setIsAuthenticated(!!user);
    
    if (!user && location !== "/login") {
      setLocation("/login");
    }
  }, [location, setLocation]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <Switch>
        <Route path="/login" component={Login} />
        {!isAuthenticated ? (
          <Route component={() => {
            setLocation("/login");
            return null;
          }} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/add" component={AddTransaction} />
            <Route path="/history" component={History} />
            <Route path="/analysis" component={Analysis} />
            <Route path="/goals" component={Goals} />
            <Route path="/budget" component={Budget} />
            <Route path="/alerts" component={Alerts} />
            <Route path="/edit-transaction" component={EditTransaction} />
            <Route path="/monthly" component={Monthly} />
            <Route path="/settings" component={Settings} />
            <Route path="/404" component={NotFound} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <FinancialProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </FinancialProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
