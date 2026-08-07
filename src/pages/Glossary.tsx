import { useState } from "react";
import { useListGlossaryTerms } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen } from "lucide-react";

const categoryColors: Record<string, string> = {
  "Financing": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Legal & Documents": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Valuation": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Process & People": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Property": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function Glossary() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: terms, isLoading } = useListGlossaryTerms();

  const categories = terms
    ? Array.from(new Set(terms.map((t) => t.category))).sort()
    : [];

  const filtered = terms?.filter((term) => {
    const matchesSearch =
      !search ||
      term.term.toLowerCase().includes(search.toLowerCase()) ||
      term.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || term.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const grouped = filtered
    ? categories
        .filter((cat) => !activeCategory || cat === activeCategory)
        .map((cat) => ({
          category: cat,
          terms: filtered.filter((t) => t.category === cat),
        }))
        .filter((g) => g.terms.length > 0)
    : [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">Real Estate Glossary</h1>
        </div>
        <p className="text-muted-foreground text-lg ml-10">
          Every term you'll encounter, explained in plain language.
        </p>
      </div>

      <div className="sticky top-[65px] z-30 bg-background/90 backdrop-blur-md py-4 -mx-4 px-4 mb-8 border-b">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms or definitions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background h-11"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              !activeCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-7 w-40" />
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-20 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No terms match your search.</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory(null); }}
            className="text-sm text-primary hover:underline mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {grouped.map(({ category, terms: catTerms }) => (
            <section key={category}>
              <h2 className="font-serif text-xl text-foreground mb-5 pb-3 border-b flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    categoryColors[category] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {category}
                </span>
                <span className="text-muted-foreground text-sm font-normal">{catTerms.length} terms</span>
              </h2>
              <div className="grid gap-4">
                {catTerms.map((term) => (
                  <div
                    key={term.id}
                    className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
                  >
                    <h3 className="font-semibold text-foreground mb-1.5">{term.term}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{term.definition}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
