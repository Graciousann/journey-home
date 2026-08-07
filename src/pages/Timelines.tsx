import { Clock, CheckCircle2, AlertTriangle, Calendar, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

type TimelineEvent = {
  day: string;
  label: string;
  detail: string;
  type?: "milestone" | "deadline" | "action" | "warning";
};

const fourWeekBuyer: TimelineEvent[] = [
  { day: "Days 1–2", label: "Accepted Offer", detail: "Purchase agreement fully executed. Earnest money delivered to escrow. 28-day clock starts.", type: "milestone" },
  { day: "Days 2–5", label: "Inspection Scheduled & Completed", detail: "In a 4-week close, you must move fast. Schedule your inspector immediately — don't wait. Inspection should be complete by Day 5.", type: "deadline" },
  { day: "Days 4–6", label: "Loan Application Formally Submitted", detail: "Your lender submits your full loan file to underwriting. You'll receive your Loan Estimate within 3 business days.", type: "action" },
  { day: "Days 5–7", label: "Inspection Report & Negotiation", detail: "Review your report and submit repair requests or negotiate credits immediately. In a 4-week close, there is no time for extended back-and-forth.", type: "action" },
  { day: "Days 6–10", label: "Appraisal Ordered & Scheduled", detail: "Your lender orders the appraisal. Rush appraisals are sometimes available at extra cost (~$200–400). Appraiser visits property.", type: "action" },
  { day: "Days 10–14", label: "Appraisal Report Received", detail: "Appraisal must come in at or above purchase price. If it comes in low, you have 2–3 days to renegotiate — no time for extended standoffs.", type: "deadline" },
  { day: "Days 12–20", label: "Underwriting Review", detail: "Underwriter reviews all documents. Expect requests for additional documentation. Respond within hours — not days. Delays here collapse the closing.", type: "warning" },
  { day: "Day 18–22", label: "Clear to Close (CTC) Issued", detail: "The 'green light' from underwriting. If CTC arrives after Day 22, a 4-week close becomes very difficult. Start coordinating closing logistics now.", type: "milestone" },
  { day: "Day 25", label: "Closing Disclosure Received (Required: Day 25 at latest)", detail: "By law, you must receive your Closing Disclosure at least 3 business days before closing. If closing is Day 28, you must have the CD by Day 25.", type: "deadline" },
  { day: "Day 27", label: "Final Walk-Through", detail: "Verify the home's condition is unchanged from your contract date. Confirm all agreed-upon repairs are complete.", type: "action" },
  { day: "Day 28", label: "Closing Day", detail: "Sign all documents, wire your closing funds (verify wire instructions by phone), receive keys.", type: "milestone" },
];

const sixWeekBuyer: TimelineEvent[] = [
  { day: "Days 1–2", label: "Accepted Offer", detail: "Purchase agreement fully executed. Earnest money delivered to escrow within 3 business days. 42-day clock starts.", type: "milestone" },
  { day: "Days 3–7", label: "Schedule & Complete Inspection", detail: "You have more breathing room — but don't delay. Book your inspector by Day 3. Have your inspection completed by Day 7.", type: "action" },
  { day: "Days 3–5", label: "Formal Loan Application Submitted", detail: "Lender submits your file to underwriting. Loan Estimate issued within 3 business days. Review it carefully.", type: "action" },
  { day: "Days 7–12", label: "Inspection Negotiation", detail: "Review your report and negotiate repair requests. With 6 weeks, you have time for a more thorough negotiation — but don't stretch it beyond Day 12.", type: "action" },
  { day: "Days 7–14", label: "Appraisal Ordered & Completed", detail: "Lender orders appraisal. Standard appraisal timeline (no rush fee) fits comfortably in a 6-week close. Expect the report by Day 14–18.", type: "action" },
  { day: "Days 14–28", label: "Underwriting Review", detail: "Deep review of your complete loan file. Respond to all document requests within 24 hours. The extra time in a 6-week close gives underwriting room to breathe.", type: "action" },
  { day: "Days 28–32", label: "Clear to Close", detail: "Most 6-week closings receive their CTC around Day 28–32, leaving comfortable time for the mandatory CD waiting period.", type: "milestone" },
  { day: "Day 36 (at latest)", label: "Closing Disclosure Received", detail: "Must be received at least 3 business days before closing. With a Day 42 close, CD must arrive no later than Day 39 (3 business days prior).", type: "deadline" },
  { day: "Day 41", label: "Final Walk-Through", detail: "Verify home condition. Confirm all agreed repairs are completed with receipts. Check all appliances and systems.", type: "action" },
  { day: "Day 42", label: "Closing Day", detail: "Sign documents, wire funds (always verify by phone), receive keys and celebrate.", type: "milestone" },
];

const fourWeekSeller: TimelineEvent[] = [
  { day: "Days 1–2", label: "Contract Fully Executed", detail: "Both parties have signed. Notify your moving company and begin planning your move-out.", type: "milestone" },
  { day: "Days 3–7", label: "Buyer's Inspection", detail: "Keep the home accessible and in clean condition. All utilities must be on. You will leave the property during the inspection.", type: "action" },
  { day: "Days 5–8", label: "Respond to Repair Request", detail: "In a 4-week close, repair negotiations must resolve within 2–3 days. Delays here compress everything downstream.", type: "deadline" },
  { day: "Days 8–14", label: "Complete Agreed Repairs", detail: "Hire licensed contractors immediately. In 4 weeks, you cannot afford to wait on repairs. Keep all receipts for closing.", type: "action" },
  { day: "Days 7–14", label: "Buyer's Appraisal Occurs", detail: "The buyer's lender sends an appraiser. Keep home in showing condition. Appraiser typically visits within 10 days of contract.", type: "action" },
  { day: "Days 15–20", label: "Begin Packing & Vacating", detail: "Start moving your belongings. Plan to be fully out by Day 26 at the latest — the buyer will do a final walk-through before closing.", type: "action" },
  { day: "Day 20–25", label: "Buyer Reaches Clear to Close", detail: "Watch for updates from your agent. If the buyer's lender is delayed, your closing may be at risk. Keep contractors on standby in case additional repairs are requested.", type: "warning" },
  { day: "Day 25–26", label: "Buyer's Final Walk-Through", detail: "The buyer verifies the home is in agreed condition. Any issues found here can delay closing. Ensure home is broom-clean and all agreed items remain.", type: "deadline" },
  { day: "Day 28", label: "Closing Day", detail: "Bring your ID and all keys. Sign documents (often takes 30–60 minutes for sellers). Receive your proceeds via wire or check.", type: "milestone" },
];

const sixWeekSeller: TimelineEvent[] = [
  { day: "Days 1–2", label: "Contract Fully Executed", detail: "Both parties have signed. Confirm your closing date and begin planning your move.", type: "milestone" },
  { day: "Days 4–10", label: "Buyer's Inspection Window", detail: "Standard contracts allow 7–10 days for inspections. Keep the home accessible and clean. Attend to any requested repairs quickly.", type: "action" },
  { day: "Days 10–14", label: "Repair Negotiation Resolved", detail: "You have more time to negotiate repairs thoughtfully. Aim to resolve by Day 14 to keep the deal on track.", type: "action" },
  { day: "Days 14–21", label: "Complete Agreed Repairs", detail: "Hire licensed contractors. Document all repairs with receipts. Standard 6-week timelines allow for contractor availability without rush fees.", type: "action" },
  { day: "Days 7–21", label: "Buyer's Appraisal Process", detail: "Buyer's lender orders and completes appraisal. Plenty of time in a 6-week close for the appraisal to be completed and any low-appraisal negotiations to occur.", type: "action" },
  { day: "Days 21–35", label: "Move Out Preparation", detail: "Begin your move in stages. Plan to be fully out of the home by Day 40. Don't remove any fixtures that are supposed to convey.", type: "action" },
  { day: "Days 28–35", label: "Buyer's Loan Underwriting", detail: "Monitor via your agent. If the buyer's lender requests last-minute documentation, be patient — but ensure your agent is watching deadlines.", type: "action" },
  { day: "Day 38–40", label: "Home Fully Vacated", detail: "The property should be empty and in broom-clean condition. Leave all agreed items: appliances, manuals, extra keys, garage openers.", type: "deadline" },
  { day: "Day 41", label: "Buyer's Final Walk-Through", detail: "Buyer verifies condition. Home should be clean, empty of personal property, and all repairs completed.", type: "deadline" },
  { day: "Day 42", label: "Closing Day", detail: "Bring ID and all keys. Sign closing documents. Receive your net proceeds.", type: "milestone" },
];

const bothTimeline: TimelineEvent[] = [
  { day: "Weeks before listing", label: "Get Pre-Approved & Assess Your Sale Value", detail: "Before you list your home, know your buying power and your expected net proceeds from the sale. Both numbers shape your strategy.", type: "action" },
  { day: "Weeks 1–2", label: "List Your Home", detail: "Ideally, you want your home to go under contract before you make an offer on a new home. The more certain your sale, the stronger your position as a buyer.", type: "action" },
  { day: "Weeks 1–3", label: "Active House Hunting", detail: "You can tour homes while your property is listed — but hold back from making offers until you have strong showing activity or offers on your home.", type: "action" },
  { day: "Week 2–4", label: "Your Home Goes Under Contract", detail: "Once your home is under contract with a qualified buyer, you are in the strongest position to make an offer on your next home. Notify your buyer's agent immediately.", type: "milestone" },
  { day: "Week 3–5", label: "Make an Offer on Your New Home", detail: "Now that your sale is under contract, many sellers will accept a purchase contingent on your sale closing. Align your proposed closing dates on both transactions (buy and sell same day or sell 1–3 days first).", type: "action" },
  { day: "Week 4–6", label: "Both Properties Under Contract", detail: "You're managing two sets of deadlines simultaneously. Create a master timeline. Both agents should be in communication. Consider a 'double closing' coordination call with both title companies.", type: "milestone" },
  { day: "Weeks 4–7", label: "Inspections, Appraisals, Underwriting (Both Sides)", detail: "Respond immediately to all requests on both transactions. A delay in one can ripple to the other. Dedicate 1 hour per day to transaction coordination during this period.", type: "warning" },
  { day: "Week 5–7", label: "Negotiate Rent-Back if Needed", detail: "If your sale closes before your purchase, negotiate a rent-back (leaseback) with your buyer — up to 60 days typically allowed. This buys you time to close on your purchase without rushing.", type: "action" },
  { day: "Week 6–8", label: "Both Clear to Close", detail: "Both lenders have issued Clear to Close. Confirm closing dates are aligned. Confirm with both title companies that proceeds from your sale can be transferred to your purchase.", type: "milestone" },
  { day: "Day Before Closing", label: "Final Walk-Throughs on Both Homes", detail: "You'll walk through your purchase (as buyer) and may have buyers walking through your sale. Ensure both properties are in agreed condition.", type: "deadline" },
  { day: "Closing Day AM", label: "Sell Your Current Home (First)", detail: "Close your sale in the morning. Proceeds wire to your escrow account or directly to your purchase title company. Hand over keys.", type: "milestone" },
  { day: "Closing Day PM", label: "Buy Your New Home", detail: "Your sale proceeds fund your purchase. Sign your mortgage documents, pay any remaining closing costs, and receive keys to your new home.", type: "milestone" },
];

const typeConfig = {
  milestone: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10 border-primary/30" },
  deadline: { icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30" },
  action: { icon: Calendar, color: "text-foreground", bg: "bg-card border-border" },
  warning: { icon: Zap, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30" },
};

function TimelineList({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-3">
      {events.map((event, i) => {
        const t = typeConfig[event.type ?? "action"];
        const Icon = t.icon;
        return (
          <div key={i} className={`flex gap-4 p-4 rounded-xl border ${t.bg}`}>
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <Icon className={`h-5 w-5 ${t.color}`} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground">{event.day}</span>
                <span className="font-medium text-sm text-foreground">{event.label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{event.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type TabId = "4wk-buyer" | "6wk-buyer" | "4wk-seller" | "6wk-seller" | "both";

const tabs: { id: TabId; label: string }[] = [
  { id: "4wk-buyer", label: "4-Week Buyer" },
  { id: "6wk-buyer", label: "6-Week Buyer" },
  { id: "4wk-seller", label: "4-Week Seller" },
  { id: "6wk-seller", label: "6-Week Seller" },
  { id: "both", label: "Buy & Sell Together" },
];

const tabData: Record<TabId, { events: TimelineEvent[]; headline: string; description: string }> = {
  "4wk-buyer": {
    events: fourWeekBuyer,
    headline: "4-Week Buyer Close",
    description: "Very aggressive — requires a pre-approved buyer, a cooperative seller, a fast appraiser, and a responsive lender. One delay anywhere can push the closing. Best for cash-adjacent buyers or very simple transactions.",
  },
  "6wk-buyer": {
    events: sixWeekBuyer,
    headline: "6-Week Buyer Close",
    description: "The standard for most financed transactions. 42 days gives adequate time for all parties to complete their obligations without rushing. Most buyers and sellers should plan for 6 weeks.",
  },
  "4wk-seller": {
    events: fourWeekSeller,
    headline: "4-Week Seller Close",
    description: "Demanding on the seller's side too. Repairs must be completed quickly, the home must be vacated on time, and any friction in the buyer's loan process can threaten the close date.",
  },
  "6wk-seller": {
    events: sixWeekSeller,
    headline: "6-Week Seller Close",
    description: "Comfortable for most sellers. You have adequate time to coordinate your move, complete repairs, and respond to any issues that arise in the buyer's loan or inspection process.",
  },
  both: {
    events: bothTimeline,
    headline: "Buying & Selling Simultaneously",
    description: "The most complex timeline. The goal is to have both transactions close the same day or sell 1–3 days before buying. Rent-back arrangements can buy extra flexibility. This requires exceptional coordination between both agents, both lenders, and both title companies.",
  },
};

export default function Timelines() {
  const [activeTab, setActiveTab] = useState<TabId>("6wk-buyer");
  const current = tabData[activeTab];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="h-7 w-7 text-primary" />
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">Closing Timelines</h1>
        </div>
        <p className="text-muted-foreground text-lg ml-10">
          A detailed week-by-week breakdown of what happens — and when — for every type of closing.
        </p>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-card"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-border bg-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-xl">{current.headline}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
        </CardContent>
      </Card>

      <div className="mb-6 flex flex-wrap gap-3 text-xs">
        {Object.entries(typeConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <div key={type} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg}`}>
              <Icon className={`h-3.5 w-3.5 ${config.color}`} />
              <span className="font-medium capitalize text-muted-foreground">{type === "action" ? "Required Action" : type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </div>
          );
        })}
      </div>

      <TimelineList events={current.events} />

      <div className="mt-8 p-5 rounded-2xl border border-primary/20 bg-primary/5">
        <p className="text-xs font-semibold text-primary mb-2">Critical Rule: The 3-Business-Day Closing Disclosure Waiting Period</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Federal law (TRID) requires that you receive your Closing Disclosure at least <strong className="text-foreground">3 business days</strong> before closing. If the CD is delayed, your closing must be delayed — even if everything else is ready. This is the most common cause of last-minute closing day changes. On a 28-day close, your CD must be in your hands by Day 25 (assuming no federal holidays). If your lender misses this window, your closing date moves. There are no exceptions.
        </p>
      </div>
    </div>
  );
}
