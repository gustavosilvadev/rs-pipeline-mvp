import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronDown, ChevronRight, User, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { STAGES } from "../types";
import type { Candidate } from "../types";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

function CandidateTimeline({ candidate }: { candidate: Candidate }) {
  const [expanded, setExpanded] = useState(false);

  const timelineSteps = useMemo(() => {
    const steps = [];

    steps.push({
      stage: "Inscrição",
      date: candidate.appliedDate,
      time: "14:30",
      status: "completed",
      interviewer: "Sistema",
      feedback: `Candidatura recebida para ${candidate.role}`,
    });

    if (candidate.timeline && candidate.timeline.length > 0) {
      candidate.timeline.forEach((entry) => {
        steps.push({
          stage: entry.stageName,
          date: entry.date,
          time: "10:00",
          status: entry.decision === "approved" ? "completed" : entry.decision === "rejected" ? "rejected" : "pending",
          interviewer: entry.interviewer,
          feedback: entry.feedback,
        });
      });
    }

    if (candidate.stageId) {
      const currentStageIndex = STAGES.findIndex((s) => s.id === candidate.stageId);
      if (currentStageIndex > steps.length - 1) {
        const currentStage = STAGES[currentStageIndex];
        steps.push({
          stage: currentStage.label,
          date: "Em andamento",
          time: "—",
          status: "pending",
          interviewer: "Aguardando",
          feedback: "Candidato nesta etapa atualmente",
        });
      }
    }

    return steps;
  }, [candidate]);

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
          <User className="w-5 h-5 text-blue-600" />
          <div className="text-left">
            <h3 className="font-bold text-foreground">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground">{candidate.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {candidate.proficiencyLevel && (
            <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
              {candidate.proficiencyLevel}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {timelineSteps.length} etapa{timelineSteps.length > 1 ? "s" : ""}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-2">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-6">
              {timelineSteps.map((step, index) => (
                <div key={index} className="relative flex gap-4">
                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : step.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {step.status === "completed" && <CheckCircle className="w-6 h-6" />}
                      {step.status === "rejected" && <XCircle className="w-6 h-6" />}
                      {step.status === "pending" && <AlertCircle className="w-6 h-6" />}
                    </div>
                  </div>

                  <div className="flex-1 pb-6">
                    <div className="bg-slate-50 rounded-xl p-4 border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-foreground">{step.stage}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {step.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {step.time}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          <span className="font-semibold">Responsável:</span> {step.interviewer}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-border">
                        <p className="text-sm text-foreground leading-relaxed">{step.feedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Reports() {
  const { candidates, jobs } = useApp();

  const generalStats = useMemo(() => {
    const total = candidates.filter((c) => c.status === "active").length;
    const rejected = candidates.filter((c) => c.status === "rejected").length;
    const talentPool = candidates.filter((c) => c.status === "talent-pool").length;
    const hired = candidates.filter((c) => c.status === "hired").length;
    const openJobs = jobs.filter((j) => j.status === "open").length;
    const totalOpenings = jobs.filter((j) => j.status === "open").reduce((sum, j) => sum + j.openings, 0);

    return { total, rejected, talentPool, hired, openJobs, totalOpenings };
  }, [candidates, jobs]);

  const candidatesByStage = useMemo(() => {
    return STAGES.map((stage) => ({
      name: stage.label,
      candidatos: candidates.filter((c) => c.stageId === stage.id && c.status === "active").length,
    }));
  }, [candidates]);

  const candidatesByProficiency = useMemo(() => {
    const levels = ["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"];
    return levels.map((level) => ({
      name: level,
      value: candidates.filter((c) => c.proficiencyLevel === level && c.status === "active").length,
    })).filter((item) => item.value > 0);
  }, [candidates]);

  const candidatesByUnit = useMemo(() => {
    const units: { [key: string]: number } = {};
    jobs.forEach((job) => {
      const unit = job.location.split(" - ")[1] || job.location;
      const count = candidates.filter((c) => c.jobId === job.id && c.status === "active").length;
      if (units[unit]) {
        units[unit] += count;
      } else {
        units[unit] = count;
      }
    });
    return Object.entries(units).map(([name, value]) => ({ name, candidatos: value }));
  }, [candidates, jobs]);

  const jobsWithCandidates = useMemo(() => {
    return jobs.map((job) => ({
      name: job.title,
      candidatos: candidates.filter((c) => c.jobId === job.id && c.status === "active").length,
      vagas: job.openings,
    }));
  }, [jobs, candidates]);

  const conversionFunnel = useMemo(() => {
    const totalApplied = candidates.filter((c) => c.status === "active" || c.status === "rejected" || c.status === "hired").length;

    return STAGES.map((stage, index) => {
      const count = candidates.filter((c) => {
        if (c.status !== "active" && c.status !== "hired") return false;
        if (!c.stageId) return false;
        const currentIdx = STAGES.findIndex((s) => s.id === c.stageId);
        return currentIdx >= index;
      }).length;

      const percentage = totalApplied > 0 ? ((count / totalApplied) * 100).toFixed(1) : "0";

      return {
        name: stage.label,
        candidatos: count,
        taxa: parseFloat(percentage),
      };
    });
  }, [candidates]);

  const timeByStage = useMemo(() => {
    const stageData = STAGES.map((stage) => {
      const candidatesInStage = candidates.filter((c) => c.stageId === stage.id && c.status === "active");
      const avgDays = candidatesInStage.length > 0
        ? Math.round(candidatesInStage.reduce((sum, c) => sum + (c.daysInStage || 0), 0) / candidatesInStage.length)
        : 0;

      return {
        name: stage.label,
        dias: avgDays,
      };
    }).filter((item) => item.dias > 0);

    return stageData;
  }, [candidates]);

  const activeCandidatesWithTimeline = useMemo(() => {
    return candidates
      .filter((c) => c.status === "active" && c.jobId)
      .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
  }, [candidates]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold">Relatórios e Análises</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral do processo seletivo e progresso dos candidatos
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Total Ativo</p>
              <p className="text-3xl font-bold text-blue-600" style={{ fontFamily: "'Fraunces', serif" }}>
                {generalStats.total}
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Vagas Abertas</p>
              <p className="text-3xl font-bold text-green-600" style={{ fontFamily: "'Fraunces', serif" }}>
                {generalStats.openJobs}
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Posições</p>
              <p className="text-3xl font-bold text-amber-600" style={{ fontFamily: "'Fraunces', serif" }}>
                {generalStats.totalOpenings}
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Contratados</p>
              <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: "'Fraunces', serif" }}>
                {generalStats.hired}
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Reprovados</p>
              <p className="text-3xl font-bold text-red-600" style={{ fontFamily: "'Fraunces', serif" }}>
                {generalStats.rejected}
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Banco Talentos</p>
              <p className="text-3xl font-bold text-purple-600" style={{ fontFamily: "'Fraunces', serif" }}>
                {generalStats.talentPool}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-border rounded-xl p-6 lg:col-span-2">
              <h2 className="text-lg font-bold mb-4">Candidatos por Etapa do Pipeline</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={candidatesByStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="candidatos" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Distribuição por Nível de Proficiência</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={candidatesByProficiency}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {candidatesByProficiency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Candidatos por Unidade</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={candidatesByUnit} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="candidatos" fill="#10B981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Vagas vs Candidatos</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobsWithCandidates}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="vagas" fill="#F59E0B" name="Vagas Abertas" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="candidatos" fill="#3B82F6" name="Candidatos" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Tempo Médio por Etapa</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeByStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="dias" fill="#8B5CF6" name="Dias Médios" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-xl p-6 lg:col-span-3">
              <h2 className="text-lg font-bold mb-4">Funil de Conversão do Processo Seletivo</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionFunnel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="candidatos" fill="#3B82F6" name="Candidatos" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="taxa" stroke="#10B981" strokeWidth={3} name="Taxa de Conversão (%)" dot={{ r: 6 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold">Linha do Tempo dos Candidatos</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Visualize o progresso completo de cada candidato desde a inscrição até a etapa atual
              </p>
            </div>

            <div className="space-y-3">
              {activeCandidatesWithTimeline.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum candidato com progresso no pipeline</p>
                </div>
              ) : (
                activeCandidatesWithTimeline.map((candidate) => (
                  <CandidateTimeline key={candidate.id} candidate={candidate} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
