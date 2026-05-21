import { Outlet, Link, useLocation } from "react-router";
import { Plus, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AddCandidateModal } from "./AddCandidateModal";

export function Layout() {
  const location = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportsMenu, setShowReportsMenu] = useState(false);

  const navItems = [
    { path: "/", label: "Pipeline" },
    { path: "/candidatos", label: "Candidatos" },
    { path: "/vagas", label: "Vagas" },
    { path: "/teste", label: "Teste" },
  ];

  return (
    <div
      className="h-screen bg-background text-foreground flex flex-col overflow-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <header className="shrink-0 border-b border-border px-6 py-3 flex items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-5">
          <Link to="/">
            <span className="text-base font-black uppercase tracking-widest text-foreground border-2 border-foreground px-3 py-1 rounded-lg cursor-pointer hover:bg-foreground hover:text-background transition-colors">
              LOGO
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
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
            <div className="relative">
              <button
                onClick={() => setShowReportsMenu(!showReportsMenu)}
                className={`text-sm px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                  location.pathname.startsWith("/relatorios")
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Relatórios
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showReportsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowReportsMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-lg shadow-lg py-1 z-20 min-w-[220px]">
                    <Link
                      to="/relatorios/vagas"
                      onClick={() => setShowReportsMenu(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      Relatório de Vagas
                    </Link>
                    <Link
                      to="/relatorios/candidatos"
                      onClick={() => setShowReportsMenu(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      Relatório de Candidatos
                    </Link>
                    <Link
                      to="/relatorios/avaliacao"
                      onClick={() => setShowReportsMenu(false)}
                      className="block px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                    >
                      Avaliação de Candidatos
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <Link
                      to="/reprovados"
                      onClick={() => setShowReportsMenu(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      Reprovados
                    </Link>
                    <Link
                      to="/banco-talentos"
                      onClick={() => setShowReportsMenu(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      Banco de Talentos
                    </Link>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-3">
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
{/*           
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-foreground text-background rounded-xl font-bold hover:opacity-80 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
 */}
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      <AddCandidateModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
