import { useMemo } from "react";
import { useParams, Link } from "react-router";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, User, Building, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react";
import { STAGES, STAGE_LABELS, STAGE_ORDER } from "../types";
import * as XLSX from "xlsx";

export function CandidateTimeline() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { candidates, jobs } = useApp();

  const candidate = useMemo(() => {
    return candidates.find((c) => c.id === candidateId);
  }, [candidates, candidateId]);

  const job = useMemo(() => {
    if (!candidate?.jobId) return null;
    return jobs.find((j) => j.id === candidate.jobId);
  }, [candidate, jobs]);

  const handleExport = () => {
    if (!candidate) return;

    const timelineData = (candidate.timeline || []).map((entry) => ({
      "Etapa": entry.stageName,
      "Data": entry.date,
      "Horário": entry.time,
      "Entrevistador": entry.interviewer,
      "Unidade": entry.interviewerUnit,
      "Decisão": entry.decision === "approved" ? "Aprovado" : entry.decision === "rejected" ? "Reprovado" : "Pendente",
      "Parecer": entry.feedback,
    }));

    const candidateInfo = [{
      "Campo": "Nome",
      "Valor": candidate.name,
    }, {
      "Campo": "E-mail",
      "Valor": candidate.email,
    }, {
      "Campo": "Telefone",
      "Valor": candidate.phone,
    }, {
      "Campo": "Cargo",
      "Valor": candidate.role,
    }, {
      "Campo": "Vaga",
      "Valor": job?.title || "—",
    }, {
      "Campo": "Unidade",
      "Valor": job?.location || "—",
    }, {
      "Campo": "Proficiência",
      "Valor": candidate.proficiencyLevel || "—",
    }, {
      "Campo": "Data de Inscrição",
      "Valor": candidate.appliedDate,
    }];

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(candidateInfo);
    XLSX.utils.book_append_sheet(wb, ws1, "Dados do Candidato");

    const ws2 = XLSX.utils.json_to_sheet(timelineData);
    XLSX.utils.book_append_sheet(wb, ws2, "Histórico");

    const fileName = `timeline-${candidate.name.replace(/\s/g, "-")}-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (!candidate) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Candidato não encontrado</p>
          <Link to="/candidatos" className="text-sm text-blue-600 hover:underline">
            Voltar para Candidatos
          </Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = candidate.stageId ? STAGE_ORDER.indexOf(candidate.stageId) : -1;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <Link
          to="/relatorios/candidatos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Relatório
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{candidate.name}</h1>
            <p className="text-sm text-muted-foreground">{candidate.role}</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar Timeline
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{candidate.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Inscrito em {candidate.appliedDate}</span>
          </div>
        </div>

        {job && (
          <div className="bg-slate-50 rounded-xl p-3 border border-border">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Vaga</p>
                <p className="text-sm font-semibold">{job.title}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Unidade</p>
                <p className="text-sm font-semibold">{job.location}</p>
              </div>
              {candidate.proficiencyLevel && (
                <>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Proficiência</p>
                    <p className="text-sm font-semibold text-blue-700">{candidate.proficiencyLevel}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Progresso no Pipeline</h2>
            <div className="flex items-center gap-2">
              {STAGES.map((stage, idx) => {
                const isPast = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                        style={{
                          backgroundColor: isCurrent ? stage.dotColor : isPast ? `${stage.dotColor}33` : "#E2E8F0",
                          color: isCurrent || isPast ? "white" : "#94A3B8",
                          boxShadow: isCurrent ? `0 0 12px ${stage.dotColor}88` : "none",
                        }}
                      >
                        {isPast ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                      </div>
                      <p
                        className="text-xs font-semibold mt-2 text-center"
                        style={{
                          color: isCurrent ? stage.dotColor : isPast ? "#64748B" : "#CBD5E1",
                        }}
                      >
                        {stage.label}
                      </p>
                    </div>
                    {idx < STAGES.length - 1 && (
                      <div
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor: isPast ? `${STAGES[idx + 1].dotColor}55` : "#E2E8F0",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Histórico Detalhado</h2>

            {(!candidate.timeline || candidate.timeline.length === 0) ? (
              <div className="bg-white border border-border rounded-xl p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">Nenhum registro de entrevista ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {candidate.timeline.map((entry, idx) => {
                  const stage = STAGES.find((s) => s.id === entry.stageId);
                  const isLast = idx === candidate.timeline!.length - 1;

                  return (
                    <div key={entry.id} className="relative">
                      {!isLast && (
                        <div
                          className="absolute left-6 top-16 w-1 h-full -mb-4"
                          style={{ backgroundColor: stage?.dotColor + "33" }}
                        />
                      )}

                      <div className="bg-white border border-border rounded-xl p-5 relative">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: stage?.accentColor,
                              border: `2px solid ${stage?.dotColor}`,
                            }}
                          >
                            {entry.decision === "approved" && <CheckCircle className="w-6 h-6" style={{ color: stage?.dotColor }} />}
                            {entry.decision === "rejected" && <XCircle className="w-6 h-6 text-red-600" />}
                            {entry.decision === "pending" && <Clock className="w-6 h-6" style={{ color: stage?.dotColor }} />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-bold" style={{ color: stage?.dotColor }}>
                                  {entry.stageName}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {entry.date}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {entry.time}
                                  </div>
                                </div>
                              </div>
                              <span
                                className="text-xs font-bold uppercase px-3 py-1 rounded-full"
                                style={{
                                  backgroundColor:
                                    entry.decision === "approved"
                                      ? "#D1FAE5"
                                      : entry.decision === "rejected"
                                      ? "#FEE2E2"
                                      : "#FEF3C7",
                                  color:
                                    entry.decision === "approved"
                                      ? "#065F46"
                                      : entry.decision === "rejected"
                                      ? "#991B1B"
                                      : "#92400E",
                                }}
                              >
                                {entry.decision === "approved" ? "Aprovado" : entry.decision === "rejected" ? "Reprovado" : "Pendente"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="bg-slate-50 rounded-lg p-3 border border-border">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Entrevistador</p>
                                </div>
                                <p className="text-sm font-semibold">{entry.interviewer}</p>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-3 border border-border">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Building className="w-3.5 h-3.5 text-muted-foreground" />
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Unidade</p>
                                </div>
                                <p className="text-sm font-semibold">{entry.interviewerUnit}</p>
                              </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                              <p className="text-xs font-semibold uppercase tracking-widest text-amber-900 mb-2">
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
            <div className="mt-8 bg-white border border-border rounded-xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Habilidades e Certificações
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200"
                  >
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
