import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Download, Briefcase, Users, MapPin, Calendar, ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";

const STAGE_COLS = [
  { key: "appliedCount", label: "Inscritos", color: "#94A3B8" },
  { key: "screeningCount", label: "Triagem", color: "#F59E0B" },
  { key: "assessmentCount", label: "Avaliação", color: "#8B5CF6" },
  { key: "interviewCount", label: "Entrevista", color: "#3B82F6" },
  { key: "hiredCount", label: "Contratados", color: "#16A34A" },
  { key: "openings", label: "Vagas", color: "#64748B" },
];

export function JobsReport() {
  const { jobs, candidates } = useApp();
  const [selectedUnit, setSelectedUnit] = useState<string>("all");

  const units = useMemo(() => {
    const allUnits = jobs.map((j) => j.location);
    return ["all", ...Array.from(new Set(allUnits))];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let filtered = jobs;
    if (selectedUnit !== "all") filtered = filtered.filter((j) => j.location === selectedUnit);
    return filtered.map((job) => ({
      ...job,
      candidateCount: candidates.filter((c) => c.jobId === job.id && (c.status === "active" || c.status === "hired")).length,
      appliedCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "applied").length,
      screeningCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "screening").length,
      assessmentCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "assessment").length,
      interviewCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "interview").length,
      hiredCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "hired").length,
    }));
  }, [jobs, candidates, selectedUnit]);

  const handleExport = () => {
    const data = filteredJobs.map((job) => ({
      "Vaga": job.title, "Departamento": job.department, "Unidade": job.location,
      "Tipo": job.type, "Vagas Abertas": job.openings, "Status": job.status === "open" ? "Aberta" : "Fechada",
      "Data Criação": job.createdDate, "Total Candidatos": job.candidateCount,
      "Inscritos": job.appliedCount, "Triagem": job.screeningCount, "Avaliação": job.assessmentCount,
      "Entrevista": job.interviewCount, "Contratados": job.hiredCount,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório de Vagas");
    XLSX.writeFile(wb, `relatorio-vagas-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Relatório de Vagas</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Pipeline de recrutamento por vaga</p>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 text-sm px-3 md:px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shrink-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="flex-1 max-w-xs px-3 py-1.5 border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground bg-white"
          >
            <option value="all">Todas as Unidades</option>
            {units.slice(1).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        <div className="space-y-4 max-w-7xl">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma vaga encontrada</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border border-border rounded-xl p-4 md:p-5">

                {/* Job header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-1 leading-snug">{job.title}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />{job.department}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />{job.location}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />{job.createdDate}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                      {job.candidateCount}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      <Users className="w-3 h-3 inline mr-1" />Ativos
                    </div>
                  </div>
                </div>

                {/* Stage breakdown — touch-scrollable on mobile */}
                <div className="overflow-x-auto -mx-1" style={{ WebkitOverflowScrolling: "touch" }}>
                  <div className="flex gap-2 px-1 pb-1" style={{ minWidth: 400 }}>
                    {STAGE_COLS.map(({ key, label, color }) => {
                      const count = (job as Record<string, unknown>)[key] as number;
                      const max = Math.max(job.candidateCount, job.openings, 1);
                      const pct = Math.round((count / max) * 100);
                      return (
                        <div key={key} className="flex-1 bg-slate-50 rounded-lg p-3 border border-border min-w-[64px]">
                          <div className="text-xl md:text-2xl font-bold mb-1" style={{ color, fontFamily: "'Fraunces', serif" }}>{count}</div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
                          {/* Mini progress bar */}
                          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: color }} />
                          </div>
                        </div>
                      );
                    })}
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
