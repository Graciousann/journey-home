import { useParams, Link } from "wouter";
import {
  useGetJourney,
  useGetJourneyProgress,
  useListJourneySteps,
  getGetJourneyProgressQueryKey,
  getListJourneyStepsQueryKey,
  useUpdateJourneyStep,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, MapPin, Clock, ArrowRight, Home, Compass, ChevronLeft, ArrowLeftRight, Flag, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JourneyDashboard() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);
  const queryClient = useQueryClient();

  const { data: journey, isLoading: loadingJourney } = useGetJourney(id, {
    query: { enabled: !!id, queryKey: ["getJourney", id] },
  });
  const { data: progress, isLoading: loadingProgress } = useGetJourneyProgress(id, {
    query: { enabled: !!id, queryKey: getGetJourneyProgressQueryKey(id) },
  });
  const { data: steps, isLoading: loadingSteps } = useListJourneySteps(id, {
    query: { enabled: !!id, queryKey: getListJourneyStepsQueryKey(id) },
  });

  const updateStep = useUpdateJourneyStep();

  const handleMarkComplete = (stepNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    updateStep.mutate(
      { id, stepNumber, data: { status: "completed" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListJourneyStepsQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getGetJourneyProgressQueryKey(id) });
        },
      }
    );
  };

  if (loadingJourney || loadingProgress || loadingSteps) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="flex gap-8">
          <Skeleton className="w-12 h-96 rounded-full" />
          <div className="flex-1 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">Journey not found.</p>
        <Link href="/"><Button variant="outline" className="mt-4">Back to Map</Button></Link>
      </div>
    );
  }

  const pct = progress?.percentComplete ?? 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl opacity-0 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
          <ChevronLeft className="h-4 w-4" />
          All Routes
        </Link>
        <Link
          href={`/journey/${id}/documents`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/8 hover:bg-primary/15 border border-primary/20 px-4 py-2 rounded-full transition-all"
        >
          <FolderOpen className="h-4 w-4" />
          Document Checklist
        </Link>
      </div>

      <div className="mb-12 bg-card rounded-3xl p-8 border border-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              {journey.type === "buyer" ? (
                <Compass className="h-7 w-7" />
              ) : journey.type === "seller" ? (
                <Home className="h-7 w-7" />
              ) : (
                <ArrowLeftRight className="h-7 w-7" />
              )}
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                {journey.userName}'s {journey.type === "buyer" ? "Buying" : journey.type === "seller" ? "Selling" : "Buy & Sell"} Route
              </h1>
              <p className="text-muted-foreground font-medium mt-1">
                Mile {progress?.completedSteps ?? 0} of {progress?.totalSteps ?? 0}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-xl font-bold border border-accent/20">
              <Flag className="h-5 w-5 text-accent" />
              {pct}% Traveled
            </div>
          </div>
        </div>

        {/* Highway Progress Bar */}
        <div className="relative pt-4">
          <div className="h-6 bg-muted rounded-full overflow-hidden relative border-y border-border">
            {/* Dashed line for empty road */}
            <div className="absolute inset-0 border-t-2 border-dashed border-border/50 top-1/2 -translate-y-1/2 w-full z-0" />
            
            {/* Solid filled road */}
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000 ease-out z-10 flex items-center overflow-hidden"
              style={{ width: `${pct}%` }}
            >
              {/* Animated dash on the filled road */}
              <div className="w-full h-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSI0Ij48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iNCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIi8+PC9zdmc+')] animate-[dash-flow_1s_linear_infinite]" />
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium uppercase tracking-wider">
            <span>Start</span>
            <span>Destination</span>
          </div>
        </div>
      </div>

      {pct === 100 && (
        <div className="mb-12 p-8 rounded-3xl bg-accent/10 border border-accent/20 text-center animate-fade-in-up">
          <div className="h-20 w-20 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30">
            <Flag className="h-10 w-10" />
          </div>
          <h2 className="font-serif text-3xl text-foreground mb-2">You've Arrived!</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Congratulations, {journey.userName}! You've successfully navigated every milestone of your journey.
          </p>
        </div>
      )}

      {/* Vertical Road Map */}
      <div className="relative pl-6 md:pl-12 py-4">
        {/* The Vertical Road Line */}
        <div className="absolute left-[39px] md:left-[71px] top-8 bottom-8 w-2 bg-muted rounded-full">
          {/* Filled portion of the road */}
          <div 
            className="absolute top-0 left-0 right-0 bg-primary rounded-full transition-all duration-1000"
            style={{ height: `${(progress?.completedSteps || 0) / (progress?.totalSteps || 1) * 100}%` }}
          />
        </div>

        <div className="space-y-12">
          {steps?.map((step, idx) => {
            const isCurrent = step.stepNumber === journey.currentStep;
            const isCompleted = step.status === "completed";
            
            return (
              <div key={step.id} className={`relative flex items-start gap-8 opacity-0 animate-fade-in-up stagger-${(idx % 5) + 1}`}>
                {/* Waypoint Dot */}
                <div className="relative z-10 flex-shrink-0 mt-4">
                  {isCompleted ? (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-md ring-4 ring-background transition-all">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  ) : isCurrent ? (
                    <div className="relative h-8 w-8">
                      {/* Pulsing glow */}
                      <div className="absolute inset-0 rounded-full bg-accent animate-pulse-soft" />
                      <div className="absolute inset-0 rounded-full bg-accent flex items-center justify-center shadow-lg ring-4 ring-background">
                        <MapPin className="h-4 w-4 text-accent-foreground" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-background border-4 border-muted flex items-center justify-center ring-4 ring-background transition-all">
                      <div className="h-2 w-2 rounded-full bg-muted" />
                    </div>
                  )}
                </div>

                {/* Step Card */}
                <div className="flex-1 min-w-0">
                  {isCurrent && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider shadow-sm">
                        <MapPin className="h-3 w-3" /> You are here
                      </span>
                    </div>
                  )}
                  
                  <Link href={`/journey/${id}/step/${step.stepNumber}`}>
                    <div
                      className={`group relative rounded-2xl border p-6 transition-all duration-300 cursor-pointer block
                        ${isCurrent
                          ? "border-accent/30 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] hover:-translate-y-1 ring-1 ring-accent/10"
                          : isCompleted
                          ? "border-border bg-card hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
                          : "border-border bg-card/50 hover:bg-card hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                              Stop {step.stepNumber}
                            </span>
                          </div>
                          <h3 className={`font-serif text-xl md:text-2xl font-medium ${isCompleted ? "text-foreground" : "text-foreground"}`}>
                            {step.title}
                          </h3>
                          {isCompleted && step.completedAt && (
                            <p className="text-sm text-primary font-medium mt-2 flex items-center gap-1.5">
                              <Check className="h-4 w-4" />
                              Reached {new Date(step.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                          {!isCompleted && isCurrent && (
                            <button
                              onClick={(e) => handleMarkComplete(step.stepNumber, e)}
                              className="inline-flex items-center gap-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl px-5 py-2.5 hover:bg-primary/90 transition-all shadow-sm hover:shadow active:scale-95 z-20 relative"
                            >
                              <Check className="h-4 w-4" />
                              Mark Reached
                            </button>
                          )}
                          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
