import { useMutation, useQuery } from "@tanstack/react-query";
import { stepContent } from "./step-content";

type JourneyType = "buyer" | "seller" | "both";
type StepStatus = "not_started" | "in_progress" | "completed";
type Journey = { id: number; userName: string; type: JourneyType; createdAt: string; currentStep: number };
type Step = { id: number; journeyId: number; stepNumber: number; title: string; status: StepStatus; completedAt: string | null };
type Note = { id: number; journeyId: number; stepNumber: number; content: string; createdAt: string };
type DocumentState = { docKey: string; isChecked: boolean };
type Store = { journeys: Journey[]; steps: Step[]; notes: Note[]; documents: Record<string, DocumentState[]> };

const KEY = "home-journey-v1";
const emptyStore = (): Store => ({ journeys: [], steps: [], notes: [], documents: {} });
const read = (): Store => {
  if (typeof window === "undefined") return emptyStore();
  try { return JSON.parse(localStorage.getItem(KEY) || "null") || emptyStore(); } catch { return emptyStore(); }
};
const write = (store: Store) => localStorage.setItem(KEY, JSON.stringify(store));
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((item) => item.id)) + 1;
const done = <T,>(value: T) => Promise.resolve(value);
const isEnabled = (options?: any) => options?.query?.enabled ?? true;

export const getListJourneysQueryKey = () => ["journeys"];
export const getListJourneyStepsQueryKey = (id: number) => ["journey", id, "steps"];
export const getGetJourneyProgressQueryKey = (id: number) => ["journey", id, "progress"];
export const getGetJourneyStepQueryKey = (id: number, step: number) => ["journey", id, "step", step];
export const getListStepNotesQueryKey = (id: number, step: number) => ["journey", id, "step", step, "notes"];
export const getListJourneyDocumentsQueryKey = (id: number) => ["journey", id, "documents"];

export const useListJourneys = () => useQuery({ queryKey: getListJourneysQueryKey(), queryFn: () => done(read().journeys) });
export const useCreateJourney = () => useMutation({ mutationFn: ({ data }: { data: { userName: string; type: JourneyType } }) => {
  const store = read();
  const journey: Journey = { id: nextId(store.journeys), userName: data.userName.trim(), type: data.type, createdAt: new Date().toISOString(), currentStep: 1 };
  store.journeys.push(journey);
  const content = stepContent[data.type];
  store.steps.push(...Object.entries(content).map(([number, item]) => ({ id: nextId(store.steps) + Number(number), journeyId: journey.id, stepNumber: Number(number), title: item.title, status: Number(number) === 1 ? "in_progress" as const : "not_started" as const, completedAt: null })));
  write(store); return done(journey);
} });
export const useGetJourney = (id: number, options?: any) => useQuery({ queryKey: ["journey", id], queryFn: () => done(read().journeys.find((j) => j.id === id)), enabled: isEnabled(options) });
export const useListJourneySteps = (id: number, options?: any) => useQuery({ queryKey: getListJourneyStepsQueryKey(id), queryFn: () => done(read().steps.filter((s) => s.journeyId === id).sort((a,b) => a.stepNumber-b.stepNumber)), enabled: isEnabled(options) });
export const useGetJourneyStep = (id: number, step: number, options?: any) => useQuery({ queryKey: getGetJourneyStepQueryKey(id, step), queryFn: () => done(read().steps.find((s) => s.journeyId === id && s.stepNumber === step)), enabled: isEnabled(options) });
export const useGetJourneyProgress = (id: number, options?: any) => useQuery({ queryKey: getGetJourneyProgressQueryKey(id), queryFn: () => {
  const steps = read().steps.filter((s) => s.journeyId === id); const completedSteps = steps.filter((s) => s.status === "completed").length;
  return done({ completedSteps, totalSteps: steps.length, percentComplete: steps.length ? Math.round(completedSteps / steps.length * 100) : 0 });
}, enabled: isEnabled(options) });
export const useUpdateJourneyStep = () => useMutation({ mutationFn: ({ id, stepNumber, data }: { id: number; stepNumber: number; data: { status: StepStatus } }) => {
  const store = read(); const step = store.steps.find((s) => s.journeyId === id && s.stepNumber === stepNumber); if (!step) throw new Error("Step not found");
  step.status = data.status; step.completedAt = data.status === "completed" ? new Date().toISOString() : null;
  const journey = store.journeys.find((j) => j.id === id); if (journey) journey.currentStep = store.steps.find((s) => s.journeyId === id && s.status !== "completed")?.stepNumber || stepNumber;
  write(store); return done(step);
} });
export const useListStepNotes = (id: number, step: number, options?: any) => useQuery({ queryKey: getListStepNotesQueryKey(id, step), queryFn: () => done(read().notes.filter((n) => n.journeyId === id && n.stepNumber === step)), enabled: isEnabled(options) });
export const useCreateStepNote = () => useMutation({ mutationFn: ({ id, stepNumber, data }: { id: number; stepNumber: number; data: { content: string } }) => { const store = read(); const note = { id: nextId(store.notes), journeyId: id, stepNumber, content: data.content, createdAt: new Date().toISOString() }; store.notes.push(note); write(store); return done(note); } });
export const useDeleteStepNote = () => useMutation({ mutationFn: ({ noteId }: { id: number; stepNumber: number; noteId: number }) => { const store = read(); store.notes = store.notes.filter((n) => n.id !== noteId); write(store); return done(undefined); } });
export const useListJourneyDocuments = (id: number, options?: any) => useQuery({ queryKey: getListJourneyDocumentsQueryKey(id), queryFn: () => done(read().documents[String(id)] || []), enabled: isEnabled(options) });
export const useUpsertJourneyDocument = () => useMutation({ mutationFn: ({ id, docKey, data }: { id: number; docKey: string; data: { isChecked: boolean } }) => { const store = read(); const docs = store.documents[String(id)] || []; const found = docs.find((d) => d.docKey === docKey); if (found) found.isChecked = data.isChecked; else docs.push({ docKey, isChecked: data.isChecked }); store.documents[String(id)] = docs; write(store); return done({ docKey, isChecked: data.isChecked }); } });

const glossary = [
  ["Appraisal", "An independent estimate of a property's market value, usually ordered by the lender.", "Valuation"],
  ["Closing costs", "Fees paid at closing beyond the purchase price, such as lender, title, tax, and recording charges.", "Financing"],
  ["Contingency", "A contract condition that must be satisfied for the transaction to move forward.", "Legal & Documents"],
  ["Debt-to-income ratio", "The share of monthly income used to pay debts; lenders use it to evaluate borrowing capacity.", "Financing"],
  ["Earnest money", "A good-faith deposit submitted with an offer and held until closing or lawful termination.", "Legal & Documents"],
  ["Equity", "The home's current value minus any debt secured by the property.", "Valuation"],
  ["Escrow", "Money or documents held by a neutral third party until contract conditions are met.", "Process & People"],
  ["Home inspection", "A professional review of a property's visible structure and systems.", "Property"],
  ["MLS", "The multiple listing service agents use to share properties and transaction data.", "Process & People"],
  ["Pre-approval", "A lender's conditional estimate of how much a buyer may borrow after reviewing financial information.", "Financing"],
  ["Title", "The legal right to own and use a property.", "Legal & Documents"],
  ["Underwriting", "The lender's review of the borrower, property, and loan risk before final approval.", "Financing"],
].map(([term, definition, category], index) => ({ id: index + 1, term, definition, category }));
export const useListGlossaryTerms = () => useQuery({ queryKey: ["glossary"], queryFn: () => done(glossary) });
