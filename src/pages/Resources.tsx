import { Library, Calculator, FileText, CheckSquare, Lightbulb, Clock, DollarSign, Shield, Home, Compass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const buyerResources = [
  {
    icon: Calculator,
    title: "Affordability Rule of Thumb",
    body: "A common guideline is to spend no more than 28% of your gross monthly income on housing costs (mortgage, taxes, insurance). Your total debt payments (including housing) should stay under 36%. Lenders call this the \"28/36 rule.\"",
  },
  {
    icon: FileText,
    title: "Documents You'll Need",
    body: "Prepare these before applying for a mortgage: W-2s and tax returns (last 2 years), recent pay stubs (30 days), bank and investment statements (2–3 months), government-issued ID, and employment verification letter.",
  },
  {
    icon: CheckSquare,
    title: "Home Inspection Checklist",
    body: "During your inspection, focus on: roof condition and age, foundation cracks, HVAC systems, plumbing (water pressure, leaks), electrical panel, windows and insulation, evidence of water damage or mold, and attic/crawl space condition.",
  },
  {
    icon: DollarSign,
    title: "Closing Costs Breakdown",
    body: "Budget for 2–5% of the purchase price in closing costs. This typically includes: loan origination fees (0.5–1%), appraisal ($300–600), title insurance ($500–1,500), escrow fees, prepaid property taxes, and homeowner's insurance (first year).",
  },
  {
    icon: Shield,
    title: "Protecting Yourself from Wire Fraud",
    body: "Wire fraud in real estate is rampant. Before wiring any funds, always call your title company or attorney at a phone number you found independently — never from an email. Verify wire instructions verbally every single time. If instructions change, treat it as a red flag.",
  },
  {
    icon: Lightbulb,
    title: "Questions to Ask During Showings",
    body: "Ask about: how long the home has been on the market, why the sellers are moving, age of major systems (roof, HVAC, water heater), utility costs, neighborhood noise levels, HOA rules and fees, and any known issues or past repairs.",
  },
];

const sellerResources = [
  {
    icon: Home,
    title: "How to Stage Your Home",
    body: "Staging can net you 5–10% more on your sale price. Key moves: depersonalize (pack up family photos), declutter closets and surfaces, deep clean everything including windows, add fresh neutral paint where needed, and boost curb appeal with fresh mulch and plants.",
  },
  {
    icon: DollarSign,
    title: "Understanding Your Net Proceeds",
    body: "Your \"net\" is what you walk away with. Subtract from sale price: agent commissions (typically 5–6%), closing costs (1–3% for sellers), mortgage payoff, any agreed-upon repairs or concessions, and prorated property taxes. Ask for a seller's net sheet early.",
  },
  {
    icon: Calculator,
    title: "Pricing Strategy That Works",
    body: "Overpricing is the most common seller mistake. Homes priced right sell faster and often for more due to competitive interest. Look at recent comparable sales (comps) from the last 90 days, within a half-mile, similar size and condition. Price to attract, not to anchor.",
  },
  {
    icon: FileText,
    title: "Disclosures You Must Make",
    body: "Every state has different rules, but generally you must disclose: known structural defects, water damage or mold history, roof leaks, pest infestations, unpermitted work, neighborhood nuisances (noise, odors), and HOA litigation. When in doubt, disclose.",
  },
  {
    icon: CheckSquare,
    title: "Evaluating an Offer Beyond Price",
    body: "Consider: financing type (cash is most reliable), down payment size, number of contingencies, proposed closing date, earnest money amount, and buyer's flexibility. A clean offer at 97% of asking often beats a full-price offer loaded with contingencies.",
  },
  {
    icon: Lightbulb,
    title: "During the Under Contract Period",
    body: "Stay cooperative: keep the home available for inspections, respond to repair requests promptly, continue maintaining the property, avoid making changes to the home, and keep your homeowner's insurance active until closing. The deal can still fall through — stay ready.",
  },
];

const generalTips = [
  {
    icon: Clock,
    title: "Timelines to Know",
    points: [
      "Mortgage pre-approval: 1–7 business days",
      "Accepted offer to closing: typically 30–60 days",
      "Home inspection: scheduled within 1–2 weeks of accepted offer",
      "Appraisal: 1–3 weeks to schedule and receive report",
      "Final loan approval (\"clear to close\"): 1–3 weeks after appraisal",
    ],
  },
  {
    icon: Compass,
    title: "Working With Your Agent",
    points: [
      "Your agent's job is to protect your interests — use them as your first call",
      "Be honest about your budget ceiling, not just your target",
      "Ask for weekly updates even when nothing is happening",
      "Review all documents before signing — never feel rushed",
      "Ask about their communication style and set expectations early",
    ],
  },
];

export default function Resources() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Library className="h-7 w-7 text-primary" />
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">Resources & Guides</h1>
        </div>
        <p className="text-muted-foreground text-lg ml-10">
          Practical knowledge to help you navigate every stage with confidence.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="font-serif text-2xl text-foreground mb-6 pb-3 border-b">
          For Home Buyers
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {buyerResources.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-border bg-card hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="font-serif text-2xl text-foreground mb-6 pb-3 border-b">
          For Home Sellers
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {sellerResources.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-border bg-card hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-foreground mb-6 pb-3 border-b">
          For Everyone
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {generalTips.map(({ icon: Icon, title, points }) => (
            <Card key={title} className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/50 flex-shrink-0 mt-2" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
