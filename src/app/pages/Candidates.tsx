import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, MapPin, Clock, Mail, Phone, ExternalLink, Trash2, X } from "lucide-react";
import { Link } from "react-router";

export function Candidates() {
  const { candidates, jobs, updateCandidate, deleteCandidate } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "without-job">("all");

  const filteredCandidates = useMemo(() => {
    let list = candidates;
    if (filterStatus === "active") list = list.filter((c) => c.status === "active" && c.jobId);
    else if (filterStatus === "without-job") list = list.filter((c) => c.status === "active" && !c.jobId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
  }, [candidates, searchQuery, filterStatus]);

  const getJobTitle = (jobId?: string) => jobId ? (jobs.find((j) => j.id === jobId)?.title ?? "—") : "—";

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h1 className="text-xl md:text-2xl font-bold">Candidatos</h1>
          <span className="text-xs text-muted-foreground shrink-0">
            {filteredCandidates.length} resultado{filteredCandidates.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Search — full-width on mobile */}
        <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2 mb-3">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Buscar candidatos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter tabs — horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {[
            { value: "all", label: "Todos" },
            { value: "active", label: "Com Vaga" },
            { value: "without-job", label: "Sem Vaga" },
          ].map((f) => (
            <button key={f.value}
              onClick={() => setFilterStatus(f.value as typeof filterStatus)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold whitespace-nowrap shrink-0 ${
                filterStatus === f.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate list */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        <div className="space-y-3 max-w-5xl">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum candidato encontrado</p>
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-all">

                {/* Name + job badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground leading-snug">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{candidate.role}</p>
                  </div>
                  {candidate.status === "active" && candidate.jobId && (
                    <Link to={`/vagas/${candidate.jobId}`}
                      className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-colors flex items-center gap-1 shrink-0 max-w-[140px]">
                      <span className="truncate">{getJobTitle(candidate.jobId)}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </Link>
                  )}
                </div>

                {/* Info — 1 col on mobile, 2-col on sm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{candidate.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Inscrito em {candidate.appliedDate}</span>
                  </div>
                </div>

                {/* Tags + proficiency */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {candidate.proficiencyLevel && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                      {candidate.proficiencyLevel}
                    </span>
                  )}
                  {candidate.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium">{tag}</span>
                  ))}
                </div>

                {/* Actions — full-width row at bottom */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  {!candidate.jobId && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) updateCandidate(candidate.id, { jobId: e.target.value, stageId: "applied", daysInStage: 0 });
                      }}
                      className="flex-1 text-xs px-3 py-2 border border-border rounded-lg bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <option value="">Associar à Vaga</option>
                      {jobs.filter((j) => j.status === "open").map((job) => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={() => { if (confirm(`Deseja excluir ${candidate.name}?`)) deleteCandidate(candidate.id); }}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
