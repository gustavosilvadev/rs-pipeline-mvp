import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Download, Filter, Search, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import * as XLSX from "xlsx";

export function CandidatesReport() {
  const { candidates, jobs } = useApp();
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const units = useMemo(() => {
    const allUnits = jobs.map((j) => j.location);
    return ["all", ...Array.from(new Set(allUnits))];
  }, [jobs]);

  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter((c) => c.status === "active");

    if (selectedUnit !== "all") {
      const jobsInUnit = jobs.filter((j) => j.location === selectedUnit).map((j) => j.id);
      filtered = filtered.filter((c) => c.jobId && jobsInUnit.includes(c.jobId));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
  }, [candidates, jobs, selectedUnit, searchQuery]);

  const handleExport = () => {
    const data = filteredCandidates.map((candidate) => {
      const job = jobs.find((j) => j.id === candidate.jobId);
      return {
        "Nome": candidate.name,
        "E-mail": candidate.email,
        "Telefone": candidate.phone,
        "Cargo": candidate.role,
        "Localização": candidate.location,
        "Vaga": job?.title || "—",
        "Unidade": job?.location || "—",
        "Proficiência": candidate.proficiencyLevel || "—",
        "Etapa Atual": candidate.stageId || "—",
        "Dias na Etapa": candidate.daysInStage || 0,
        "Data Inscrição": candidate.appliedDate,
        "Origem": candidate.source,
        "Habilidades": candidate.tags.join(", "),
        "Status": candidate.status === "active" ? "Ativo" : candidate.status,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório de Candidatos");

    const fileName = `relatorio-candidatos-${selectedUnit === "all" ? "todas" : selectedUnit.replace(/\s/g, "-")}-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getJobTitle = (jobId?: string) => {
    if (!jobId) return "—";
    return jobs.find((j) => j.id === jobId)?.title || "—";
  };

  const getJobUnit = (jobId?: string) => {
    if (!jobId) return "—";
    return jobs.find((j) => j.id === jobId)?.location || "—";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Relatório de Candidatos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredCandidates.length} candidato{filteredCandidates.length !== 1 ? "s" : ""} encontrado{filteredCandidates.length !== 1 ? "s" : ""}
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
          <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2">
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
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-3 max-w-7xl">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-foreground">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.role}</p>
                    </div>
                    <Link
                      to={`/candidatos/${candidate.id}/timeline`}
                      className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium hover:bg-purple-100 transition-colors flex items-center gap-1"
                    >
                      Ver Timeline
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{candidate.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{candidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{candidate.location}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Vaga: </span>
                      <span className="font-semibold text-foreground">{getJobTitle(candidate.jobId)}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Unidade: </span>
                      <span className="font-semibold text-foreground">{getJobUnit(candidate.jobId)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {candidate.proficiencyLevel && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        {candidate.proficiencyLevel}
                      </span>
                    )}
                    {candidate.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum candidato encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
