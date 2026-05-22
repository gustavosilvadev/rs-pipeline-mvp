import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, MapPin, Clock, Mail, Phone, XCircle, RotateCcw, X, User } from "lucide-react";
import { STAGES } from "../types";

export function Rejected() {
  const { candidates, updateCandidate, jobs } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const rejectedCandidates = useMemo(() => {
    let list = candidates.filter((c) => c.status === "rejected");
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
  }, [candidates, searchQuery]);

  const getJobTitle = (jobId?: string) => {
    if (!jobId) return null;
    return jobs.find((j) => j.id === jobId)?.title || null;
  };

  const handleMoveToTalentPool = (candidateId: string) => {
    updateCandidate(candidateId, { status: "talent-pool" });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              Reprovados
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {rejectedCandidates.length} candidato{rejectedCandidates.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2">
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
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        <div className="space-y-3 max-w-3xl">
          {rejectedCandidates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Nenhum candidato reprovado</p>
              <p className="text-sm text-muted-foreground">Candidatos reprovados aparecerão aqui</p>
            </div>
          ) : (
            rejectedCandidates.map((candidate) => {
              const jobTitle = getJobTitle(candidate.jobId);
              const lastStage = candidate.stageId
                ? STAGES.find((s) => s.id === candidate.stageId)
                : null;

              return (
                <div
                  key={candidate.id}
                  className="bg-white border border-red-100 rounded-2xl p-4 hover:shadow-md transition-all"
                >
                  {/* Top row: name + job badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-foreground leading-snug">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{candidate.role}</p>
                      </div>
                    </div>
                    {jobTitle && (
                      <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium shrink-0 max-w-[130px] truncate">
                        {jobTitle}
                      </span>
                    )}
                  </div>

                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{candidate.email}</span>
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
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
                  {(candidate.proficiencyLevel || candidate.tags.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {candidate.proficiencyLevel && (
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-semibold border border-blue-100">
                          {candidate.proficiencyLevel}
                        </span>
                      )}
                      {candidate.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stage reached */}
                  {lastStage && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Reprovado em</p>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: lastStage.accentColor, color: lastStage.dotColor }}>
                        {lastStage.label}
                      </span>
                    </div>
                  )}

                  {/* Action */}
                  <div className="pt-3 border-t border-border">
                    <button
                      onClick={() => handleMoveToTalentPool(candidate.id)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition-colors font-semibold border border-blue-100"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Mover para Banco de Talentos
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
