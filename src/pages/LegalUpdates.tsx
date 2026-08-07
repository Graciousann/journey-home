import { Scale, AlertTriangle, CheckCircle2, FileText, DollarSign, Users, Info, ExternalLink, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SectionCard({ icon: Icon, title, iconClass, borderClass, children }: { icon: any; title: string; iconClass?: string; borderClass?: string; children: React.ReactNode }) {
  return (
    <Card className={`border-border bg-card ${borderClass ?? ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${iconClass ?? "bg-primary/10"}`}>
            <Icon className={`h-5 w-5 ${iconClass?.includes("bg-primary") ? "text-primary" : iconClass?.includes("bg-amber") ? "text-amber-700" : iconClass?.includes("bg-blue") ? "text-blue-700" : "text-foreground"}`} />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function LegalUpdates() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Scale className="h-7 w-7 text-primary" />
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">Know Your Rights</h1>
        </div>
        <p className="text-muted-foreground text-lg ml-10">
          Understand representation agreements, negotiable compensation, and the questions to ask before you commit. Rules and forms can vary by brokerage, MLS, transaction, and state.
        </p>
        <p className="mt-4 ml-10 inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/8 border border-primary/15 rounded-full px-3 py-2"><CalendarDays className="h-4 w-4" />Educational content reviewed August 7, 2026</p>
      </div>

      <div className="space-y-8">

        <SectionCard icon={Scale} title="The NAR Antitrust Lawsuit & Settlement" iconClass="bg-primary/10">
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="font-semibold text-foreground mb-2">What happened</p>
              <p>In October 2023, a federal jury found the National Association of Realtors (NAR) and several major brokerages liable for conspiring to inflate real estate agent commissions. The jury awarded $1.78 billion in damages (which could be tripled under antitrust law to $5.36 billion). In March 2024, NAR agreed to a landmark $418 million settlement to resolve the lawsuit.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="font-semibold text-foreground mb-2">The core issue</p>
              <p>The lawsuit alleged that NAR rules required sellers to offer buyer agent compensation when listing on the MLS. This effectively bundled the buyer agent's fee into the seller's closing costs — meaning buyers never had to think about or negotiate their agent's pay. Plaintiffs argued this suppressed competition and kept commissions artificially high.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="font-semibold text-foreground mb-2">Similar lawsuits still active</p>
              <p>The Burnett v. NAR case was just one of several. Other suits (including Moehrl v. NAR and state-level actions) are still working through courts. Major brokerages including HomeServices of America, Compass, Anywhere Real Estate, RE/MAX, and Keller Williams have faced or settled similar claims. The legal landscape is still evolving.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={DollarSign} title="What Changed: Commission Rules (August 2024)" iconClass="bg-amber-100 dark:bg-amber-900/30">
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-red-200 dark:border-red-800/40 bg-red-50/50 dark:bg-red-900/10">
                <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Before August 2024</p>
                <ul className="space-y-1.5 text-muted-foreground text-xs">
                  <li className="flex gap-2"><span className="text-red-400">—</span> Sellers were required to offer buyer agent compensation on MLS</li>
                  <li className="flex gap-2"><span className="text-red-400">—</span> The buyer's agent commission (2.5–3%) was typically buried in closing costs</li>
                  <li className="flex gap-2"><span className="text-red-400">—</span> Buyers rarely saw or negotiated their agent's fee</li>
                  <li className="flex gap-2"><span className="text-red-400">—</span> Total commissions typically 5–6% of sale price, paid by seller</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-green-200 dark:border-green-800/40 bg-green-50/50 dark:bg-green-900/10">
                <p className="font-semibold text-green-700 dark:text-green-400 mb-2">After August 2024</p>
                <ul className="space-y-1.5 text-muted-foreground text-xs">
                  <li className="flex gap-2"><span className="text-green-500">+</span> Sellers are no longer required to offer buyer agent compensation via MLS</li>
                  <li className="flex gap-2"><span className="text-green-500">+</span> Buyer agent compensation is now fully negotiable</li>
                  <li className="flex gap-2"><span className="text-green-500">+</span> Buyers must sign a written agreement with their agent before touring homes</li>
                  <li className="flex gap-2"><span className="text-green-500">+</span> Commissions must be clearly disclosed and agreed upon in writing</li>
                </ul>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="font-semibold text-foreground mb-2">What this means for sellers</p>
              <p className="text-muted-foreground text-xs">You're no longer obligated to pay the buyer's agent. Some sellers choose to offer buyer agent compensation anyway (typically 2–2.5%) to attract more buyer traffic and make their listing more competitive. Others pay only their listing agent (1.5–3%) and let buyers negotiate their agent's fee separately. This is a legitimate strategy discussion to have with your listing agent.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="font-semibold text-foreground mb-2">What this means for buyers</p>
              <p className="text-muted-foreground text-xs">You will now be asked to sign a Buyer Representation Agreement before your agent will show you homes. This agreement specifies what your agent will be paid and by whom. Some sellers will offer buyer agent compensation; others will not. If the home you want to buy doesn't offer buyer agent compensation, your options include: negotiating it into the purchase price, paying your agent separately, or selecting a home where it is offered.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={FileText} title="The Written Buyer Representation Agreement" iconClass="bg-blue-100 dark:bg-blue-900/30">
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>As of August 17, 2024, NAR's settlement rules require buyer's agents to enter a written agreement with buyers <strong className="text-foreground">before showing any home.</strong> This is now the law in most states.</p>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">What the agreement must include</p>
                  <p className="text-xs mt-1">The specific services your agent will provide, the compensation amount (dollar amount or percentage — no open-ended "whatever the seller offers" language), the duration of the agreement, and how compensation will be handled if the seller doesn't offer it.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Your rights as a buyer</p>
                  <p className="text-xs mt-1">You have the right to negotiate the terms of this agreement. You can negotiate the commission percentage, the duration, and the geographic scope. You are not required to sign an agreement that locks you into terms you don't like. If an agent refuses to discuss the terms, find another agent.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Duration matters</p>
                  <p className="text-xs mt-1">Buyer rep agreements can be for a specific period (30 days, 90 days, or longer) or for a specific property. Be cautious about signing long-term exclusive agreements with agents you haven't worked with yet. Consider starting with a short-term or property-specific agreement to test the relationship.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Beware of vague compensation language</p>
                  <p className="text-xs mt-1">The agreement must state a specific compensation amount. Agreements that say "buyer's agent will receive whatever the seller offers" violate the new rules. If you see this language, the agreement does not comply with current requirements.</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Users} title="Understanding Agent Roles & Fiduciary Duty" iconClass="bg-primary/10">
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <p className="font-semibold text-foreground text-sm mb-2">Listing Agent</p>
                <p className="text-xs">Represents the <strong className="text-foreground">seller</strong>. Their fiduciary duty is to the seller — to get the highest price with the best terms. They work for the seller, not you (as a buyer).</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <p className="font-semibold text-foreground text-sm mb-2">Buyer's Agent</p>
                <p className="text-xs">Represents the <strong className="text-foreground">buyer</strong>. Their duty is to help you find the right home at the best price and terms. After the settlement, their compensation must be explicitly agreed upon in writing.</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <p className="font-semibold text-foreground text-sm mb-2">Dual Agent</p>
                <p className="text-xs"><strong className="text-foreground">Caution:</strong> When one agent represents both buyer and seller. The agent cannot fully advocate for either party. Legal in most states but requires written consent. Consider carefully whether this arrangement serves your interests.</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="font-semibold text-foreground mb-2">What fiduciary duty means</p>
              <p className="text-xs">An agent with a fiduciary duty to you must: act in your best interest (loyalty), follow your lawful instructions (obedience), disclose all material facts that affect your decision (disclosure), keep your confidential information private (confidentiality), use their skill and knowledge on your behalf (diligence), and account for all funds (accounting). If an agent violates these duties, you have legal recourse.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Info} title="Questions Every Consumer Should Ask Their Agent" iconClass="bg-primary/10">
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">Use these questions to evaluate any agent you work with. A professional agent will welcome them.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Who do you represent in this transaction — me, the seller, or both?",
                "What is your exact compensation, and who is paying it?",
                "Can I see the compensation agreement in writing before we proceed?",
                "How many homes similar to mine have you sold in the last 12 months?",
                "What is your list-to-sale price ratio? (How close to asking price do your listings actually sell for?)",
                "What is your average days-on-market for listings?",
                "Are you offering any buyer agent compensation on this listing? (Sellers asking their listing agent)",
                "What happens to my earnest money if I back out — and under what circumstances?",
                "Do you have any referral relationships with lenders, inspectors, or title companies? Are you compensated for those referrals?",
                "What is your cancellation policy if this relationship isn't working?",
              ].map((q, i) => (
                <div key={i} className="flex gap-2.5 items-start p-3 rounded-lg border border-border bg-muted/30">
                  <span className="text-primary font-semibold text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <section className="rounded-2xl border border-border bg-card p-6" aria-labelledby="official-sources-title">
          <h2 id="official-sources-title" className="font-serif text-2xl">Check the official sources</h2>
          <p className="text-sm text-muted-foreground mt-2">These links open the organizations responsible for the rules and consumer protections discussed above.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {[
              ["NAR: What the settlement means for homebuyers", "https://www.nar.realtor/the-facts/homebuyers-what-the-nar-settlement-means"],
              ["NAR: Written buyer agreements", "https://www.nar.realtor/the-facts/written-buyer-agreements-101"],
              ["Tennessee Real Estate Commission", "https://www.tn.gov/commerce/regboards/trec.html"],
              ["HUD: Fair-housing rights", "https://www.hud.gov/helping-americans/fair-housing-act-overview"],
            ].map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer" className="rounded-xl border border-border p-4 text-sm font-bold hover:border-primary/40 hover:bg-primary/5 flex items-start justify-between gap-3">{label}<ExternalLink className="h-4 w-4 shrink-0 text-primary" /></a>)}
          </div>
        </section>

        <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/10">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Important Disclaimer</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                This information is general education, not legal advice. Real-estate law, forms, deadlines, brokerage practices, and MLS requirements can vary and change. Confirm transaction-specific questions with your agent, closing professional, lender, or a licensed Tennessee real-estate attorney.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
