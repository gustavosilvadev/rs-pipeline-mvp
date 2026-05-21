import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, MapPin, Clock, Mail, XCircle, RotateCcw } from "lucide-react";
import { RejectionPipelineProgress } from "../components/RejectionPipelineProgress";

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
          c.email.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
  }, [candidates, searchQuery]);

  const getJobTitle = (jobId?: string) => {
    if (!jobId) return "—";
    return jobs.find((j) => j.id === jobId)?.title || "—";
  };

  const handleMoveToTalentPool = (candidateId: string) => {
    updateCandidate(candidateId, { status: "talent-pool" });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Candidatos Reprovados</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {rejectedCandidates.length} candidato{rejectedCandidates.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Buscar candidatos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-3 max-w-5xl">
          {rejectedCandidates.length === 0 ? (
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Nenhum candidato reprovado</p>
            </div>
          ) : (
            rejectedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white border border-red-200 rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      </div>
                      {candidate.jobId && (
                        <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">
                          {getJobTitle(candidate.jobId)}
                        </span>
                      )}
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
                        <span>Inscrito em {candidate.appliedDate}</span>
                      </div>
                      {candidate.proficiencyLevel && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            {candidate.proficiencyLevel}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 ml-8 mb-4">
                      {candidate.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="ml-8">
                      <RejectionPipelineProgress candidate={candidate} />
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToTalentPool(candidate.id)}
                    className="text-xs px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 font-semibold whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Mover p/ Banco de Talentos
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
