import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, ComposedChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ChevronDown, ChevronRight, User, Calendar, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Users, Briefcase, Star } from "lucide-react";
import { STAGES } from "../types";
import type { Candidate } from "../types";
import { Link } from "react-router";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

// Scrollable chart wrapper for mobile
function ChartScroll({ children, minWidth = 340 }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto -mx-1" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="px-1 pb-1" style={{ minWidth }}>
        {children}
      </div>
    </div>
  );
}

// Candidate journey tree (expanded card)
function CandidateJourneyCard({ candidate, jobs }: { candidate: Candidate; jobs: ReturnType<typeof useApp>["jobs"] }) {
  const [expanded, setExpanded] = useState(false);

  const job = jobs.find((j) => j.id === candidate.jobId);
  const stageIdx = STAGES.findIndex((s) => s.id === candidate.stageId);
  const currentStage = stageIdx >= 0 ? STAGES[stageIdx] : null;

  // const steps = useMemo(() => {
  //   const list = [{ stageName: "Inscrição", date: candidate.appliedDate, time: "—", interviewer: "Sistema", feedback: `Candidatura para ${candidate.role}`, decision: "approved" as const }];
  //   (candidate.timeline ?? []).forEach((e) => list.push({ stageName: e.stageName, date: e.date, time: e.time, interviewer: e.interviewer, feedback: e.feedback, decision: e.decision }));
  //   return list;
  // }, [candidate]);

  const steps = useMemo(() => {
    const list: {
      stageName: string;
      date: string;
      time: string;
      interviewer: string;
      feedback: string;
      decision: "approved" | "rejected" | "pending";
    }[] = [
      {
        stageName: "Inscrição",
        date: candidate.appliedDate,
        time: "—",
        interviewer: "Sistema",
        feedback: `Candidatura para ${candidate.role}`,
        decision: "approved",
      },
    ];

    (candidate.timeline ?? []).forEach((e) => {
      list.push({
        stageName: e.stageName,
        date: e.date,
        time: e.time,
        interviewer: e.interviewer,
        feedback: e.feedback,
        decision: e.decision,
      });
    });

    return list;
  }, [candidate]);


  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
        <div className="flex items-center gap-3 min-w-0">
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground text-sm truncate">{candidate.name}</p>
            <p className="text-xs text-muted-foreground truncate">{candidate.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {candidate.proficiencyLevel && (
            <span className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold hidden sm:inline">
              {candidate.proficiencyLevel}
            </span>
          )}
          {currentStage && (
            <span className="text-[11px] px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: currentStage.accentColor, color: currentStage.dotColor }}>
              {currentStage.label}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">{steps.length} etapa{steps.length !== 1 ? "s" : ""}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border">
          {/* Job info */}
          {job && (
            <div className="mb-4 bg-slate-50 rounded-lg p-3 text-xs text-muted-foreground border border-border">
              <span className="font-semibold">{job.title}</span> · {job.location}
            </div>
          )}

          {/* Vertical timeline tree */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="relative flex gap-3">
                  <div className="relative z-10 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.decision === "approved" ? "bg-green-100 text-green-600"
                        : step.decision === "rejected" ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-600"
                    }`}>
                      {step.decision === "approved" && <CheckCircle className="w-4 h-4" />}
                      {step.decision === "rejected" && <XCircle className="w-4 h-4" />}
                      {step.decision === "pending" && <AlertCircle className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="flex-1 pb-4 min-w-0">
                    <div className="bg-slate-50 rounded-xl p-3 border border-border">
                      <div className="flex flex-wrap items-start justify-between gap-1 mb-2">
                        <p className="font-bold text-sm text-foreground">{step.stageName}</p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" />{step.date}</span>
                          {step.time !== "—" && <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{step.time}</span>}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        <span className="font-semibold">Responsável:</span> {step.interviewer}
                      </p>
                      <div className="bg-white rounded-lg p-2 border border-border">
                        <p className="text-xs text-foreground leading-relaxed">{step.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to={`/candidatos/${candidate.id}/timeline`}
            className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Ver timeline completa <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

// Job pipeline tree card
function JobPipelineCard({ job, candidates }: { job: ReturnType<typeof useApp>["jobs"][0]; candidates: Candidate[] }) {
  const [expanded, setExpanded] = useState(false);

  const stageData = STAGES.map((stage) => ({
    stage,
    count: candidates.filter((c) => c.jobId === job.id && c.stageId === stage.id).length,
    people: candidates.filter((c) => c.jobId === job.id && c.stageId === stage.id),
  }));

  const total = candidates.filter((c) => c.jobId === job.id && (c.status === "active" || c.status === "hired")).length;
  const maxCount = Math.max(...stageData.map((s) => s.count), 1);

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
        <div className="flex items-center gap-3 min-w-0">
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-slate-600" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-foreground truncate">{job.title}</p>
            <p className="text-xs text-muted-foreground truncate">{job.location}</p>
          </div>
        </div>
        <div className="shrink-0 ml-2 text-right">
          <div className="text-lg font-bold tabular-nums" style={{ fontFamily: "'Fraunces', serif" }}>{total}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">candidatos</div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
          {/* Stage funnel bars */}
          {stageData.map(({ stage, count, people }) => (
            <div key={stage.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.dotColor }} />
                  <span className="text-xs font-semibold text-foreground">{stage.label}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: stage.dotColor }}>{count}</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: stage.dotColor, opacity: 0.8 }} />
              </div>
              {/* Names of candidates in this stage */}
              {count > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {people.map((p) => (
                    <span key={p.id} className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${stage.dotColor}15`, color: stage.dotColor }}>
                      {p.name.split(" ")[0]} {p.name.split(" ")[1]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
            <span>{job.openings} vaga{job.openings > 1 ? "s" : ""} disponível{job.openings > 1 ? "s" : ""}</span>
            <span className={job.status === "open" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
              {job.status === "open" ? "Aberta" : "Fechada"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Funnel visualization
function FunnelBar({ label, value, maxValue, color, pct }: { label: string; value: number; maxValue: number; color: string; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs text-muted-foreground text-right shrink-0">{label}</div>
      <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
        <div className="h-full rounded-full flex items-center px-3 transition-all duration-700"
          style={{ width: `${(value / Math.max(maxValue, 1)) * 100}%`, backgroundColor: color, minWidth: value > 0 ? 32 : 0 }}>
          {value > 0 && <span className="text-white text-xs font-bold">{value}</span>}
        </div>
      </div>
      <div className="w-12 text-xs font-semibold text-right shrink-0" style={{ color }}>{pct}%</div>
    </div>
  );
}

export function Reports() {
  const { candidates, jobs } = useApp();

  const generalStats = useMemo(() => ({
    total: candidates.filter((c) => c.status === "active").length,
    rejected: candidates.filter((c) => c.status === "rejected").length,
    talentPool: candidates.filter((c) => c.status === "talent-pool").length,
    hired: candidates.filter((c) => c.status === "hired").length,
    openJobs: jobs.filter((j) => j.status === "open").length,
    totalOpenings: jobs.filter((j) => j.status === "open").reduce((s, j) => s + j.openings, 0),
  }), [candidates, jobs]);

  const candidatesByStage = useMemo(() =>
    STAGES.map((stage) => ({
      name: stage.label,
      candidatos: candidates.filter((c) => c.stageId === stage.id && c.status === "active").length,
      fill: stage.dotColor,
    })), [candidates]);

  const candidatesByProficiency = useMemo(() => {
    const levels = ["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"];
    return levels.map((level) => ({
      name: level,
      value: candidates.filter((c) => c.proficiencyLevel === level).length,
    })).filter((i) => i.value > 0);
  }, [candidates]);

  const conversionFunnel = useMemo(() => {
    const totalApplied = candidates.filter((c) => ["active", "rejected", "hired"].includes(c.status)).length;
    return STAGES.map((stage, index) => {
      const count = candidates.filter((c) => {
        if (!["active", "hired"].includes(c.status) || !c.stageId) return false;
        return STAGES.findIndex((s) => s.id === c.stageId) >= index;
      }).length;
      return { name: stage.label, candidatos: count, taxa: totalApplied > 0 ? Math.round((count / totalApplied) * 100) : 0, color: stage.dotColor };
    });
  }, [candidates]);

  const sourceData = useMemo(() => {
    const sources: Record<string, number> = {};
    candidates.forEach((c) => { sources[c.source] = (sources[c.source] || 0) + 1; });
    return Object.entries(sources).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [candidates]);

  const evaluationRadar = useMemo(() => {
    const evaluated = candidates.filter((c) => c.evaluation);
    if (evaluated.length === 0) return [];
    type EvaluationNumericKey =
  | "fluencyPronunciation"
  | "grammarVocabulary"
  | "didactics"
  | "teachingSkills"
  | "classroomManagement"
  | "professionalAttitude";

    const avg = (key: EvaluationNumericKey) =>
      Math.round(
        (
          evaluated.reduce((sum, candidate) => {
            return sum + (candidate.evaluation?.[key] ?? 0);
          }, 0) /
          evaluated.length
        ) * 10
      ) / 10;
      
    return [
      { subject: "Fluência", A: avg("fluencyPronunciation"), fullMark: 5 },
      { subject: "Gramática", A: avg("grammarVocabulary"), fullMark: 5 },
      { subject: "Didática", A: avg("didactics"), fullMark: 5 },
      { subject: "Pedagogia", A: avg("teachingSkills"), fullMark: 5 },
      { subject: "Gestão", A: avg("classroomManagement"), fullMark: 5 },
      { subject: "Postura", A: avg("professionalAttitude"), fullMark: 5 },
    ];
  }, [candidates]);

  const timeByStage = useMemo(() =>
    STAGES.map((stage) => {
      const cs = candidates.filter((c) => c.stageId === stage.id && c.status === "active");
      return { name: stage.label, dias: cs.length > 0 ? Math.round(cs.reduce((s, c) => s + (c.daysInStage || 0), 0) / cs.length) : 0 };
    }).filter((i) => i.dias > 0), [candidates]);

  const activeWithTimeline = useMemo(() =>
    candidates.filter((c) => (c.status === "active" || c.status === "hired") && c.jobId)
      .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)), [candidates]);

  const statItems = [
    { label: "Total Ativo", value: generalStats.total, color: "#3B82F6", icon: Users },
    { label: "Vagas Abertas", value: generalStats.openJobs, color: "#10B981", icon: Briefcase },
    { label: "Posições", value: generalStats.totalOpenings, color: "#F59E0B", icon: Star },
    { label: "Contratados", value: generalStats.hired, color: "#16A34A", icon: CheckCircle },
    { label: "Reprovados", value: generalStats.rejected, color: "#EF4444", icon: XCircle },
    { label: "Banco Talentos", value: generalStats.talentPool, color: "#8B5CF6", icon: Star },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-4 md:px-6 py-4">
        <h1 className="text-xl md:text-2xl font-bold">Dashboard Analítico</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Visão completa do processo seletivo · {candidates.length} candidatos · {jobs.length} vagas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        <div className="space-y-6 max-w-7xl">

          {/* ── KPI Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {statItems.map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="bg-white border border-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className="w-4 h-4" style={{ color }} />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground leading-tight">{label}</p>
                </div>
                <p className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif", color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── Charts row 1 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Candidates by stage — bar */}
            <div className="bg-white border border-border rounded-xl p-4 md:p-6 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h2 className="text-base font-bold">Candidatos por Etapa</h2>
              </div>
              <ChartScroll minWidth={320}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={candidatesByStage} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: 12 }} />
                    <Bar dataKey="candidatos" radius={[8, 8, 0, 0]}>
                      {candidatesByStage.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartScroll>
            </div>

            {/* Proficiency pie */}
            <div className="bg-white border border-border rounded-xl p-4 md:p-6">
              <h2 className="text-base font-bold mb-4">Nível de Proficiência</h2>
              <ChartScroll minWidth={200}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={candidatesByProficiency} cx="50%" cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80} dataKey="value">
                      {candidatesByProficiency.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartScroll>
            </div>
          </div>

          {/* ── Charts row 2 ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source distribution */}
            <div className="bg-white border border-border rounded-xl p-4 md:p-6">
              <h2 className="text-base font-bold mb-4">Origem dos Candidatos</h2>
              <ChartScroll minWidth={260}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sourceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: 12 }} />
                    <Bar dataKey="value" name="Candidatos" fill="#3B82F6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartScroll>
            </div>

            {/* Avg time per stage */}
            <div className="bg-white border border-border rounded-xl p-4 md:p-6">
              <h2 className="text-base font-bold mb-4">Tempo Médio por Etapa</h2>
              <ChartScroll minWidth={260}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={timeByStage} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} unit="d" />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: 12 }} formatter={(v) => [`${v} dias`, "Média"]} />
                    <Bar dataKey="dias" fill="#8B5CF6" name="Dias médios" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartScroll>
            </div>
          </div>

          {/* ── Funnel de Conversão ── */}
          <div className="bg-white border border-border rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-base font-bold">Funil de Conversão</h2>
            </div>
            <div className="space-y-3">
              {conversionFunnel.map((item) => (
                <FunnelBar key={item.name} label={item.name} value={item.candidatos}
                  maxValue={conversionFunnel[0].candidatos} color={item.color} pct={item.taxa} />
              ))}
            </div>
          </div>

          {/* ── Radar de Competências (if data exists) ── */}
          {evaluationRadar.length > 0 && (
            <div className="bg-white border border-border rounded-xl p-4 md:p-6">
              <h2 className="text-base font-bold mb-1">Radar de Competências</h2>
              <p className="text-xs text-muted-foreground mb-4">Média das avaliações realizadas (escala 1–5)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <ChartScroll minWidth={260}>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={evaluationRadar}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <Radar name="Média" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} strokeWidth={2} />
                      <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartScroll>
                <div className="grid grid-cols-2 gap-2">
                  {evaluationRadar.map((item) => (
                    <div key={item.subject} className="bg-slate-50 rounded-xl p-3 border border-border">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.subject}</p>
                      <p className="text-2xl font-bold mt-1" style={{ fontFamily: "'Fraunces', serif", color: item.A >= 4 ? "#10B981" : item.A >= 3 ? "#F59E0B" : "#EF4444" }}>
                        {item.A}
                      </p>
                      <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(item.A / 5) * 100}%`, backgroundColor: item.A >= 4 ? "#10B981" : item.A >= 3 ? "#F59E0B" : "#EF4444" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Árvore de Candidatos ── */}
          <div className="bg-white border border-border rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-bold">Árvore de Candidatos</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Jornada completa de cada candidato — datas, entrevistadores e pareceres
            </p>
            {activeWithTimeline.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Nenhum candidato com histórico</div>
            ) : (
              <div className="space-y-2">
                {activeWithTimeline.map((c) => (
                  <CandidateJourneyCard key={c.id} candidate={c} jobs={jobs} />
                ))}
              </div>
            )}
          </div>

          {/* ── Árvore de Vagas ── */}
          <div className="bg-white border border-border rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-slate-500" />
              <h2 className="text-base font-bold">Árvore de Vagas</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Pipeline por vaga — quantidade de candidatos em cada etapa
            </p>
            <div className="space-y-2">
              {jobs.map((job) => (
                <JobPipelineCard key={job.id} job={job} candidates={candidates} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
