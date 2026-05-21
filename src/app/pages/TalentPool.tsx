import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, MapPin, Clock, Mail, Star } from "lucide-react";
import { RejectionPipelineProgress } from "../components/RejectionPipelineProgress";

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
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Banco de Talentos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {talentPoolCandidates.length} candidato{talentPoolCandidates.length !== 1 ? "s" : ""} no banco
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nome, cargo ou habilidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-80"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-3 max-w-5xl">
          {talentPoolCandidates.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Nenhum candidato no banco de talentos</p>
            </div>
          ) : (
            talentPoolCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 fill-amber-500" />
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 ml-8">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Adicionado em {candidate.appliedDate}</span>
                      </div>
                      {candidate.proficiencyLevel && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold border border-amber-200">
                            {candidate.proficiencyLevel}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 ml-8">
                      {candidate.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium border border-amber-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {candidate.note && (
                      <div className="mt-3 ml-8 bg-slate-50 border border-border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">{candidate.note}</p>
                      </div>
                    )}

                    <div className="mt-4 ml-8">
                      <RejectionPipelineProgress candidate={candidate} />
                    </div>
                  </div>

                  <div className="shrink-0">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssociateToJob(candidate.id, e.target.value);
                        }
                      }}
                      className="text-xs px-3 py-2 border border-border rounded-lg bg-white hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold"
                    >
                      <option value="">Associar à Vaga</option>
                      {jobs.filter((j) => j.status === "open").map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
