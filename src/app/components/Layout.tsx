import { Outlet, Link, useLocation } from "react-router";
import { Plus, User, ChevronDown, Menu, X, LayoutDashboard, Users, Briefcase, FileText, ClipboardList, XCircle, Star, BarChart2, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AddCandidateModal } from "./AddCandidateModal";

const NAV_ITEMS = [
  { path: "/", label: "Pipeline", icon: LayoutDashboard },
  { path: "/candidatos", label: "Candidatos", icon: Users },
  { path: "/vagas", label: "Vagas", icon: Briefcase },
  { path: "/teste", label: "Teste", icon: ClipboardList },
];

const REPORT_ITEMS = [
  { path: "/relatorios/vagas", label: "Relatório de Vagas", icon: BarChart2 },
  { path: "/relatorios/candidatos", label: "Relatório de Candidatos", icon: FileText },
  { path: "/relatorios/avaliacao", label: "Avaliação de Candidatos", icon: ClipboardList, highlight: true },
  { path: "/reprovados", label: "Reprovados", icon: XCircle },
  { path: "/banco-talentos", label: "Banco de Talentos", icon: Star },
];

export function Layout() {
  const location = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [showMobileReports, setShowMobileReports] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setShowMobileDrawer(false);
    setShowReportsMenu(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (showMobileDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showMobileDrawer]);

  const isReportsActive = location.pathname.startsWith("/relatorios") ||
    location.pathname === "/reprovados" ||
    location.pathname === "/banco-talentos";

  return (
    <div
      className="h-screen bg-background text-foreground flex flex-col overflow-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Header ── */}
      <header className="shrink-0 border-b border-border px-4 md:px-6 py-3 flex items-center justify-between gap-4 bg-white z-30 relative">
        <div className="flex items-center gap-3 md:gap-5">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setShowMobileDrawer(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/">
            <span className="text-sm md:text-base font-black uppercase tracking-widest text-foreground border-2 border-foreground px-2.5 md:px-3 py-1 rounded-lg cursor-pointer hover:bg-foreground hover:text-background transition-colors">
              LOGO
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm px-4 py-2 rounded-lg transition-colors font-medium ${
                  location.pathname === item.path
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Reports dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowReportsMenu(!showReportsMenu)}
                className={`text-sm px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                  isReportsActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Relatórios
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showReportsMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowReportsMenu(false)} />
                  <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-xl shadow-xl py-1.5 z-20 min-w-[230px]">
                    {REPORT_ITEMS.map((item, i) => (
                      <div key={item.path}>
                        {i === 3 && <div className="h-px bg-border my-1" />}
                        <Link
                          to={item.path}
                          onClick={() => setShowReportsMenu(false)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                            item.highlight
                              ? "text-purple-700 hover:bg-purple-50 font-semibold"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <item.icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                          {item.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/configuracoes"
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              location.pathname === "/configuracoes"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <User className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-sm px-3 md:px-4 py-2 bg-foreground text-background rounded-xl font-bold hover:opacity-80 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {showMobileDrawer && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileDrawer(false)}
          />

          {/* Drawer panel */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-white shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-black uppercase tracking-widest text-foreground border-2 border-foreground px-2.5 py-1 rounded-lg">
                LOGO
              </span>
              <button
                onClick={() => setShowMobileDrawer(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="flex-1 overflow-y-auto py-3 px-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2 mt-1">
                Principal
              </p>
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold mb-0.5 transition-colors ${
                      active
                        ? "bg-foreground text-background"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18 }} />
                    {item.label}
                  </Link>
                );
              })}

              {/* Reports section */}
              <div className="mt-3">
                <button
                  onClick={() => setShowMobileReports(!showMobileReports)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors mb-0.5 ${
                    isReportsActive ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BarChart2 style={{ width: 18, height: 18 }} className="shrink-0" />
                    Relatórios
                  </div>
                  <ChevronRight
                    className="w-4 h-4 transition-transform duration-200"
                    style={{ transform: showMobileReports ? "rotate(90deg)" : "rotate(0deg)" }}
                  />
                </button>

                {showMobileReports && (
                  <div className="ml-3 pl-3 border-l-2 border-border mt-1 mb-1 space-y-0.5">
                    {REPORT_ITEMS.map((item, i) => {
                      const active = location.pathname === item.path;
                      return (
                        <div key={item.path}>
                          {i === 3 && <div className="h-px bg-border my-1.5" />}
                          <Link
                            to={item.path}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                              active
                                ? "bg-foreground text-background font-semibold"
                                : item.highlight
                                ? "text-purple-700 hover:bg-purple-50 font-semibold"
                                : "text-foreground hover:bg-muted font-medium"
                            }`}
                          >
                            <item.icon className="w-4 h-4 shrink-0 opacity-70" />
                            {item.label}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Drawer footer */}
            <div className="border-t border-border p-4">
              <Link
                to="/configuracoes"
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === "/configuracoes"
                    ? "bg-foreground text-background"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <User style={{ width: 18, height: 18 }} className="shrink-0" />
                Configurações
              </Link>
              <button
                onClick={() => { setShowMobileDrawer(false); setShowAddModal(true); }}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-xl text-sm font-bold hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" />
                Adicionar Candidato
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      <AddCandidateModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
