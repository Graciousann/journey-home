import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

import { AppLayout } from "@/components/layout/AppLayout";
const Home = lazy(() => import("@/pages/Home"));
const JourneyDashboard = lazy(() => import("@/pages/JourneyDashboard"));
const JourneyStepDetail = lazy(() => import("@/pages/JourneyStepDetail"));
const Glossary = lazy(() => import("@/pages/Glossary"));
const Resources = lazy(() => import("@/pages/Resources"));
const Calculators = lazy(() => import("@/pages/Calculators"));
const LegalUpdates = lazy(() => import("@/pages/LegalUpdates"));
const Timelines = lazy(() => import("@/pages/Timelines"));
const DocumentChecklist = lazy(() => import("@/pages/DocumentChecklist"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center text-muted-foreground" role="status">Loading your roadmap…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/journey/:id" component={JourneyDashboard} />
        <Route path="/journey/:id/step/:stepNumber" component={JourneyStepDetail} />
        <Route path="/journey/:id/documents" component={DocumentChecklist} />
        <Route path="/calculators" component={Calculators} />
        <Route path="/timelines" component={Timelines} />
        <Route path="/legal" component={LegalUpdates} />
        <Route path="/glossary" component={Glossary} />
        <Route path="/resources" component={Resources} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
