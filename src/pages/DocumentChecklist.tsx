import { useParams, Link } from "wouter";
import { useGetJourney, useListJourneyDocuments, useUpsertJourneyDocument, getListJourneyDocumentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, FileText, CheckCircle2, Circle, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type DocItem = { key: string; label: string; detail?: string };
type DocCategory = { name: string; docs: DocItem[] };

const BUYER_DOCS: DocCategory[] = [
  {
    name: "Pre-Approval & Financing",
    docs: [
      { key: "gov_id", label: "Government-issued photo ID", detail: "Passport or driver's license" },
      { key: "ssn", label: "Social Security number on hand", detail: "Required by all lenders" },
      { key: "w2_2yr", label: "Last 2 years of W-2 forms", detail: "From every employer" },
      { key: "tax_returns_2yr", label: "Last 2 years of federal tax returns", detail: "All pages, all schedules" },
      { key: "pay_stubs", label: "Last 30 days of pay stubs", detail: "Most recent from every job" },
      { key: "bank_statements", label: "Last 2–3 months of bank statements", detail: "All accounts, all pages" },
      { key: "employment_letter", label: "Employment verification letter", detail: "From HR or your employer" },
    ],
  },
  {
    name: "Special Situations",
    docs: [
      { key: "additional_income", label: "Additional income documentation", detail: "Rental, alimony, freelance, etc." },
      { key: "gift_letter", label: "Gift letter", detail: "Required if any down payment funds are gifted" },
      { key: "va_coe", label: "VA Certificate of Eligibility", detail: "VA loans only" },
    ],
  },
  {
    name: "During Your Search",
    docs: [
      { key: "wish_list", label: "Written must-have / nice-to-have list", detail: "Align with your agent before touring" },
      { key: "budget_range", label: "Confirmed purchase price range", detail: "Based on pre-approval letter" },
      { key: "agent_agreement", label: "Signed Buyer Representation Agreement", detail: "Required under 2024 NAR settlement rules" },
    ],
  },
  {
    name: "Under Contract",
    docs: [
      { key: "earnest_money", label: "Earnest money funds ready", detail: "Typically 1–3% of purchase price" },
      { key: "inspection_report", label: "Home inspection report received", detail: "Review with your agent before deadline" },
      { key: "insurance_quote", label: "Homeowner's insurance quote obtained", detail: "Lender requires proof before closing" },
    ],
  },
  {
    name: "Closing Day Checklist",
    docs: [
      { key: "closing_disclosure", label: "Closing Disclosure reviewed", detail: "Must be received 3 business days before closing" },
      { key: "cashiers_check", label: "Cashier's check or wire transfer confirmed", detail: "Exact amount from your closing disclosure" },
      { key: "final_walk_through", label: "Final walk-through completed", detail: "Verify repairs and condition before signing" },
      { key: "closing_id", label: "Photo ID for closing appointment", detail: "Same ID used for loan application" },
    ],
  },
];

const SELLER_DOCS: DocCategory[] = [
  {
    name: "Home & Title",
    docs: [
      { key: "property_deed", label: "Original property deed", detail: "Your name must match public records exactly" },
      { key: "title_report", label: "Title report / title search ordered", detail: "Identifies any liens or encumbrances" },
      { key: "survey", label: "Survey or plot map", detail: "Shows exact boundaries of the property" },
      { key: "hoa_docs", label: "HOA documents and recent meeting minutes", detail: "Required disclosure; buyers may review" },
    ],
  },
  {
    name: "Financial Records",
    docs: [
      { key: "mortgage_statement", label: "Current mortgage statement", detail: "Shows outstanding balance" },
      { key: "payoff_request", label: "Mortgage payoff request from lender", detail: "Amount valid for 30 days typically" },
      { key: "property_tax", label: "Last 2 years of property tax statements", detail: "Shows any outstanding tax liens" },
      { key: "home_warranty", label: "Home warranty information", detail: "Transferable warranty is a selling point" },
    ],
  },
  {
    name: "Legally Required Disclosures",
    docs: [
      { key: "seller_disclosure", label: "Seller disclosure form completed", detail: "Required in most states; disclose known defects" },
      { key: "lead_paint", label: "Lead paint disclosure", detail: "Required for homes built before 1978" },
      { key: "natural_hazard", label: "Natural hazard disclosure", detail: "Required in many states — floods, earthquakes, fire" },
    ],
  },
  {
    name: "Preparing to List",
    docs: [
      { key: "repair_list", label: "List of completed repairs and improvements", detail: "Dates, contractors, and costs" },
      { key: "utility_bills", label: "12 months of utility bills", detail: "Buyers often request average monthly costs" },
      { key: "appliance_manuals", label: "Appliance manuals and warranties", detail: "Leave for the buyer at closing" },
      { key: "listing_agreement", label: "Signed listing agreement with agent", detail: "Confirms commission and listing terms" },
    ],
  },
  {
    name: "Under Contract / Closing",
    docs: [
      { key: "purchase_agreement", label: "Signed purchase agreement reviewed", detail: "Understand all contingencies and deadlines" },
      { key: "buyers_preapproval", label: "Buyer's pre-approval letter verified", detail: "Confirm with buyer's lender if unsure" },
      { key: "net_sheet", label: "Seller's net sheet reviewed", detail: "Know your exact take-home before closing day" },
    ],
  },
];

const BOTH_DOCS: DocCategory[] = [
  ...BUYER_DOCS,
  {
    name: "Selling Your Current Home",
    docs: [
      { key: "property_deed", label: "Original property deed", detail: "Your name must match public records exactly" },
      { key: "title_report", label: "Title report ordered", detail: "Identifies any liens or encumbrances" },
      { key: "seller_disclosure", label: "Seller disclosure form completed", detail: "Required in most states" },
      { key: "lead_paint", label: "Lead paint disclosure", detail: "Required for homes built before 1978" },
      { key: "payoff_request", label: "Mortgage payoff request from lender", detail: "Needed to calculate net proceeds" },
      { key: "net_sheet", label: "Seller's net sheet reviewed", detail: "Know what proceeds fund your new purchase" },
    ],
  },
  {
    name: "Coordinating Both Transactions",
    docs: [
      { key: "bridge_loan_docs", label: "Bridge loan or HELOC documentation", detail: "If using current equity for down payment" },
      { key: "contingency_language", label: "Sale or purchase contingency language reviewed", detail: "Understand your exit options on both contracts" },
      { key: "closing_date_alignment", label: "Both closing dates confirmed and aligned", detail: "Coordinate with both title companies" },
      { key: "moving_plan", label: "Moving plan and temporary housing arranged", detail: "In case closings don't happen same day" },
    ],
  },
];

function getDocList(type: string): DocCategory[] {
  if (type === "seller") return SELLER_DOCS;
  if (type === "both") return BOTH_DOCS;
  return BUYER_DOCS;
}

export default function DocumentChecklist() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);
  const queryClient = useQueryClient();

  const { data: journey, isLoading: loadingJourney } = useGetJourney(id, {
    query: { enabled: !!id, queryKey: ["getJourney", id] },
  });

  const { data: savedDocs = [], isLoading: loadingDocs } = useListJourneyDocuments(id, {
    query: { enabled: !!id, queryKey: getListJourneyDocumentsQueryKey(id) },
  });

  const upsertDoc = useUpsertJourneyDocument();

  const checkedKeys = new Set(savedDocs.filter((d) => d.isChecked).map((d) => d.docKey));

  const handleToggle = (docKey: string) => {
    const nowChecked = !checkedKeys.has(docKey);
    upsertDoc.mutate(
      { id, docKey, data: { isChecked: nowChecked } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListJourneyDocumentsQueryKey(id) });
        },
      }
    );
  };

  if (loadingJourney || loadingDocs) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-64" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-40" />
            {[1, 2, 3].map((j) => <Skeleton key={j} className="h-14 w-full rounded-xl" />)}
          </div>
        ))}
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground text-lg">Journey not found.</p>
        <Link href="/"><Button variant="outline" className="mt-4">Back to Home</Button></Link>
      </div>
    );
  }

  const categories = getDocList(journey.type);
  const allDocs = categories.flatMap((c) => c.docs);
  const totalCount = allDocs.length;
  const checkedCount = allDocs.filter((d) => checkedKeys.has(d.key)).length;
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link
        href={`/journey/${id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Journey
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-foreground">Document Checklist</h1>
            <p className="text-sm text-muted-foreground">
              {journey.userName}'s {journey.type === "buyer" ? "Buying" : journey.type === "seller" ? "Selling" : "Buying & Selling"} Journey
            </p>
          </div>
        </div>

        <div className="mt-6 p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">
              {checkedCount} of {totalCount} documents gathered
            </span>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: pct === 100 ? "hsl(var(--primary))" : "hsl(var(--accent))" }}
            >
              {pct}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background: pct === 100
                  ? "hsl(var(--primary))"
                  : "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
              }}
            />
          </div>
          {pct === 100 && (
            <p className="mt-3 text-sm font-medium text-primary flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              All documents gathered — you're ready to proceed!
            </p>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((category) => {
          const catChecked = category.docs.filter((d) => checkedKeys.has(d.key)).length;
          const catTotal = category.docs.length;
          return (
            <div key={category.name}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-base text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {category.name}
                </h2>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  {catChecked}/{catTotal}
                </span>
              </div>

              <div className="space-y-2">
                {category.docs.map((doc) => {
                  const isChecked = checkedKeys.has(doc.key);
                  return (
                    <button
                      key={doc.key}
                      onClick={() => handleToggle(doc.key)}
                      className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 group
                        ${isChecked
                          ? "bg-primary/5 border-primary/20 hover:bg-primary/8"
                          : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                        }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isChecked ? (
                          <CheckCircle2 className="h-5 w-5 text-primary transition-transform group-active:scale-90" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-snug transition-colors ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {doc.label}
                        </p>
                        {doc.detail && (
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{doc.detail}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-5 rounded-2xl bg-amber-50 border border-amber-200">
        <p className="text-sm font-semibold text-amber-900 mb-1">Pro tip</p>
        <p className="text-sm text-amber-800 leading-relaxed">
          Gather these documents early — lenders and title companies move fast once an offer is accepted. Having everything
          organized in one folder (physical or digital) can save days off your closing timeline.
        </p>
      </div>
    </div>
  );
}
