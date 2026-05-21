import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Download, Save, CheckCircle } from "lucide-react";
import type { CandidateEvaluation } from "../types";
import * as XLSX from "xlsx";

const EVALUATION_CRITERIA = [
  { key: "fluencyPronunciation", label: "Fluência e Pronúncia" },
  { key: "grammarVocabulary", label: "Gramática e Vocabulário" },
  { key: "listeningComprehension", label: "Compreensão Auditiva" },
  { key: "readingComprehension", label: "Leitura e Interpretação" },
  { key: "writingExpression", label: "Escrita e Expressão" },
  { key: "conversationInteraction", label: "Interação e Conversação" },
  { key: "teachingSkills", label: "Habilidades Pedagógicas" },
  { key: "classroomManagement", label: "Gestão de Sala" },
  { key: "didactics", label: "Didática e Metodologia" },
  { key: "professionalAttitude", label: "Postura Profissional" },
];

const RATING_OPTIONS = [
  { value: 1, label: "1 - Insuficiente", color: "#EF4444" },
  { value: 2, label: "2 - Regular", color: "#F59E0B" },
  { value: 3, label: "3 - Bom", color: "#F59E0B" },
  { value: 4, label: "4 - Muito Bom", color: "#10B981" },
  { value: 5, label: "5 - Excelente", color: "#10B981" },
];

export function CandidateEvaluationReport() {
  const { candidates, updateCandidate } = useApp();
  const [evaluations, setEvaluations] = useState<Record<string, Partial<CandidateEvaluation>>>({});
  const [saved, setSaved] = useState(false);

  const interviewCandidates = useMemo(() => {
    return candidates.filter(c => c.status === "active" && c.stageId === "interview");
  }, [candidates]);

  const handleRatingChange = (candidateId: string, criteriaKey: string, value: number) => {
    setEvaluations(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        candidateId,
        [criteriaKey]: value,
      }
    }));
  };

  const handleSummaryChange = (candidateId: string, summary: string) => {
    setEvaluations(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        candidateId,
        summary,
      }
    }));
  };

  const getAverageScore = (candidateId: string): number => {
    const evaluation = evaluations[candidateId];
    if (!evaluation) return 0;

    const scores = EVALUATION_CRITERIA.map(c => evaluation[c.key as keyof CandidateEvaluation] as number || 0);
    const validScores = scores.filter(s => s > 0);
    if (validScores.length === 0) return 0;

    return Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10;
  };

  const handleSave = () => {
    Object.entries(evaluations).forEach(([candidateId, evaluation]) => {
      if (evaluation.summary) {
        const completeEvaluation: CandidateEvaluation = {
          candidateId,
          fluencyPronunciation: evaluation.fluencyPronunciation || 0,
          grammarVocabulary: evaluation.grammarVocabulary || 0,
          listeningComprehension: evaluation.listeningComprehension || 0,
          readingComprehension: evaluation.readingComprehension || 0,
          writingExpression: evaluation.writingExpression || 0,
          conversationInteraction: evaluation.conversationInteraction || 0,
          teachingSkills: evaluation.teachingSkills || 0,
          classroomManagement: evaluation.classroomManagement || 0,
          didactics: evaluation.didactics || 0,
          professionalAttitude: evaluation.professionalAttitude || 0,
          summary: evaluation.summary,
          evaluatorName: "Coordenador Pedagógico",
          evaluationDate: new Date().toISOString().split("T")[0],
        };
        updateCandidate(candidateId, { evaluation: completeEvaluation });
      }
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExport = () => {
    const data = interviewCandidates.map(candidate => {
      const evaluation = evaluations[candidate.id] || candidate.evaluation || {};
      return {
        "Candidato": candidate.name,
        "Cargo": candidate.role,
        "Fluência e Pronúncia": evaluation.fluencyPronunciation || "-",
        "Gramática e Vocabulário": evaluation.grammarVocabulary || "-",
        "Compreensão Auditiva": evaluation.listeningComprehension || "-",
        "Leitura e Interpretação": evaluation.readingComprehension || "-",
        "Escrita e Expressão": evaluation.writingExpression || "-",
        "Interação e Conversação": evaluation.conversationInteraction || "-",
        "Habilidades Pedagógicas": evaluation.teachingSkills || "-",
        "Gestão de Sala": evaluation.classroomManagement || "-",
        "Didática e Metodologia": evaluation.didactics || "-",
        "Postura Profissional": evaluation.professionalAttitude || "-",
        "Média": getAverageScore(candidate.id) || "-",
        "Resumo": evaluation.summary || "-",
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Avaliações");

    const fileName = `avaliacao-candidatos-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold">Relatório de Avaliação de Candidatos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Avaliação detalhada de competências dos candidatos em entrevista
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar Excel
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-bold transition-all ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-foreground text-background hover:opacity-80"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Salvo!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Avaliações
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="min-w-max p-6">
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider sticky left-0 bg-purple-600 z-10 min-w-[200px]">
                    Candidato
                  </th>
                  {EVALUATION_CRITERIA.map(criteria => (
                    <th key={criteria.key} className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[140px]">
                      {criteria.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[100px] bg-yellow-500">
                    Média
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider min-w-[300px] bg-orange-500">
                    Resumo do Parecer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {interviewCandidates.map((candidate, idx) => {
                  const evaluation = evaluations[candidate.id] || candidate.evaluation || {};
                  const avgScore = getAverageScore(candidate.id);

                  return (
                    <tr key={candidate.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-4 py-3 sticky left-0 bg-inherit z-10 border-r border-border">
                        <div>
                          <p className="text-sm font-bold text-foreground">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.role}</p>
                        </div>
                      </td>

                      {EVALUATION_CRITERIA.map(criteria => {
                        const value = evaluation[criteria.key as keyof CandidateEvaluation] as number || 0;
                        const selectedOption = RATING_OPTIONS.find(o => o.value === value);

                        return (
                          <td key={criteria.key} className="px-2 py-2">
                            <select
                              value={value}
                              onChange={(e) => handleRatingChange(candidate.id, criteria.key, parseInt(e.target.value))}
                              className="w-full px-2 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{
                                backgroundColor: value > 0 ? `${selectedOption?.color}11` : "white",
                                borderColor: value > 0 ? selectedOption?.color : "#E5E7EB",
                                color: value > 0 ? selectedOption?.color : "#6B7280",
                                fontWeight: value > 0 ? "600" : "400"
                              }}
                            >
                              <option value="0">-</option>
                              {RATING_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      })}

                      <td className="px-4 py-3 text-center bg-yellow-50">
                        <div
                          className="text-2xl font-bold"
                          style={{
                            fontFamily: "'Fraunces', serif",
                            color: avgScore >= 4 ? "#10B981" : avgScore >= 3 ? "#F59E0B" : "#EF4444"
                          }}
                        >
                          {avgScore > 0 ? avgScore.toFixed(1) : "-"}
                        </div>
                      </td>

                      <td className="px-4 py-2 bg-orange-50">
                        <textarea
                          value={evaluation.summary || ""}
                          onChange={(e) => handleSummaryChange(candidate.id, e.target.value)}
                          placeholder="Digite o parecer detalhado da avaliação..."
                          rows={3}
                          className="w-full px-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {interviewCandidates.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">Nenhum candidato na etapa de Entrevista</p>
              </div>
            )}
          </div>

          <div className="mt-6 bg-white border border-border rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Legenda de Avaliação
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {RATING_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: option.color }}
                  >
                    {option.value}
                  </div>
                  <span className="text-sm">{option.label.split(" - ")[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
