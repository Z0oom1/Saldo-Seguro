import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FinancialProvider } from "./contexts/FinancialContext";
import { Spinner } from "@/components/ui/spinner";

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
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/add" component={AddTransaction} />
        <Route path="/history" component={History} />
        <Route path="/analysis" component={Analysis} />
        <Route path="/goals" component={Goals} />
        <Route path="/budget" component={Budget} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/edit-transaction" component={EditTransaction} />
        <Route path="/settings" component={Settings} />
        <Route path="/404" component={NotFound} />
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
