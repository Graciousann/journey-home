import { useRef, useState } from "react";
import { useLocation, Link } from "wouter";
import { Compass, ArrowRight, BookOpen, Library, Home as HomeIcon, ArrowLeftRight, Calculator, Clock, Scale, MapPin, Star, Phone, Mail, ShieldCheck, ListChecks, CalendarCheck, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateJourney, useListJourneys, getListJourneysQueryKey, importJourneyData } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type JourneyType = "buyer" | "seller" | "both";
const options = [
  { type: "buyer" as const, icon: Compass, label: "I'm buying", description: "Plan the path from financing through moving day" },
  { type: "seller" as const, icon: HomeIcon, label: "I'm selling", description: "Prepare, price, market, negotiate, and close" },
  { type: "both" as const, icon: ArrowLeftRight, label: "Buying & selling", description: "Coordinate both transactions with fewer surprises" },
];
const benefits = [
  { icon: ListChecks, title: "A step-by-step roadmap", text: "See what comes next, who is involved, and what deserves your attention." },
  { icon: CalendarCheck, title: "Checklists and deadlines", text: "Track progress, notes, documents, and a personalized closing countdown." },
  { icon: BookOpen, title: "Plain-English guidance", text: "Understand unfamiliar terms, common pitfalls, and the questions worth asking." },
];
const quickLinks = [
  { href: "/calculators", icon: Calculator, label: "Calculators", desc: "Affordability and net sheets" },
  { href: "/timelines", icon: Clock, label: "Timelines", desc: "Four- and six-week closes" },
  { href: "/legal", icon: Scale, label: "Know Your Rights", desc: "Representation and compensation" },
  { href: "/resources", icon: Library, label: "Resources", desc: "Guides and checklists" },
  { href: "/glossary", icon: BookOpen, label: "Glossary", desc: "Real-estate terms" },
];
const credentials = ["10+ years of experience", "Investment specialist", "Certified New Home Specialist", "New-construction certified", "Board-certified art therapist"];

