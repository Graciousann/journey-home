import { useParams, Link, useLocation } from "wouter";
import { useState } from "react";
import {
  useGetJourney, useGetJourneyProgress, useListJourneySteps, useUpdateJourneyStep,
  useUpdateJourney, useResetJourney, useDeleteJourney, exportJourneyData, getGetJourneyProgressQueryKey,
  getListJourneyStepsQueryKey, getListJourneysQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Check, MapPin, ArrowRight, Home, Compass, ChevronLeft, ArrowLeftRight, Flag,
  FolderOpen, CalendarDays, Download, Printer, RotateCcw, LockKeyhole, MessageCircle,
  Clock3, UserRound, Pencil, Trash2, Save,
} from "lucide-react";

const stepGuidance: Record<string, { action: string; owner: string; time: string }> = {
  "Pre-Approval": { action: "Gather income and asset documents, then compare at least two lenders.", owner: "You + lender", time: "1–7 business days" },
  "House Hunting": { action: "Define your non-negotiables and schedule focused home tours.", owner: "You + GraceAnn", time: "Varies by search" },
  "Making an Offer": { action: "Review comparable sales and decide price, contingencies, and timing.", owner: "You + GraceAnn", time: "Usually 24–72 hours" },
  "Home Inspection": { action: "Book the inspection and protect every contract deadline.", owner: "You + inspector", time: "Typically 7–10 days" },
  "Appraisal": { action: "Watch for the appraisal result and prepare for any value gap decision.", owner: "Lender + appraiser", time: "Usually 1–2 weeks" },
  "Final Loan Approval": { action: "Answer underwriting requests quickly and avoid new credit or large transfers.", owner: "You + lender", time: "Usually 1–3 weeks" },
  "Closing Day": { action: "Verify funds safely, review every document, and bring identification.", owner: "You + closing team", time: "About 1–2 hours" },
  "Moving In": { action: "Transfer utilities, change locks, and securely store your closing documents.", owner: "You", time: "First week" },
  "Preparing Your Home": { action: "Prioritize repairs, decluttering, cleaning, and presentation.", owner: "You + GraceAnn", time: "About 1–4 weeks" },
  "Setting the Price": { action: "Review the market analysis and agree on a launch and adjustment strategy.", owner: "You + GraceAnn", time: "One strategy session" },
  "Listing Your Home": { action: "Approve photography, listing details, and the showing plan before launch.", owner: "GraceAnn + you", time: "Usually 2–5 days" },
};

const milestoneTemplates = [
  { label: "Inspection completed", offset: -21 },
  { label: "Financing documents finalized", offset: -18 },
  { label: "Appraisal target", offset: -14 },
  { label: "Closing Disclosure review", offset: -3 },
  { label: "Final walk-through", offset: -1 },
  { label: "Closing day", offset: 0 },
];

