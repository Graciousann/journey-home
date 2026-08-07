import { useId, useState } from "react";
import { Calculator, DollarSign, Home, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

function parseDollar(val: string) {
  return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
}

function CurrencyInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
        <Input
          id={id}
          className="pl-7 bg-background"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          inputMode="decimal"
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
      </div>
      {hint && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ResultRow({ label, value, highlight, note }: { label: string; value: string; highlight?: boolean; note?: string }) {
  return (
    <div className={`flex justify-between items-start py-2.5 border-b last:border-0 ${highlight ? "font-semibold" : ""}`}>
      <div>
        <span className={highlight ? "text-foreground text-base" : "text-muted-foreground text-sm"}>{label}</span>
        {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
      </div>
      <span className={highlight ? "text-primary text-lg" : "text-foreground text-sm"}>{value}</span>
    </div>
  );
}

function AffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState("100000");
  const [monthlyDebts, setMonthlyDebts] = useState("500");
  const [downPayment, setDownPayment] = useState("60000");
  const [interestRate, setInterestRate] = useState("7.0");
  const [termYears, setTermYears] = useState(30);

  const income = parseDollar(annualIncome);
  const debts = parseDollar(monthlyDebts);
  const down = parseDollar(downPayment);
  const rate = parseFloat(interestRate) || 7;
  const monthlyIncome = income / 12;

  const maxHousingPayment28 = monthlyIncome * 0.28;
  const maxTotalDebt36 = monthlyIncome * 0.36;
  const maxHousingFromTDI = maxTotalDebt36 - debts;
  const maxMonthlyHousing = Math.min(maxHousingPayment28, maxHousingFromTDI);

  const monthlyRate = rate / 100 / 12;
  const n = termYears * 12;
  const maxLoanFromPayment =
    monthlyRate > 0
      ? (maxMonthlyHousing / (monthlyRate * Math.pow(1 + monthlyRate, n))) * (Math.pow(1 + monthlyRate, n) - 1)
      : maxMonthlyHousing * n;

  const estimatedTaxInsurance = maxLoanFromPayment * 0.0025;
  const maxLoanAdjusted = maxLoanFromPayment - estimatedTaxInsurance;
  const maxHomePrice = maxLoanAdjusted + down;

  const pmi = down / maxHomePrice < 0.2 ? (maxLoanAdjusted * 0.0075) / 12 : 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 font-serif text-xl">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          Mortgage Affordability
        </CardTitle>
        <CardDescription>Estimate how much home you can afford based on the standard 28/36 rule.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <CurrencyInput label="Annual Household Income" value={annualIncome} onChange={setAnnualIncome} hint="Before taxes (gross)" />
          <CurrencyInput label="Monthly Debt Payments" value={monthlyDebts} onChange={setMonthlyDebts} hint="Car loans, student loans, credit cards, etc." />
          <CurrencyInput label="Down Payment Available" value={downPayment} onChange={setDownPayment} hint="Cash available to put down" />
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Interest Rate: {rate.toFixed(1)}%</Label>
            <Slider
              aria-label="Interest rate"
              min={3}
              max={12}
              step={0.1}
              value={[rate]}
              onValueChange={([v]) => setInterestRate(v.toFixed(1))}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3%</span><span>12%</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {[15, 20, 30].map((y) => (
            <button
              key={y}
              onClick={() => setTermYears(y)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                termYears === y ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40 text-muted-foreground"
              }`}
            >
              {y}-year
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1" aria-live="polite">
          <ResultRow label="Max monthly housing payment" value={formatCurrency(maxMonthlyHousing)} note="Includes P&I, taxes, insurance (28% of income)" />
          {pmi > 0 && <ResultRow label="Estimated monthly PMI" value={formatCurrency(pmi)} note="Applies when down payment < 20%" />}
          <ResultRow label="Maximum loan amount" value={formatCurrency(Math.max(0, maxLoanAdjusted))} />
          <ResultRow label="Down payment" value={formatCurrency(down)} />
          <ResultRow label="Maximum home price" value={formatCurrency(Math.max(0, maxHomePrice))} highlight />
        </div>

        <p className="text-xs text-muted-foreground">
          Based on the 28/36 rule: housing costs should not exceed 28% of gross income; total debt should not exceed 36%. This is an estimate — actual loan qualification depends on credit score, lender requirements, and other factors.
        </p>
      </CardContent>
    </Card>
  );
}

function BuyerNetSheet() {
  const [purchasePrice, setPurchasePrice] = useState("450000");
  const [downPct, setDownPct] = useState(10);
  const [interestRate, setInterestRate] = useState("7.0");
  const [termYears, setTermYears] = useState(30);

  const price = parseDollar(purchasePrice);
  const down = price * (downPct / 100);
  const loanAmount = price - down;
  const rate = parseFloat(interestRate) || 7;
  const monthlyRate = rate / 100 / 12;
  const n = termYears * 12;
  const monthlyPI =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : loanAmount / n;

  const originationFee = loanAmount * 0.01;
  const appraisal = 600;
  const titleInsurance = price * 0.004;
  const escrowFees = 800;
  const prepaidInterest = loanAmount * (rate / 100 / 365) * 15;
  const insuranceEscrow = (price * 0.006) / 12 * 2;
  const taxEscrow = (price * 0.012) / 12 * 2;
  const miscFees = 500;
  const pmi = downPct < 20 ? loanAmount * 0.0075 / 12 : 0;

  const totalClosingCosts = originationFee + appraisal + titleInsurance + escrowFees + prepaidInterest + insuranceEscrow + taxEscrow + miscFees;
  const totalCashNeeded = down + totalClosingCosts;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 font-serif text-xl">
          <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Home className="h-5 w-5 text-blue-700 dark:text-blue-400" />
          </div>
          Buyer's Closing Cost Estimate
        </CardTitle>
        <CardDescription>Estimate the total cash you'll need to bring to closing when buying a home.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <CurrencyInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} />
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Down Payment: {downPct}% ({formatCurrency(down)})</Label>
            <Slider aria-label="Down payment percentage" min={3} max={30} step={1} value={[downPct]} onValueChange={([v]) => setDownPct(v)} className="mt-3" />
            <div className="flex justify-between text-xs text-muted-foreground"><span>3%</span><span>30%</span></div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Interest Rate: {rate.toFixed(1)}%</Label>
            <Slider aria-label="Interest rate" min={3} max={12} step={0.1} value={[rate]} onValueChange={([v]) => setInterestRate(v.toFixed(1))} className="mt-3" />
            <div className="flex justify-between text-xs text-muted-foreground"><span>3%</span><span>12%</span></div>
          </div>
          <div className="flex gap-3 items-end pb-1">
            {[15, 20, 30].map((y) => (
              <button key={y} onClick={() => setTermYears(y)} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${termYears === y ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40 text-muted-foreground"}`}>
                {y}-yr
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1" aria-live="polite">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Monthly Payment Estimate</p>
          <ResultRow label="Principal & Interest" value={formatCurrency(monthlyPI)} />
          {pmi > 0 && <ResultRow label="PMI (until 20% equity)" value={formatCurrency(pmi)} note="Removed when you reach 20% equity" />}
          <ResultRow label="Est. Taxes & Insurance" value={formatCurrency((price * 0.018) / 12)} note="Rough estimate — varies by location" />
          <ResultRow label="Total Monthly Est." value={formatCurrency(monthlyPI + pmi + (price * 0.018 / 12))} highlight />
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Closing Costs Breakdown</p>
          <ResultRow label="Down payment" value={formatCurrency(down)} />
          <ResultRow label="Loan origination fee (~1%)" value={formatCurrency(originationFee)} />
          <ResultRow label="Appraisal" value={formatCurrency(appraisal)} />
          <ResultRow label="Title insurance & search" value={formatCurrency(titleInsurance)} />
          <ResultRow label="Escrow / settlement fees" value={formatCurrency(escrowFees)} />
          <ResultRow label="Prepaid interest (~15 days)" value={formatCurrency(prepaidInterest)} />
          <ResultRow label="Homeowner's insurance escrow" value={formatCurrency(insuranceEscrow)} />
          <ResultRow label="Property tax escrow" value={formatCurrency(taxEscrow)} />
          <ResultRow label="Misc. recording & fees" value={formatCurrency(miscFees)} />
          <div className="border-t mt-2 pt-2">
            <ResultRow label="Total cash needed to close" value={formatCurrency(totalCashNeeded)} highlight />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Estimates only. Actual closing costs vary by lender, state, and transaction. Request a Loan Estimate from your lender for official figures. Closing costs typically range from 2–5% of the purchase price.
        </p>
      </CardContent>
    </Card>
  );
}

function SellerNetSheet() {
  const [salePrice, setSalePrice] = useState("500000");
  const [mortgageBalance, setMortgageBalance] = useState("280000");
  const [agentCommission, setAgentCommission] = useState("5.0");
  const [repairs, setRepairs] = useState("5000");
  const [otherCredits, setOtherCredits] = useState("0");

  const price = parseDollar(salePrice);
  const mortgage = parseDollar(mortgageBalance);
  const commissionPct = parseFloat(agentCommission) || 5;
  const repairCosts = parseDollar(repairs);
  const credits = parseDollar(otherCredits);

  const commissionAmount = price * (commissionPct / 100);
  const titleFees = price * 0.004;
  const escrowFees = 900;
  const transferTaxes = price * 0.002;
  const prorationBuffer = (price * 0.012) / 12;
  const miscFees = 300;

  const totalClosingCosts = commissionAmount + titleFees + escrowFees + transferTaxes + prorationBuffer + repairCosts + credits + miscFees;
  const netProceeds = price - mortgage - totalClosingCosts;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 font-serif text-xl">
          <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-accent" />
          </div>
          Seller's Net Sheet
        </CardTitle>
        <CardDescription>Estimate your net proceeds after paying off your mortgage and all selling costs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <CurrencyInput label="Expected Sale Price" value={salePrice} onChange={setSalePrice} />
          <CurrencyInput label="Mortgage Balance Owed" value={mortgageBalance} onChange={setMortgageBalance} hint="Call your lender for exact payoff amount" />
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Agent Commission: {agentCommission}%</Label>
            <Slider aria-label="Agent commission percentage" min={0} max={8} step={0.25} value={[parseFloat(agentCommission) || 5]} onValueChange={([v]) => setAgentCommission(v.toFixed(2))} className="mt-3" />
            <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span>8%</span></div>
          </div>
          <CurrencyInput label="Repair / Concession Costs" value={repairs} onChange={setRepairs} hint="Buyer-requested repairs or credits" />
          <CurrencyInput label="Other Buyer Credits" value={otherCredits} onChange={setOtherCredits} hint="Closing cost assistance offered to buyer" />
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1" aria-live="polite">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Net Proceeds Breakdown</p>
          <ResultRow label="Sale price" value={formatCurrency(price)} />
          <div className="border-t my-2" />
          <ResultRow label={`Agent commission (${agentCommission}%)`} value={`— ${formatCurrency(commissionAmount)}`} note="Post-NAR settlement: negotiable, may cover buyer's agent compensation" />
          <ResultRow label="Title insurance & search" value={`— ${formatCurrency(titleFees)}`} />
          <ResultRow label="Escrow / settlement fees" value={`— ${formatCurrency(escrowFees)}`} />
          <ResultRow label="Transfer taxes" value={`— ${formatCurrency(transferTaxes)}`} />
          <ResultRow label="Property tax proration" value={`— ${formatCurrency(prorationBuffer)}`} note="Estimated" />
          <ResultRow label="Repairs & concessions" value={`— ${formatCurrency(repairCosts + credits)}`} />
          <ResultRow label="Miscellaneous fees" value={`— ${formatCurrency(miscFees)}`} />
          <ResultRow label="Mortgage payoff" value={`— ${formatCurrency(mortgage)}`} />
          <div className="border-t mt-2 pt-2">
            <ResultRow
              label="Estimated net proceeds"
              value={netProceeds >= 0 ? formatCurrency(netProceeds) : `(${formatCurrency(Math.abs(netProceeds))} short)`}
              highlight
            />
          </div>
        </div>

        {netProceeds < 0 && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-4">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Short sale situation</p>
            <p className="text-xs text-red-600 dark:text-red-300">
              Your estimated costs exceed the sale price. You may need to bring cash to closing or discuss a short sale with your lender. Consult a real estate attorney.
            </p>
          </div>
        )}

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
          <p className="text-xs font-semibold text-primary mb-1">NAR Commission Note</p>
          <p className="text-xs text-muted-foreground">
            After the 2024 NAR settlement, sellers are no longer required to offer buyer agent compensation through the MLS. Commissions are fully negotiable. Some sellers pay only their listing agent's commission; others still offer buyer agent compensation to attract more offers. Discuss your strategy with your agent.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Estimates only. Your actual net proceeds will differ. Get an official net sheet from your listing agent and confirm your mortgage payoff balance with your lender.
        </p>
      </CardContent>
    </Card>
  );
}

export default function Calculators() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <DollarSign className="h-7 w-7 text-primary" />
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">Calculators</h1>
        </div>
        <p className="text-muted-foreground text-lg ml-10">
          Run the numbers before making any decisions. All estimates — bring actual figures to your agent and lender.
        </p>
      </div>

      <div className="space-y-8">
        <AffordabilityCalculator />
        <BuyerNetSheet />
        <SellerNetSheet />
      </div>
    </div>
  );
}