export default function Home() {
  const [, setLocation] = useLocation(); const [name, setName] = useState(""); const [type, setType] = useState<JourneyType | null>(null);
  const fileRef = useRef<HTMLInputElement>(null); const queryClient = useQueryClient(); const { data: journeys = [] } = useListJourneys(); const createJourney = useCreateJourney();
  const handleStart = (event: React.FormEvent) => { event.preventDefault(); if (!name.trim() || !type) return; createJourney.mutate({ data: { userName: name, type } }, { onSuccess: (journey) => { queryClient.invalidateQueries({ queryKey: getListJourneysQueryKey() }); setLocation(`/journey/${journey.id}`); } }); };
  const restore = async (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; try { const journey = importJourneyData(JSON.parse(await file.text())); await queryClient.invalidateQueries({ queryKey: getListJourneysQueryKey() }); toast.success("Journey restored"); setLocation(`/journey/${journey.id}`); } catch (error) { toast.error(error instanceof Error ? error.message : "This backup could not be restored."); } finally { event.target.value = ""; } };

  return <div className="opacity-0 animate-fade-in-up">
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,hsl(196_48%_18%),hsl(196_45%_26%)_62%,hsl(92_30%_28%))] text-white">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none brand-grid" />
      <div className="container mx-auto max-w-6xl px-4 md:px-8 py-12 md:py-18 relative grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-center">
        <div>
          <p className="text-white/70 text-sm font-bold uppercase tracking-[.18em] mb-4">A private planning tool guided by GraceAnn Visser</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-white">Your clear path through buying or selling a home.</h1>
          <p className="mt-6 text-lg text-white/82 leading-relaxed max-w-2xl">Turn a complicated move into a practical sequence of decisions, deadlines, and conversations—so you always know what comes next.</p>
          <div className="grid sm:grid-cols-3 gap-3 mt-8 text-sm">
            {["About 1 minute to begin", "No account required", "Saved privately on this device"].map((item) => <div key={item} className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3 py-3"><CheckCircle2 className="h-4 w-4 text-[#b8d49f] shrink-0" />{item}</div>)}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <img src="/graceann-headshot.jpeg" alt="GraceAnn Visser, real estate advisor" width="800" height="1200" fetchPriority="high" className="h-16 w-16 rounded-full object-cover object-[center_25%] border-2 border-white/25" />
            <div><p className="font-serif text-xl">GraceAnn Visser</p><p className="text-sm text-white/65">Real Estate Advisor · Certified New Home Specialist</p></div>
          </div>
        </div>

        <Card id="start" className="rounded-3xl border-white/15 shadow-2xl bg-white text-foreground scroll-mt-24">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-3 mb-7"><div className="rounded-xl bg-primary/10 p-2.5"><MapPin className="h-6 w-6 text-primary" /></div><div><h2 className="text-2xl">Build your roadmap</h2><p className="text-sm text-muted-foreground mt-1">Choose your path and continue at your own pace.</p></div></div>
            <form onSubmit={handleStart} className="space-y-6">
              <div><Label htmlFor="name" className="font-bold">First name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" placeholder="e.g. Alex" className="mt-2 h-12 text-base" /></div>
              <fieldset><legend className="font-bold mb-3">What are you planning?</legend><div className="grid gap-3">{options.map(({ type: choice, icon: Icon, label, description }) => <button key={choice} type="button" onClick={() => setType(choice)} aria-pressed={type === choice} className={`text-left rounded-xl border-2 p-4 flex gap-3 transition-colors ${type === choice ? "border-accent bg-accent/8" : "border-border hover:border-primary/40"}`}><Icon className={`h-6 w-6 shrink-0 mt-0.5 ${type === choice ? "text-accent" : "text-primary"}`} /><span><strong className="block">{label}</strong><span className="text-sm text-muted-foreground">{description}</span></span></button>)}</div></fieldset>
              <Button type="submit" size="lg" className="w-full h-13 rounded-xl text-base" disabled={!name.trim() || !type || createJourney.isPending}>{createJourney.isPending ? "Building your roadmap…" : "Start my private roadmap"}<ArrowRight className="ml-2 h-5 w-5" /></Button>
              <p className="flex gap-2 text-xs text-muted-foreground leading-relaxed"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" />This planner does not send your name or progress to GraceAnn. Use the contact options below whenever you want personal guidance.</p>
              <input ref={fileRef} type="file" accept="application/json,.json" onChange={restore} className="sr-only" aria-label="Restore a journey backup" />
              <button type="button" onClick={() => fileRef.current?.click()} className="mx-auto flex items-center gap-2 text-sm font-bold text-primary hover:underline"><Upload className="h-4 w-4" />Restore a downloaded backup</button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>

    <section className="container mx-auto max-w-6xl px-4 md:px-8 py-14 md:py-18" aria-labelledby="benefits-title"><div className="text-center max-w-2xl mx-auto"><p className="eyebrow">Useful from day one</p><h2 id="benefits-title" className="text-3xl md:text-4xl">A roadmap you can actually use</h2><p className="mt-3 text-muted-foreground">Built to reduce uncertainty—not add another pile of information.</p></div><div className="grid md:grid-cols-3 gap-5 mt-9">{benefits.map(({ icon: Icon, title, text }) => <Card key={title} className="rounded-2xl"><CardContent className="p-6"><div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><Icon className="h-6 w-6 text-primary" /></div><h3 className="text-xl">{title}</h3><p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p></CardContent></Card>)}</div></section>

    {journeys.length > 0 && <section className="container mx-auto max-w-6xl px-4 md:px-8 pb-14" aria-labelledby="saved-title"><div className="mb-5"><p className="eyebrow">Continue where you left off</p><h2 id="saved-title" className="text-3xl">Saved journeys</h2></div><div className="grid md:grid-cols-2 gap-4">{journeys.map((journey) => <Link key={journey.id} href={`/journey/${journey.id}`}><Card className="rounded-2xl hover:border-primary/45 hover:shadow-md transition-all"><CardContent className="p-5 flex items-center gap-4"><div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><Compass className="h-6 w-6 text-primary" /></div><div className="flex-1"><p className="font-serif text-xl">{journey.userName}&apos;s {journey.type === "buyer" ? "Buying" : journey.type === "seller" ? "Selling" : "Buy & Sell"} Journey</p><p className="text-sm text-muted-foreground">Started {new Date(journey.createdAt).toLocaleDateString()}</p></div><ArrowRight className="h-5 w-5 text-primary" /></CardContent></Card></Link>)}</div></section>}

    <section className="bg-secondary/65 border-y border-border"><div className="container mx-auto max-w-6xl px-4 md:px-8 py-14"><div className="flex flex-wrap items-end justify-between gap-5 mb-7"><div><p className="eyebrow">Learn before you decide</p><h2 className="text-3xl md:text-4xl">Helpful roadside stops</h2></div></div><div className="grid grid-cols-2 md:grid-cols-5 gap-4">{quickLinks.map(({ href, icon: Icon, label, desc }) => <Link key={href} href={href}><Card className="h-full rounded-2xl hover:-translate-y-1 hover:shadow-md transition-all"><CardContent className="p-5"><Icon className="h-6 w-6 text-primary mb-4" /><h3 className="font-sans font-bold text-base">{label}</h3><p className="text-xs text-muted-foreground mt-1">{desc}</p></CardContent></Card></Link>)}</div></div></section>

    <section className="container mx-auto max-w-6xl px-4 md:px-8 py-14 md:py-18"><div className="grid lg:grid-cols-[1fr_.9fr] gap-9 items-center"><div><p className="eyebrow">Experience with the human side of moving</p><h2 className="text-3xl md:text-4xl">A knowledgeable guide when the roadmap gets personal</h2><p className="mt-4 text-muted-foreground leading-relaxed">The planner helps you prepare. GraceAnn helps you interpret the choices, understand the local market, and move forward with a strategy that fits your life.</p><div className="flex flex-wrap gap-2 mt-6">{credentials.map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-bold"><Star className="h-3 w-3 text-accent" />{item}</span>)}</div></div><Card className="rounded-3xl bg-primary text-primary-foreground border-0"><CardContent className="p-7 md:p-9"><p className="text-primary-foreground/70 text-sm font-bold uppercase tracking-[.16em]">Ready for personal guidance?</p><h2 className="text-3xl text-white mt-2">Let’s talk about your next move.</h2><p className="mt-3 text-white/75">Call or email GraceAnn directly. A conversation is separate from your private planner.</p><div className="grid sm:grid-cols-2 gap-3 mt-7"><a href="tel:6157397804" className="rounded-xl bg-white text-primary px-5 py-4 font-bold flex items-center justify-center gap-2"><Phone className="h-5 w-5" />Call GraceAnn</a><a href="mailto:graceann@threshold.homes?subject=Home%20Journey%20consultation" className="rounded-xl border border-white/30 text-white px-5 py-4 font-bold flex items-center justify-center gap-2"><Mail className="h-5 w-5" />Send an email</a></div></CardContent></Card></div></section>
  </div>;
}
