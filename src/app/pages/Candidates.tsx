import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, MapPin, Clock, Mail, Phone, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "react-router";

export function Candidates() {
  const { candidates, jobs, updateCandidate, deleteCandidate } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "without-job">("all");

  const filteredCandidates = useMemo(() => {
    let list = candidates;

    if (filterStatus === "active") {
      list = list.filter((c) => c.status === "active" && c.jobId);
    } else if (filterStatus === "without-job") {
      list = list.filter((c) => c.status === "active" && !c.jobId);
    }

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
  }, [candidates, searchQuery, filterStatus]);

  const getJobTitle = (jobId?: string) => {
    if (!jobId) return "—";
    return jobs.find((j) => j.id === jobId)?.title || "—";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">Candidatos</h1>
          <div className="flex items-center gap-3">
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

        <div className="flex items-center gap-2">
          {[
            { value: "all", label: "Todos" },
            { value: "active", label: "Com Vaga Associada" },
            { value: "without-job", label: "Sem Vaga" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value as typeof filterStatus)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                filterStatus === filter.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-3 max-w-5xl">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum candidato encontrado</p>
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      </div>
                      {candidate.status === "active" && candidate.jobId && (
                        <Link
                          to={`/vagas/${candidate.jobId}`}
                          className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          {getJobTitle(candidate.jobId)}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
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
                      {candidate.proficiencyLevel && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            {candidate.proficiencyLevel}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {candidate.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!candidate.jobId && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            updateCandidate(candidate.id, {
                              jobId: e.target.value,
                              stageId: "applied",
                              daysInStage: 0,
                            });
                          }
                        }}
                        className="text-xs px-3 py-1.5 border border-border rounded-lg bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <option value="">Associar à Vaga</option>
                        {jobs.filter((j) => j.status === "open").map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.title}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`Deseja excluir ${candidate.name}?`)) {
                          deleteCandidate(candidate.id);
                        }
                      }}
                      className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir
                    </button>
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
