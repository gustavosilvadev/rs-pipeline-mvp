import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Download, Filter, Briefcase, Users, MapPin, Calendar } from "lucide-react";
import * as XLSX from "xlsx";

export function JobsReport() {
  const { jobs, candidates } = useApp();
  const [selectedUnit, setSelectedUnit] = useState<string>("all");

  const units = useMemo(() => {
    const allUnits = jobs.map((j) => j.location);
    return ["all", ...Array.from(new Set(allUnits))];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let filtered = jobs;
    if (selectedUnit !== "all") {
      filtered = filtered.filter((j) => j.location === selectedUnit);
    }

    return filtered.map((job) => ({
      ...job,
      candidateCount: candidates.filter((c) => c.jobId === job.id && c.status === "active").length,
      appliedCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "applied").length,
      screeningCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "screening").length,
      assessmentCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "assessment").length,
      interviewCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "interview").length,
      hiredCount: candidates.filter((c) => c.jobId === job.id && c.stageId === "hired").length,
    }));
  }, [jobs, candidates, selectedUnit]);

  const handleExport = () => {
    const data = filteredJobs.map((job) => ({
      "Vaga": job.title,
      "Departamento": job.department,
      "Unidade": job.location,
      "Tipo": job.type,
      "Vagas Abertas": job.openings,
      "Status": job.status === "open" ? "Aberta" : "Fechada",
      "Data Criação": job.createdDate,
      "Total Candidatos": job.candidateCount,
      "Inscritos": job.appliedCount,
      "Triagem": job.screeningCount,
      "Avaliação": job.assessmentCount,
      "Entrevista": job.interviewCount,
      "Contratados": job.hiredCount,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório de Vagas");

    const fileName = `relatorio-vagas-${selectedUnit === "all" ? "todas" : selectedUnit.replace(/\s/g, "-")}-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Relatório de Vagas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visão completa do pipeline de recrutamento por vaga
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Unidade:
          </label>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground"
          >
            <option value="all">Todas as Unidades</option>
            {units.slice(1).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4 max-w-7xl">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Criada em {job.createdDate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                    {job.candidateCount}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Candidatos Ativos
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3">
                {[
                  { label: "Inscritos", count: job.appliedCount, color: "#94A3B8" },
                  { label: "Triagem", count: job.screeningCount, color: "#F59E0B" },
                  { label: "Avaliação", count: job.assessmentCount, color: "#8B5CF6" },
                  { label: "Entrevista", count: job.interviewCount, color: "#3B82F6" },
                  { label: "Contratados", count: job.hiredCount, color: "#16A34A" },
                  { label: "Vagas", count: job.openings, color: "#64748B" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-3 border border-border">
                    <div className="text-2xl font-bold mb-1" style={{ color }}>
                      {count}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma vaga encontrada para esta unidade</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
