import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router";
import { MapPin, Briefcase, Users, Calendar, ExternalLink, CheckCircle, XCircle, Plus } from "lucide-react";
import { AddJobModal } from "../components/AddJobModal";

export function Jobs() {
  const { jobs, candidates } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const jobsWithCandidates = useMemo(() => {
    return jobs.map((job) => ({
      ...job,
      candidateCount: candidates.filter((c) => c.jobId === job.id && c.status === "active").length,
    })).sort((a, b) => b.createdDate.localeCompare(a.createdDate));
  }, [jobs, candidates]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Vagas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {jobsWithCandidates.filter((j) => j.status === "open").length} vagas abertas
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-foreground text-background rounded-xl font-bold hover:opacity-80 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Adicionar Vaga
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl">
          {jobsWithCandidates.map((job) => (
            <Link
              key={job.id}
              to={`/vagas/${job.id}`}
              className="bg-white border border-border rounded-xl p-5 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {job.status === "open" ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Aberta</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Fechada</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>{job.openings} vaga{job.openings > 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Criada em {job.createdDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Candidatos no pipeline</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                    {job.candidateCount}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {jobsWithCandidates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma vaga cadastrada</p>
          </div>
        )}
      </div>

      <AddJobModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
