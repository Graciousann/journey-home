import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Compass, User, ArrowRight, BookOpen, Library, Home as HomeIcon, ArrowLeftRight, Calculator, Clock, Scale, MapPin, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateJourney, useListJourneys, getListJourneysQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type JourneyType = "buyer" | "seller" | "both";

const journeyOptions: { type: JourneyType; icon: any; label: string; description: string }[] = [
  { type: "buyer", icon: Compass, label: "I'm Buying", description: "Find and purchase your new home" },
  { type: "seller", icon: HomeIcon, label: "I'm Selling", description: "Sell your current home" },
  { type: "both", icon: ArrowLeftRight, label: "Buying & Selling", description: "Both at the same time" },
];

const journeyLabel = (type: string) => {
  if (type === "buyer") return "Buying";
  if (type === "seller") return "Selling";
  return "Buying & Selling";
};

const quickLinks = [
  { href: "/calculators", icon: Calculator, label: "Calculators", desc: "Affordability & net sheets" },
  { href: "/timelines", icon: Clock, label: "Timelines", desc: "4-week & 6-week closes" },
  { href: "/legal", icon: Scale, label: "Know Your Rights", desc: "NAR settlement & commissions" },
  { href: "/resources", icon: Library, label: "Resources", desc: "Guides & checklists" },
  { href: "/glossary", icon: BookOpen, label: "Glossary", desc: "Real estate terms" },
];

