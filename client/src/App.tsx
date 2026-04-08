import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FinancialProvider } from "./contexts/FinancialContext";
import Home from "./pages/Home";
import AddTransaction from "./pages/AddTransaction";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import Settings from "./pages/Settings";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/add" component={AddTransaction} />
      <Route path="/history" component={History} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
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