function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00`); value.setDate(value.getDate() + days); return value;
}

export default function JourneyDashboard() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = Number(rawId);
  const [, setLocation] = useLocation();
  const [editingName, setEditingName] = useState(false); const [draftName, setDraftName] = useState("");
  const queryClient = useQueryClient();
  const { data: journey, isLoading: loadingJourney } = useGetJourney(id, { query: { enabled: !!id } });
  const { data: progress, isLoading: loadingProgress } = useGetJourneyProgress(id, { query: { enabled: !!id } });
  const { data: steps, isLoading: loadingSteps } = useListJourneySteps(id, { query: { enabled: !!id } });
  const updateStep = useUpdateJourneyStep();
  const updateJourney = useUpdateJourney();
  const resetJourney = useResetJourney();
  const deleteJourney = useDeleteJourney();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["journey", id] });
    queryClient.invalidateQueries({ queryKey: getListJourneyStepsQueryKey(id) });
    queryClient.invalidateQueries({ queryKey: getGetJourneyProgressQueryKey(id) });
  };

  if (loadingJourney || loadingProgress || loadingSteps) return <div className="container mx-auto px-4 py-12 max-w-5xl space-y-6"><Skeleton className="h-12 w-72" /><Skeleton className="h-72 rounded-3xl" /><Skeleton className="h-48 rounded-3xl" /></div>;
  if (!journey) return <div className="container mx-auto px-4 py-24 text-center"><MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p>Journey not found.</p><Link href="/"><Button variant="outline" className="mt-4">Back home</Button></Link></div>;

  const pct = progress?.percentComplete ?? 0;
  const currentStep = steps?.find((step) => step.stepNumber === journey.currentStep) || steps?.find((step) => step.status !== "completed") || steps?.[steps.length - 1];
  const guidance = currentStep ? stepGuidance[currentStep.title] || { action: `Open ${currentStep.title} and complete the action checklist.`, owner: "You + GraceAnn", time: "Work at your pace" } : null;
  const milestones = journey.closingDate ? milestoneTemplates.map((item) => ({ ...item, date: shiftDate(journey.closingDate!, item.offset) })) : [];

  const exportData = () => {
    const blob = new Blob([JSON.stringify(exportJourneyData(id), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `home-journey-${journey.userName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`; anchor.click(); URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!window.confirm("Reset this journey? Progress, notes, dates, and document checks on this device will be cleared.")) return;
    resetJourney.mutate({ id }, { onSuccess: refresh });
  };
  const beginRename = () => { setDraftName(journey.userName); setEditingName(true); };
  const saveName = () => { if (!draftName.trim()) return; updateJourney.mutate({ id, data: { userName: draftName.trim() } }, { onSuccess: () => { setEditingName(false); refresh(); } }); };
  const handleDelete = () => { if (!window.confirm(`Delete ${journey.userName}'s journey from this device? This cannot be undone unless you have a backup.`)) return; deleteJourney.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListJourneysQueryKey() }); setLocation("/"); } }); };

  return (
    <div className="container mx-auto px-4 pt-8 pb-28 sm:pb-12 md:py-12 max-w-5xl opacity-0 animate-fade-in-up">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-semibold"><ChevronLeft className="h-4 w-4" />All journeys</Link>
        <Link href={`/journey/${id}/documents`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/8 border border-primary/20 px-4 py-2.5 rounded-full"><FolderOpen className="h-4 w-4" />Documents</Link>
      </div>

      <section className="rounded-[2rem] overflow-hidden bg-[linear-gradient(135deg,hsl(196_48%_18%),hsl(196_44%_26%)_62%,hsl(92_30%_29%))] text-white shadow-xl mb-7">
        <div className="p-7 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                {journey.type === "buyer" ? <Compass className="h-7 w-7" /> : journey.type === "seller" ? <Home className="h-7 w-7" /> : <ArrowLeftRight className="h-7 w-7" />}
              </div>
              <div><p className="text-white/60 uppercase tracking-[0.18em] text-xs font-bold mb-1">Personal roadmap</p><h1 className="font-serif text-3xl md:text-4xl">{journey.userName}&apos;s {journey.type === "buyer" ? "Buying" : journey.type === "seller" ? "Selling" : "Buy & Sell"} Journey</h1></div>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/15 px-5 py-3"><span className="text-2xl font-serif">{pct}%</span><span className="text-white/65 text-sm ml-2">complete</span></div>
          </div>
          <div className="mt-7 h-3 bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-label="Journey progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
      </section>

      {currentStep && guidance && (
        <section className="rounded-3xl bg-card border border-border shadow-sm p-6 md:p-8 mb-7">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent mb-2">Your next best action · Stop {currentStep.stepNumber}</p>
              <h2 className="font-serif text-2xl md:text-3xl mb-3">{currentStep.title}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{guidance.action}</p>
              <div className="flex flex-wrap gap-4 mt-5 text-sm text-muted-foreground"><span className="inline-flex gap-2 items-center"><UserRound className="h-4 w-4 text-primary" />{guidance.owner}</span><span className="inline-flex gap-2 items-center"><Clock3 className="h-4 w-4 text-primary" />{guidance.time}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-52">
              <Link href={`/journey/${id}/step/${currentStep.stepNumber}`}><Button size="lg" className="w-full rounded-xl">Open this step<ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <a href={`mailto:graceann@threshold.homes?subject=${encodeURIComponent(`Question about ${currentStep.title}`)}&body=${encodeURIComponent(`Hi GraceAnn, I have a question about ${currentStep.title} in my Home Journey.`)}`}><Button size="lg" variant="outline" className="w-full rounded-xl"><MessageCircle className="h-4 w-4 mr-2" />Ask GraceAnn</Button></a>
            </div>
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-7 mb-12">
        <section className="rounded-3xl bg-card border border-border p-6 md:p-8">
          <div className="flex items-start gap-3 mb-5"><CalendarDays className="h-6 w-6 text-primary mt-1" /><div><h2 className="font-serif text-2xl">Closing countdown</h2><p className="text-sm text-muted-foreground mt-1">Add a target date to create a planning timeline. Confirm contract deadlines with your transaction team.</p></div></div>
          <label htmlFor="closing-date" className="text-sm font-bold">Target closing date</label>
          <input id="closing-date" type="date" value={journey.closingDate || ""} onChange={(event) => updateJourney.mutate({ id, data: { closingDate: event.target.value || undefined } }, { onSuccess: refresh })} className="mt-2 w-full h-12 rounded-xl border border-input bg-background px-4 text-base" />
          {milestones.length > 0 ? <ol className="mt-6 space-y-3">{milestones.map((item) => <li key={item.label} className="flex items-center justify-between gap-4 py-2 border-b border-border/60 last:border-0"><span className="text-sm font-medium">{item.label}</span><time className="text-sm text-muted-foreground whitespace-nowrap">{item.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time></li>)}</ol> : <div className="mt-5 rounded-2xl bg-secondary/60 p-5 text-sm text-muted-foreground">No target date yet. Add one when you are under contract or have a planning date in mind.</div>}
        </section>

        <section className="rounded-3xl bg-primary/5 border border-primary/15 p-6 md:p-8">
          <div className="flex items-start gap-3"><LockKeyhole className="h-6 w-6 text-primary mt-1" /><div><h2 className="font-serif text-2xl">Your data, your device</h2><p className="text-sm text-muted-foreground mt-2 leading-relaxed">Progress and notes are stored only in this browser. They do not automatically follow you to another phone or computer.</p></div></div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button variant="outline" className="rounded-xl" onClick={exportData}><Download className="h-4 w-4 mr-2" />Backup</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" />Print</Button>
          </div>
          <button onClick={handleReset} className="mt-5 text-sm text-muted-foreground hover:text-destructive inline-flex items-center gap-2"><RotateCcw className="h-4 w-4" />Reset this journey</button>
          <div className="mt-6 pt-5 border-t border-primary/15">
            <p className="text-sm font-bold mb-3">Manage this journey</p>
            {editingName ? <div className="flex gap-2"><label htmlFor="journey-name" className="sr-only">Journey name</label><input id="journey-name" value={draftName} onChange={(e) => setDraftName(e.target.value)} className="min-w-0 flex-1 h-10 rounded-lg border border-input bg-background px-3" /><Button size="sm" onClick={saveName}><Save className="h-4 w-4 mr-1" />Save</Button></div> : <button onClick={beginRename} className="text-sm text-primary font-bold inline-flex items-center gap-2"><Pencil className="h-4 w-4" />Rename journey</button>}
            <button onClick={handleDelete} className="mt-4 block text-sm text-destructive font-bold"><span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" />Delete journey</span></button>
          </div>
        </section>
      </div>

      {pct === 100 && <div className="mb-10 p-8 rounded-3xl bg-accent/10 border border-accent/20 text-center"><Flag className="h-10 w-10 text-accent mx-auto mb-3" /><h2 className="font-serif text-3xl">You&apos;ve arrived</h2><p className="text-muted-foreground mt-2">Every roadmap milestone is marked complete. Keep your backup with your important transaction records.</p></div>}

      <section aria-labelledby="roadmap-title">
        <div className="flex items-end justify-between gap-4 mb-6"><div><p className="text-xs uppercase tracking-[0.16em] font-bold text-muted-foreground">Full roadmap</p><h2 id="roadmap-title" className="font-serif text-3xl mt-1">Every step, in order</h2></div><p className="text-sm text-muted-foreground">{progress?.completedSteps || 0} of {progress?.totalSteps || 0} completed</p></div>
        <div className="space-y-4">
          {steps?.map((step) => {
            const isCurrent = step.stepNumber === currentStep?.stepNumber; const isCompleted = step.status === "completed";
            return <Card key={step.id} className={`rounded-2xl transition-all ${isCurrent ? "border-accent shadow-md" : "border-border"}`}><CardContent className="p-5 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${isCompleted ? "bg-primary text-white" : isCurrent ? "bg-accent text-white" : "bg-muted text-muted-foreground"}`}>{isCompleted ? <Check className="h-5 w-5" /> : step.stepNumber}</div>
              <Link href={`/journey/${id}/step/${step.stepNumber}`} className="flex-1 min-w-0 group"><p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{isCurrent ? "Next action" : isCompleted ? "Completed" : "Upcoming"}</p><h3 className="font-serif text-xl mt-1 group-hover:text-primary">{step.title}</h3></Link>
              {isCurrent && !isCompleted ? <button onClick={() => updateStep.mutate({ id, stepNumber: step.stepNumber, data: { status: "completed" } }, { onSuccess: refresh })} className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-primary"><Check className="h-4 w-4" />Mark complete</button> : <Link href={`/journey/${id}/step/${step.stepNumber}`} aria-label={`Open ${step.title}`}><ArrowRight className="h-5 w-5 text-muted-foreground" /></Link>}
            </CardContent></Card>;
          })}
        </div>
      </section>

      {currentStep && <Link href={`/journey/${id}/step/${currentStep.stepNumber}`} className="sm:hidden fixed bottom-4 left-4 right-4 z-40 bg-primary text-primary-foreground rounded-2xl shadow-2xl px-5 py-4 flex items-center justify-between font-bold">Next: {currentStep.title}<ArrowRight className="h-5 w-5" /></Link>}
    </div>
  );
}