const credentials = [
  { label: "10+ Years Experience" },
  { label: "Investment Specialist" },
  { label: "Certified New Home Specialist" },
  { label: "New Construction Certified" },
  { label: "Board-Certified Art Therapist" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [type, setType] = useState<JourneyType | null>(null);
  const queryClient = useQueryClient();

  const { data: journeys, isLoading: isLoadingJourneys } = useListJourneys();
  const createJourney = useCreateJourney();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return;

    createJourney.mutate(
      { data: { userName: name, type } },
      {
        onSuccess: (journey) => {
          queryClient.invalidateQueries({ queryKey: getListJourneysQueryKey() });
          setLocation(`/journey/${journey.id}`);
        },
      }
    );
  };

  return (
    <div className="opacity-0 animate-fade-in-up">

      {/* ── GraceAnn Personal Introduction ── */}
      <div
        className="w-full relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(196 48% 18%) 0%, hsl(196 45% 26%) 60%, hsl(92 30% 28%) 100%)" }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 md:px-8 py-14 md:py-20 max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">

            {/* Photo */}
            <div className="flex-shrink-0 relative">
              <div
                className="h-40 w-40 md:h-52 md:w-52 rounded-full overflow-hidden shadow-2xl bg-white/10 border border-white/20"
                style={{ boxShadow: "0 0 0 8px rgba(255,255,255,0.06), 0 24px 70px rgba(0,0,0,0.32)" }}
              >
                <img
                  src="/graceann-headshot.jpeg"
                  alt="GraceAnn Visser, real estate advisor"
                  width="800"
                  height="1200"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-[center_28%]"
                />
              </div>
              {/* Decorative ring */}
              <div
                className="absolute -inset-2 rounded-full border border-white/10 pointer-events-none"
              />
            </div>

            {/* Bio text */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-white/70 text-sm font-semibold uppercase tracking-[0.18em] mb-3">
                A clearer path to your next move
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-1">
                GraceAnn Visser
              </h1>
              <p className="text-white/70 font-medium text-base mb-6">
                Real Estate Advisor · Certified New Home Specialist
              </p>

              <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                Buying or selling a home comes with a hundred decisions. This roadmap turns them into a clear sequence—
                with practical guidance, useful tools, and the context you need to move forward confidently.
              </p>

              {/* Credential badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {credentials.map((c) => (
                  <span
                    key={c.label}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.18)" }}
                  >
                    <Star className="h-2.5 w-2.5 flex-shrink-0" style={{ color: "hsl(92 50% 65%)" }} />
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Road Map Hero + Journey Setup ── */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">

        {/* Headline + SVG road */}
        <div className="flex flex-col items-center text-center mb-14 space-y-5">
          <h2 className="text-3xl md:text-5xl font-serif text-foreground leading-tight max-w-3xl">
            Know what comes next—before you need to ask.
          </h2>
          <p className="text-base text-muted-foreground max-w-xl">
            Create your private, personalized route. Your progress, notes, and document checklist stay on this device.
          </p>

          {/* Road SVG */}
          <div className="w-full max-w-3xl h-44 mt-4 relative opacity-80 pointer-events-none">
            <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <path d="M 0,200 Q 200,200 400,100 T 800,0" fill="none" stroke="hsl(var(--muted))" strokeWidth="60" strokeLinecap="round" />
              <path d="M 0,200 Q 200,200 400,100 T 800,0" fill="none" stroke="hsl(var(--background))" strokeWidth="4" className="road-dash" />
              <circle cx="200" cy="150" r="16" fill="hsl(var(--primary))" />
              <circle cx="200" cy="150" r="8" fill="white" />
              <circle cx="450" cy="80" r="16" fill="hsl(var(--accent))" />
              <circle cx="450" cy="80" r="8" fill="white" />
              <circle cx="700" cy="25" r="16" fill="hsl(var(--primary))" />
              <circle cx="700" cy="25" r="8" fill="white" />
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Journey setup form */}
          <div className="flex flex-col gap-8">
            <Card className="border-none shadow-xl bg-card rounded-3xl overflow-hidden ring-1 ring-border/50">
              <CardHeader className="bg-primary/5 border-b border-border/50 pb-6">
                <CardTitle className="font-serif text-2xl flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  Plot your route
                </CardTitle>
                <CardDescription className="text-base">
                  Tell me where you're heading and I'll map out every step of your journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleStart} className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-base font-semibold">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Alex"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="given-name"
                      className="h-14 text-lg bg-background rounded-xl border-border focus-visible:ring-primary/50"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Choose Your Path</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {journeyOptions.map(({ type: t, icon: Icon, label }) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          aria-pressed={type === t}
                          className={`rounded-xl border-2 flex flex-col items-center justify-center gap-3 py-6 px-2 text-center transition-all duration-300 ${
                            type === t
                              ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(74,120,56,0.2)] text-foreground scale-[1.02]"
                              : "border-border hover:border-primary/40 text-muted-foreground hover:bg-primary/5"
                          }`}
                        >
                          <Icon className={`h-8 w-8 ${type === t ? "text-accent" : "text-primary/60"}`} />
                          <span className="font-semibold text-sm leading-tight">{label}</span>
                        </button>
                      ))}
                    </div>
                    {type && (
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-sm text-foreground mt-4 animate-fade-in-up">
                        <strong>Destination:</strong> {journeyOptions.find((o) => o.type === type)?.description}
                        {type === "both" && " — I'll guide you through coordinating both transactions simultaneously."}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                    disabled={!name.trim() || !type || createJourney.isPending}
                  >
                    {createJourney.isPending ? "Mapping Route..." : "Start the Journey"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-10">
            <div className="space-y-5">
              <h2 className="text-2xl font-serif flex items-center gap-3">
                <Compass className="h-6 w-6 text-accent" />
                Active Journeys
              </h2>
              {isLoadingJourneys ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              ) : journeys && journeys.length > 0 ? (
                <div className="grid gap-4">
                  {journeys.map((j) => (
                    <Link key={j.id} href={`/journey/${j.id}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer border-border hover:border-primary/40 rounded-2xl group overflow-hidden bg-card/80 backdrop-blur">
                        <div className="h-1 bg-gradient-to-r from-primary to-accent w-full transform origin-left transition-transform group-hover:scale-x-100 opacity-50" />
                        <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              {j.type === "buyer" ? <Compass className="h-6 w-6" /> : j.type === "seller" ? <HomeIcon className="h-6 w-6" /> : <ArrowLeftRight className="h-6 w-6" />}
                            </div>
                            <div>
                              <p className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                                {j.userName}'s {journeyLabel(j.type)} Road
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                                <MapPin className="h-3 w-3" />
                                Started {new Date(j.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card className="bg-primary/5 border-dashed border-primary/20 rounded-2xl">
                  <CardContent className="p-10 text-center flex flex-col items-center gap-3">
                    <MapPin className="h-10 w-10 text-primary/30" />
                    <p className="text-muted-foreground font-medium">The road is clear.</p>
                    <p className="text-sm text-muted-foreground">Start a new journey on the left to begin.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <h2 className="text-xl font-serif mb-5">Roadside Stops</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {quickLinks.map(({ href, icon: Icon, label, desc }, idx) => (
                  <Link key={href} href={href} className={`opacity-0 animate-fade-in-up stagger-${idx + 1}`}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 hover:border-primary/40 cursor-pointer h-full border-border rounded-xl bg-card">
                      <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                        <div className="p-3 bg-secondary rounded-full text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-tight">{desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
