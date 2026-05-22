import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, MapPin, Clock, Mail, Phone, Star, X, User, Briefcase } from "lucide-react";
import { STAGES } from "../types";

export function TalentPool() {
  const { candidates, updateCandidate, jobs } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const talentPoolCandidates = useMemo(() => {
    let list = candidates.filter((c) => c.status === "talent-pool");
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
  }, [candidates, searchQuery]);

  const openJobs = useMemo(() => jobs.filter((j) => j.status === "open"), [jobs]);

  const handleAssociateToJob = (candidateId: string, jobId: string) => {
    updateCandidate(candidateId, {
      jobId,
      stageId: "applied",
      daysInStage: 0,
      status: "active",
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
              Banco de Talentos
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {talentPoolCandidates.length} candidato{talentPoolCandidates.length !== 1 ? "s" : ""} no banco
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nome, cargo ou habilidades..."
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
          {talentPoolCandidates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Banco de talentos vazio</p>
              <p className="text-sm text-muted-foreground">Candidatos reprovados podem ser movidos para cá</p>
            </div>
          ) : (
            talentPoolCandidates.map((candidate) => {
              const lastStage = candidate.stageId
                ? STAGES.find((s) => s.id === candidate.stageId)
                : null;

              return (
                <div
                  key={candidate.id}
                  className="bg-white border border-amber-100 rounded-2xl p-4 hover:shadow-md transition-all"
                >
                  {/* Top row: name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-foreground leading-snug">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{candidate.role}</p>
                    </div>
                    {lastStage && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: lastStage.accentColor, color: lastStage.dotColor }}>
                        {lastStage.label}
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
                      <span>Adicionado em {candidate.appliedDate}</span>
                    </div>
                  </div>

                  {/* Tags + proficiency */}
                  {(candidate.proficiencyLevel || candidate.tags.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {candidate.proficiencyLevel && (
                        <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-semibold border border-amber-200">
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

                  {/* Note */}
                  {candidate.note && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-3">
                      <p className="text-xs text-amber-900 leading-relaxed">{candidate.note}</p>
                    </div>
                  )}

                  {/* Action */}
                  <div className="pt-3 border-t border-border">
                    {openJobs.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                        <select
                          onChange={(e) => {
                            if (e.target.value) handleAssociateToJob(candidate.id, e.target.value);
                          }}
                          className="flex-1 text-sm px-3 py-2 border border-border rounded-xl bg-white hover:bg-slate-50 transition-colors cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                          <option value="">Associar a uma vaga...</option>
                          {openJobs.map((job) => (
                            <option key={job.id} value={job.id}>
                              {job.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Nenhuma vaga aberta disponível</p>
                    )}
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
