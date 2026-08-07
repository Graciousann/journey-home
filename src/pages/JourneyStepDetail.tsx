import { useParams, Link, useLocation } from "wouter";
import {
  useGetJourney,
  useGetJourneyStep,
  useListStepNotes,
  useCreateStepNote,
  useDeleteStepNote,
  useUpdateJourneyStep,
  getGetJourneyStepQueryKey,
  getListStepNotesQueryKey,
  getListJourneyStepsQueryKey,
  getGetJourneyProgressQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  ListChecks,
  BookOpen,
  StickyNote,
  Trash2,
  Circle,
  MapPin,
  Flag,
  ArrowRight,
  Phone,
  Mail,
  Instagram,
} from "lucide-react";
import { stepContent } from "@/lib/step-content";

export default function JourneyStepDetail() {
  const params = useParams<{ id: string; stepNumber: string }>();
  const id = parseInt(params.id);
  const stepNumber = parseInt(params.stepNumber);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");

  const { data: journey } = useGetJourney(id, {
    query: { enabled: !!id, queryKey: ["getJourney", id] },
  });
  const { data: step, isLoading: loadingStep } = useGetJourneyStep(id, stepNumber, {
    query: { enabled: !!id && !!stepNumber, queryKey: getGetJourneyStepQueryKey(id, stepNumber) },
  });
  const { data: notes, isLoading: loadingNotes } = useListStepNotes(id, stepNumber, {
    query: { enabled: !!id && !!stepNumber, queryKey: getListStepNotesQueryKey(id, stepNumber) },
  });

  const updateStep = useUpdateJourneyStep();
  const createNote = useCreateStepNote();
  const deleteNote = useDeleteStepNote();

  const journeyType = journey?.type ?? "buyer";
  const totalSteps = journeyType === "both" ? 12 : 8;
  const content = (stepContent as any)[journeyType]?.[stepNumber];

  const handleStatusChange = (status: "not_started" | "in_progress" | "completed") => {
    updateStep.mutate(
      { id, stepNumber, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetJourneyStepQueryKey(id, stepNumber) });
          queryClient.invalidateQueries({ queryKey: getListJourneyStepsQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getGetJourneyProgressQueryKey(id) });
        },
      }
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    createNote.mutate(
      { id, stepNumber, data: { content: noteText.trim() } },
      {
        onSuccess: () => {
          setNoteText("");
          queryClient.invalidateQueries({ queryKey: getListStepNotesQueryKey(id, stepNumber) });
        },
      }
    );
  };

  const handleDeleteNote = (noteId: number) => {
    deleteNote.mutate(
      { id, stepNumber, noteId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListStepNotesQueryKey(id, stepNumber) });
        },
      }
    );
  };

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loadingStep) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-12 flex-1" />
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!step) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">Stop not found on the map.</p>
        <Link href={`/journey/${id}`}><Button variant="outline" className="mt-4">Back to Map</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl opacity-0 animate-fade-in-up">
      <Link
        href={`/journey/${id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10 font-bold tracking-wide uppercase"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Map
      </Link>

      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
        <div className="relative">
          <div className="absolute inset-0 bg-accent blur-xl opacity-20 rounded-full" />
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-blue-600 shadow-xl border-4 border-white flex items-center justify-center relative z-10">
            <div className="text-center">
              <span className="block text-[10px] text-white/80 font-bold uppercase tracking-widest leading-none mb-1">Stop</span>
              <span className="block text-4xl font-serif text-white leading-none">{stepNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Stop {stepNumber} of {totalSteps}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                step.status === "completed"
                  ? "bg-primary text-white"
                  : step.status === "in_progress"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.status === "completed"
                ? "Reached"
                : step.status === "in_progress"
                ? "En Route"
                : "Upcoming"}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground leading-tight">
            {content?.title ?? step.title}
          </h1>
        </div>
      </div>

      <div className="flex gap-3 mb-12 flex-wrap">
        {step.status !== "in_progress" && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleStatusChange("in_progress")}
            disabled={updateStep.isPending}
            className="gap-2 rounded-xl border-2 font-bold"
          >
            <Clock className="h-5 w-5 text-accent" /> Start Segment
          </Button>
        )}
        {step.status !== "completed" && (
          <Button
            size="lg"
            onClick={() => handleStatusChange("completed")}
            disabled={updateStep.isPending}
            className="gap-2 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            <CheckCircle2 className="h-5 w-5" /> Mark Reached
          </Button>
        )}
        {step.status === "completed" && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleStatusChange("not_started")}
            disabled={updateStep.isPending}
            className="gap-2 rounded-xl border-2 font-bold"
          >
            <Circle className="h-5 w-5 text-muted-foreground" /> Undo
          </Button>
        )}
      </div>

      {content ? (
        <div className="space-y-6">
          <Card className="border-border bg-card rounded-2xl shadow-sm opacity-0 animate-fade-in-up stagger-1 overflow-hidden">
            <div className="h-1 bg-primary w-full" />
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="flex items-center gap-3 text-xl font-serif">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><BookOpen className="h-5 w-5" /></div>
                What this means
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg leading-relaxed">{content.meaning}</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card rounded-2xl shadow-sm opacity-0 animate-fade-in-up stagger-2 overflow-hidden">
            <div className="h-1 bg-blue-400 w-full" />
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="flex items-center gap-3 text-xl font-serif">
                <div className="p-2 bg-blue-400/10 rounded-lg text-blue-500"><MapPin className="h-5 w-5" /></div>
                What to expect on the road
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg leading-relaxed">{content.expect}</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card rounded-2xl shadow-sm opacity-0 animate-fade-in-up stagger-3 overflow-hidden">
            <div className="h-1 bg-accent w-full" />
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="flex items-center gap-3 text-xl font-serif">
                <div className="p-2 bg-accent/10 rounded-lg text-accent"><ListChecks className="h-5 w-5" /></div>
                Pre-departure checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {content.checklist.map((item: string, i: number) => {
                  const isChecked = checkedItems[i];
                  return (
                    <li 
                      key={i} 
                      className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all border-2 ${isChecked ? "bg-primary/5 border-primary/20" : "hover:bg-muted border-transparent"}`}
                      onClick={() => toggleCheck(i)}
                    >
                      <div className={`mt-0.5 h-6 w-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 bg-background"}`}>
                        {isChecked && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <span className={`text-base select-none transition-all ${isChecked ? "text-foreground line-through opacity-70" : "text-foreground"}`}>
                        {item}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6 opacity-0 animate-fade-in-up stagger-4">
            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 rounded-2xl shadow-sm relative overflow-hidden h-full">
              {/* Road sign diamond motif */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-200/50 dark:bg-amber-500/10 rotate-45 rounded-lg" />
              
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="flex items-center gap-2 text-lg font-serif text-amber-900 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  Roadblocks to avoid
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-amber-900/80 dark:text-amber-300/80 leading-relaxed font-medium">{content.pitfalls}</p>
              </CardContent>
            </Card>

            <Card className="bg-primary border-primary rounded-2xl shadow-lg relative overflow-hidden h-full text-primary-foreground">
              {/* Highway sign motif */}
              <div className="absolute inset-x-0 top-0 h-4 bg-white/20" />
              <div className="absolute inset-x-0 bottom-0 h-4 bg-white/10" />
              
              <CardContent className="pt-8 pb-8 relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-white/90 uppercase tracking-widest text-xs font-bold">
                    <Flag className="h-4 w-4" /> Did you know?
                  </div>
                  <p className="text-lg font-serif leading-snug">{content.tip}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border-border bg-card rounded-2xl border-dashed">
          <CardContent className="py-16 text-center flex flex-col items-center">
            <MapPin className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">Map details for this stop are coming soon.</p>
          </CardContent>
        </Card>
      )}

      <div className="mt-16 pt-10 border-t border-border/60">
        <h2 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg text-foreground"><StickyNote className="h-5 w-5" /></div>
          Travel Log
        </h2>

        <form onSubmit={handleAddNote} className="mb-8 space-y-4">
          <Textarea
            placeholder="Jot down questions, observations, or reminders for this segment of the trip..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            className="resize-none bg-background rounded-xl border-border text-base focus-visible:ring-primary/50"
          />
          <Button type="submit" variant="outline" size="lg" className="rounded-xl font-bold border-2" disabled={!noteText.trim() || createNote.isPending}>
            {createNote.isPending ? "Logging..." : "Log Note"}
          </Button>
        </form>

        {loadingNotes ? (
          <div className="space-y-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        ) : notes && notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group flex gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-3">
                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg h-fit"
                  title="Delete Note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-2xl bg-secondary/50 border border-dashed border-border">
            <p className="text-sm font-medium text-muted-foreground">
              No entries in your travel log for this stop yet.
            </p>
          </div>
        )}
      </div>

      {/* Contact Card */}
      <div className="mt-14 rounded-2xl overflow-hidden border border-border shadow-sm">
        <div
          className="px-6 py-5 flex flex-col sm:flex-row items-center sm:items-start gap-5"
          style={{ background: "linear-gradient(135deg, hsl(196 48% 18%) 0%, hsl(196 45% 26%) 60%, hsl(92 30% 28%) 100%)" }}
        >
          <div className="h-16 w-16 rounded-full overflow-hidden bg-white/10 border border-white/20 flex-shrink-0 shadow-md">
            <img
              src="/graceann-headshot.jpeg"
              alt="GraceAnn Visser"
              width="800"
              height="1200"
              loading="lazy"
              className="h-full w-full object-cover object-[center_28%]"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-0.5">Have a question about this step?</p>
            <p className="font-serif text-xl text-white leading-tight">GraceAnn Visser</p>
            <p className="text-white/65 text-xs mt-0.5">Real Estate Advisor · Benchmark Realty LLC</p>
          </div>
        </div>
        <div className="bg-card px-6 py-4 flex flex-wrap gap-3 justify-center sm:justify-start">
          <a
            href="tel:6157397804"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-primary/8 text-primary hover:bg-primary/15 border border-primary/20 transition-all hover:shadow-sm"
          >
            <Phone className="h-4 w-4" />
            615-739-7804
          </a>
          <a
            href="mailto:graceann@threshold.homes"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-primary/8 text-primary hover:bg-primary/15 border border-primary/20 transition-all hover:shadow-sm"
          >
            <Mail className="h-4 w-4" />
            graceann@threshold.homes
          </a>
          <a
            href="https://instagram.com/GraceAnn.visser"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-accent/8 text-accent hover:bg-accent/15 border border-accent/20 transition-all hover:shadow-sm"
          >
            <Instagram className="h-4 w-4" />
            @GraceAnn.visser
          </a>
        </div>
      </div>

      {/* Prominent Navigation */}
      <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
        {stepNumber > 1 ? (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setLocation(`/journey/${id}/step/${stepNumber - 1}`)}
            className="gap-3 rounded-2xl h-16 px-6 text-base font-bold border-2 hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous Stop
          </Button>
        ) : (
          <div className="hidden sm:block" />
        )}
        {stepNumber < totalSteps ? (
          <Button
            size="lg"
            onClick={() => setLocation(`/journey/${id}/step/${stepNumber + 1}`)}
            className="gap-3 rounded-2xl h-16 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:-translate-y-1 transition-all flex-1 sm:flex-none"
          >
            Continue Journey
            <ArrowRight className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={() => setLocation(`/journey/${id}`)}
            className="gap-3 rounded-2xl h-16 px-8 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:-translate-y-1 transition-all flex-1 sm:flex-none"
          >
            View Full Map
            <MapPin className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
