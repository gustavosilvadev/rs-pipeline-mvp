import { useMemo } from "react";
import { useParams, Link } from "react-router";
import { useApp } from "../context/AppContext";
import { STAGES, STAGE_LABELS } from "../types";
import { ArrowLeft, MapPin, Clock, Mail, Briefcase, Users, Calendar } from "lucide-react";

export function JobReport() {
  const { jobId } = useParams<{ jobId: string }>();
  const { jobs, candidates } = useApp();

  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobs, jobId]);

  const jobCandidates = useMemo(() => {
    return candidates.filter((c) => c.jobId === jobId && c.status === "active");
  }, [candidates, jobId]);

  const stagesWithCandidates = useMemo(() => {
    return STAGES.map((stage) => ({
      ...stage,
      candidates: jobCandidates.filter((c) => c.stageId === stage.id),
    }));
  }, [jobCandidates]);

  const stats = useMemo(() => {
    const total = jobCandidates.length;
    const byStage = STAGES.map((stage) => ({
      label: stage.label,
      count: jobCandidates.filter((c) => c.stageId === stage.id).length,
      color: stage.dotColor,
    }));
    return { total, byStage };
  }, [jobCandidates]);

  if (!job) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Vaga não encontrada</p>
          <Link to="/vagas" className="text-sm text-blue-600 hover:underline">
            Voltar para Vagas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <Link
          to="/vagas"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Vagas
        </Link>

        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
          <p className="text-sm text-muted-foreground">{job.department}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{job.openings} vaga{job.openings > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Criada em {job.createdDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Total de Candidatos</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
              {stats.total}
            </p>
          </div>
          <div className="flex items-center gap-4 flex-1 overflow-x-auto">
            {stats.byStage.map((stage) => (
              <div key={stage.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-sm text-muted-foreground">
                  {stage.label}: <span className="font-bold text-foreground">{stage.count}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6 max-w-6xl">
          {stagesWithCandidates.map((stage) => (
            <div key={stage.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.dotColor }} />
                <h2 className="text-lg font-bold uppercase tracking-wider">{stage.label}</h2>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: stage.accentColor, color: stage.dotColor }}
                >
                  {stage.candidates.length}
                </span>
              </div>

              {stage.candidates.length === 0 ? (
                <div className="bg-white border border-border rounded-xl p-8 text-center">
                  <p className="text-sm text-muted-foreground">Nenhum candidato nesta etapa</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stage.candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-foreground mb-1">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{candidate.role}</p>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
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
                              <span>Na etapa: {candidate.daysInStage || 0} dias</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                              <span>Inscrito: {candidate.appliedDate}</span>
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
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: `${stage.dotColor}15`, color: stage.dotColor }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {candidate.note && (
                            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <p className="text-xs text-amber-900">{candidate.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
