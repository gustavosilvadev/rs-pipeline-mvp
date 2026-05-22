import { useMemo } from "react";
import { useParams, Link } from "react-router";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, User, Building, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react";
import { STAGES, STAGE_LABELS, STAGE_ORDER } from "../types";
import * as XLSX from "xlsx";

export function CandidateTimeline() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { candidates, jobs } = useApp();

  const candidate = useMemo(() => candidates.find((c) => c.id === candidateId), [candidates, candidateId]);
  const job = useMemo(() => candidate?.jobId ? jobs.find((j) => j.id === candidate.jobId) ?? null : null, [candidate, jobs]);

  const handleExport = () => {
    if (!candidate) return;
    const timelineData = (candidate.timeline || []).map((entry) => ({
      "Etapa": entry.stageName, "Data": entry.date, "Horário": entry.time,
      "Entrevistador": entry.interviewer, "Unidade": entry.interviewerUnit,
      "Decisão": entry.decision === "approved" ? "Aprovado" : entry.decision === "rejected" ? "Reprovado" : "Pendente",
      "Parecer": entry.feedback,
    }));
    const candidateInfo = [
      { "Campo": "Nome", "Valor": candidate.name },
      { "Campo": "E-mail", "Valor": candidate.email },
      { "Campo": "Telefone", "Valor": candidate.phone },
      { "Campo": "Cargo", "Valor": candidate.role },
      { "Campo": "Vaga", "Valor": job?.title || "—" },
      { "Campo": "Unidade", "Valor": job?.location || "—" },
      { "Campo": "Proficiência", "Valor": candidate.proficiencyLevel || "—" },
      { "Campo": "Data de Inscrição", "Valor": candidate.appliedDate },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(candidateInfo), "Dados do Candidato");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(timelineData), "Histórico");
    XLSX.writeFile(wb, `timeline-${candidate.name.replace(/\s/g, "-")}-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  if (!candidate) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center px-4">
          <p className="text-lg text-muted-foreground mb-4">Candidato não encontrado</p>
          <Link to="/candidatos" className="text-sm text-blue-600 hover:underline">Voltar para Candidatos</Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = candidate.stageId ? STAGE_ORDER.indexOf(candidate.stageId) : -1;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-border px-4 md:px-6 py-4">
        <Link to="/relatorios/candidatos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Relatório
        </Link>

        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-0.5">{candidate.name}</h1>
            <p className="text-sm text-muted-foreground">{candidate.role}</p>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 text-sm px-3 md:px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shrink-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>

        {/* Contact info — 2 col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{candidate.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>Inscrito em {candidate.appliedDate}</span>
          </div>
        </div>

        {job && (
          <div className="bg-slate-50 rounded-xl p-3 border border-border">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Vaga</p>
                <p className="text-sm font-semibold">{job.title}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Unidade</p>
                <p className="text-sm font-semibold">{job.location}</p>
              </div>
              {candidate.proficiencyLevel && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Proficiência</p>
                  <p className="text-sm font-semibold text-blue-700">{candidate.proficiencyLevel}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Pipeline progress — horizontal scroll on mobile */}
          <div>
            <h2 className="text-base md:text-lg font-bold mb-4">Progresso no Pipeline</h2>
            <div className="overflow-x-auto -mx-1" style={{ WebkitOverflowScrolling: "touch" }}>
              <div className="flex items-center gap-1 px-1" style={{ minWidth: 360 }}>
                {STAGES.map((stage, idx) => {
                  const isPast = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  return (
                    <div key={stage.id} className="flex items-center flex-1 min-w-0">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all shrink-0"
                          style={{
                            backgroundColor: isCurrent ? stage.dotColor : isPast ? `${stage.dotColor}33` : "#E2E8F0",
                            color: isCurrent || isPast ? "white" : "#94A3B8",
                            boxShadow: isCurrent ? `0 0 10px ${stage.dotColor}88` : "none",
                          }}>
                          {isPast ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <p className="text-[9px] md:text-xs font-semibold mt-1.5 text-center"
                          style={{ color: isCurrent ? stage.dotColor : isPast ? "#64748B" : "#CBD5E1" }}>
                          {stage.label}
                        </p>
                      </div>
                      {idx < STAGES.length - 1 && (
                        <div className="h-1 flex-1 rounded-full mx-1"
                          style={{ backgroundColor: isPast ? `${STAGES[idx + 1].dotColor}55` : "#E2E8F0" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-base md:text-lg font-bold mb-4">Histórico Detalhado</h2>

            {(!candidate.timeline || candidate.timeline.length === 0) ? (
              <div className="bg-white border border-border rounded-xl p-8 text-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">Nenhum registro de entrevista ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {candidate.timeline.map((entry, idx) => {
                  const stage = STAGES.find((s) => s.id === entry.stageId);
                  const isLast = idx === candidate.timeline!.length - 1;
                  return (
                    <div key={entry.id} className="relative">
                      {!isLast && (
                        <div className="absolute left-5 top-14 w-0.5 h-[calc(100%_-_3rem)]"
                          style={{ backgroundColor: stage?.dotColor + "33" }} />
                      )}

                      <div className="bg-white border border-border rounded-xl p-4 md:p-5 relative">
                        <div className="flex items-start gap-3 md:gap-4">
                          {/* Stage icon */}
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: stage?.accentColor, border: `2px solid ${stage?.dotColor}` }}>
                            {entry.decision === "approved" && <CheckCircle className="w-5 h-5" style={{ color: stage?.dotColor }} />}
                            {entry.decision === "rejected" && <XCircle className="w-5 h-5 text-red-600" />}
                            {entry.decision === "pending" && <Clock className="w-5 h-5" style={{ color: stage?.dotColor }} />}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Stage name + decision badge */}
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="text-base font-bold" style={{ color: stage?.dotColor }}>{entry.stageName}</h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{entry.date}</span>
                                  {entry.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{entry.time}</span>}
                                </div>
                              </div>
                              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full shrink-0"
                                style={{
                                  backgroundColor: entry.decision === "approved" ? "#D1FAE5" : entry.decision === "rejected" ? "#FEE2E2" : "#FEF3C7",
                                  color: entry.decision === "approved" ? "#065F46" : entry.decision === "rejected" ? "#991B1B" : "#92400E",
                                }}>
                                {entry.decision === "approved" ? "Aprovado" : entry.decision === "rejected" ? "Reprovado" : "Pendente"}
                              </span>
                            </div>

                            {/* Interviewer + unit — stacked on mobile */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                              <div className="bg-slate-50 rounded-lg p-2.5 border border-border">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <User className="w-3 h-3 text-muted-foreground" />
                                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Entrevistador</p>
                                </div>
                                <p className="text-sm font-semibold">{entry.interviewer}</p>
                              </div>
                              {entry.interviewerUnit && (
                                <div className="bg-slate-50 rounded-lg p-2.5 border border-border">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Building className="w-3 h-3 text-muted-foreground" />
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Unidade</p>
                                  </div>
                                  <p className="text-sm font-semibold">{entry.interviewerUnit}</p>
                                </div>
                              )}
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-900 mb-1.5">
                                Parecer do Entrevistador
                              </p>
                              <p className="text-sm text-amber-900 leading-relaxed">{entry.feedback}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {candidate.tags.length > 0 && (
            <div className="bg-white border border-border rounded-xl p-4 md:p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Habilidades e Certificações
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.tags.map((tag) => (
                  <span key={tag} className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
