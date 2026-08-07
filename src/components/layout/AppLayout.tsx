import { Link, useLocation } from "wouter";
import { Compass, BookOpen, Library, Home, Calculator, Clock, Scale, ChevronDown, Map, Phone } from "lucide-react";
import { ReactNode, useState, useRef, useEffect } from "react";

const navItems = [
  { href: "/", label: "Map", icon: Map },
  { href: "/calculators", label: "Calculators", icon: Calculator },
  { href: "/timelines", label: "Timelines", icon: Clock },
  { href: "/legal", label: "Rights", icon: Scale },
  { href: "/resources", label: "Resources", icon: Library },
  { href: "/glossary", label: "Glossary", icon: BookOpen },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 selection:text-primary relative">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/90 dark:bg-background/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-primary transition-opacity hover:opacity-80 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-sm">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">Home Journey</span>
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase" style={{ letterSpacing: "0.12em" }}>by GraceAnn Visser</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition-all flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5 hover:text-primary ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <a href="tel:6157397804" className="ml-2 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-bold hover:bg-primary/90">
              <Phone className="h-4 w-4" /> Talk with GraceAnn
            </a>
          </nav>

          <div className="lg:hidden relative" ref={menuRef}>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
              className="flex items-center gap-2 text-sm font-semibold text-foreground bg-secondary px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors"
            >
              Menu <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileOpen && (
              <div id="mobile-navigation" className="absolute right-0 top-full mt-3 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in-up origin-top-right">
                <div className="p-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                          isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <a href="tel:6157397804" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl bg-primary text-primary-foreground" onClick={() => setMobileOpen(false)}><Phone className="h-5 w-5" />Talk with GraceAnn</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full relative z-10">
        {children}
      </main>

      {/* Footer with topographic/road texture background */}
      <footer className="border-t border-border mt-auto relative overflow-hidden bg-card text-card-foreground">
        {/* Subtle SVG texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTAgNDBRMjAgNjAgNDAgNDBUNDAgNDBUNDAgNDBUMDAgNDBaIiBvcGFjaXR5PSIwLjUiLz48L2c+PC9zdmc+')", backgroundSize: '100px 100px' }}></div>
        
        <div className="container mx-auto px-4 md:px-8 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2.5 text-primary">
                <Compass className="h-6 w-6" />
                <span className="font-serif text-lg font-bold">Home Journey</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">GraceAnn Visser · Real Estate Advisor</p>
            </div>
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
              {navItems.slice(1).map((item) => (
                <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Brokerage disclosure */}
          <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center">
            <p className="text-xs text-muted-foreground/70">
              Benchmark Realty LLC
            </p>
            <span className="hidden sm:inline text-muted-foreground/40 text-xs">·</span>
            <p className="text-xs text-muted-foreground/70">
              318 Seaboard Lane, Suite 112, Franklin TN 37067
            </p>
            <span className="hidden sm:inline text-muted-foreground/40 text-xs">·</span>
            <a
              href="tel:6153711544"
              className="text-xs text-muted-foreground/70 hover:text-primary transition-colors"
            >
              615-371-1544
            </a>
          </div>
          <p className="mt-4 mx-auto max-w-3xl text-center text-[11px] leading-relaxed text-muted-foreground/70">
            This roadmap is for general education and planning. It is not legal, tax, lending, or financial advice; requirements and timelines vary by transaction and location.
          </p>
        </div>
      </footer>
    </div>
  );
}
