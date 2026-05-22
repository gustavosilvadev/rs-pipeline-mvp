import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { STAGES, STAGE_ORDER, STAGE_LABELS } from "../types";
import type { TimelineEntry } from "../types";
import { Clock, MapPin, ArrowUpRight, Calendar, Users, CheckCircle, Plus } from "lucide-react";
import { CandidateDialog } from "../components/CandidateDialog";
import { AddCandidateModal } from "../components/AddCandidateModal";
import type { Candidate } from "../types";

interface SelectedEntry {
  candidate: Candidate;
  stageId: string;
  dotColor: string;
}

function CandidateCard({
  candidate,
  dotColor,
  onClick,
}: {
  candidate: Candidate;
  dotColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border bg-card border-border hover:border-slate-300 hover:shadow-md transition-all duration-200"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate leading-snug">{candidate.name}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{candidate.role}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[120px]">{candidate.location}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {candidate.daysInStage || 0}d
          </span>
        </div>
        {candidate.proficiencyLevel && (
          <div className="mt-2">
            <span className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
              {candidate.proficiencyLevel}
            </span>
          </div>
        )}
        {candidate.assessment && candidate.stageId === "interview" && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-2">
            <p className="text-[10px] uppercase tracking-widest text-green-800 font-bold mb-0.5">Teste Concluído</p>
            <p className="text-lg font-bold text-green-700" style={{ fontFamily: "'Fraunces', serif" }}>
              {candidate.assessment.score}%
            </p>
          </div>
        )}
        {candidate.evaluation && candidate.stageId === "interview" && (
          <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-2">
            <p className="text-[10px] uppercase tracking-widest text-purple-800 font-bold mb-0.5">Avaliado</p>
            <div className="flex gap-1">
              {[candidate.evaluation.fluencyPronunciation, candidate.evaluation.grammarVocabulary, candidate.evaluation.teachingSkills].map((score, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: score >= 4 ? "#10B981" : score >= 3 ? "#F59E0B" : "#EF4444" }}
                >
                  {score}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {candidate.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[11px] px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

// Desktop-only column component
function StageColumn({
  stage,
  candidates,
  onCardClick,
}: {
  stage: typeof STAGES[0];
  candidates: Candidate[];
  onCardClick: (candidate: Candidate, stageId: string, dotColor: string) => void;
}) {
  return (
    <div className="flex flex-col w-72 shrink-0 h-full">
      <div className="flex items-center gap-2.5 mb-3 px-0.5">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: stage.dotColor }} />
        <span className="text-sm font-bold uppercase tracking-wider text-foreground/70">{stage.label}</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
          style={{ backgroundColor: stage.accentColor, color: stage.dotColor }}
        >
          {candidates.length}
        </span>
      </div>
      <div className="h-0.5 mb-4 rounded-full" style={{ backgroundColor: stage.dotColor, opacity: 0.3 }} />
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-0.5" style={{ scrollbarWidth: "none" }}>
        {candidates.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground/50 uppercase tracking-widest">
            Nenhum candidato
          </div>
        ) : (
          candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              dotColor={stage.dotColor}
              onClick={() => onCardClick(c, stage.id, stage.dotColor)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function Pipeline() {
  const { candidates, updateCandidate, jobs, currentUser } = useApp();
  const [selectedEntry, setSelectedEntry] = useState<SelectedEntry | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMobileStage, setActiveMobileStage] = useState<string>("applied");

  const activeCandidates = useMemo(() => {
    let filtered = candidates.filter(
      (c) => (c.status === "active" || c.status === "hired") && c.jobId && c.stageId
    );
    if (selectedJobId !== "all") {
      filtered = filtered.filter((c) => c.jobId === selectedJobId);
    }
    return filtered;
  }, [candidates, selectedJobId]);

  const stagesWithCandidates = useMemo(() => {
    return STAGES.map((stage) => ({
      ...stage,
      candidates: activeCandidates.filter((c) => c.stageId === stage.id),
    }));
  }, [activeCandidates]);

  const stats = useMemo(() => ({
    total: activeCandidates.length,
    interviewing: activeCandidates.filter((c) => c.stageId === "interview").length,
    offers: activeCandidates.filter((c) => c.stageId === "offer").length,
    hired: activeCandidates.filter((c) => c.stageId === "hired").length,
  }), [activeCandidates]);

  const handleAdvance = (candidateId: string, fromStageId: string, toStageId: string, feedback: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    const toStageIdx = STAGE_ORDER.indexOf(toStageId);
    const newEntry: TimelineEntry = {
      id: `t${Date.now()}`,
      stageId: toStageId,
      stageName: STAGE_LABELS[toStageIdx],
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      interviewer: currentUser.name,
      interviewerUnit: "",
      feedback: feedback || "Sem parecer registrado.",
      decision: toStageId === "hired" ? "approved" : "pending",
    };
    updateCandidate(candidateId, {
      stageId: toStageId,
      daysInStage: 0,
      status: toStageId === "hired" ? "hired" : "active",
      timeline: [...(candidate.timeline || []), newEntry],
    });
  };

  const handleDecline = (candidateId: string) => {
    updateCandidate(candidateId, { status: "rejected", stageId: undefined });
  };

  const statItems = [
    { label: "Total Ativo", value: stats.total, icon: Users, color: "#64748B" },
    { label: "Em Entrevista", value: stats.interviewing, icon: Calendar, color: "#3B82F6" },
    { label: "Propostas", value: stats.offers, icon: ArrowUpRight, color: "#10B981" },
    { label: "Contratados", value: stats.hired, icon: CheckCircle, color: "#16A34A" },
  ];

  const mobileStageData = stagesWithCandidates.find((s) => s.id === activeMobileStage);

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="shrink-0 border-b border-border bg-white px-4 md:px-6 pt-3 pb-3">
        {/* Row 1: vaga select + texto + botão */}
        <div className="flex items-center gap-2 mb-2.5">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="flex-1 min-w-0 bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:border-slate-300 transition-colors"
            style={{ WebkitAppearance: "menulist", MozAppearance: "menulist" }}
          >
            <option value="all">Todas as Vagas ({jobs.length})</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all active:scale-[0.97] shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar Candidato</span>
          </button>
        </div>

        {/* Row 2: stats */}
        <div className="flex items-center gap-5 md:gap-8 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {statItems.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-1.5 shrink-0">
              <Icon className="w-4 h-4 shrink-0" style={{ color }} />
              <span
                className="text-lg md:text-xl font-bold tabular-nums leading-none"
                style={{ fontFamily: "'Fraunces', serif", color }}
              >
                {value}
              </span>
              <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: stage tab bar ── */}
      <div
        className="md:hidden shrink-0 flex overflow-x-auto bg-white border-b border-border"
        style={{ scrollbarWidth: "none" }}
      >
        {stagesWithCandidates.map((stage) => {
          const active = activeMobileStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveMobileStage(stage.id)}
              className="flex items-center gap-1.5 px-4 py-3 shrink-0 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap"
              style={{
                borderColor: active ? stage.dotColor : "transparent",
                color: active ? stage.dotColor : "#94A3B8",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: active ? stage.dotColor : "#CBD5E1" }}
              />
              {stage.label}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: active ? stage.accentColor : "#F1F5F9",
                  color: active ? stage.dotColor : "#94A3B8",
                }}
              >
                {stage.candidates.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Mobile: single-stage list ── */}
      <div
        className="md:hidden flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-2.5"
        style={{ scrollbarWidth: "thin" }}
      >
        {!mobileStageData || mobileStageData.candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ backgroundColor: mobileStageData?.accentColor ?? "#F1F5F9" }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: mobileStageData?.dotColor ?? "#CBD5E1" }}
              />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">Nenhum candidato</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Nesta etapa no momento
            </p>
          </div>
        ) : (
          mobileStageData.candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              dotColor={mobileStageData.dotColor}
              onClick={() => setSelectedEntry({ candidate: c, stageId: mobileStageData.id, dotColor: mobileStageData.dotColor })}
            />
          ))
        )}
      </div>

      {/* ── Desktop: full horizontal kanban ── */}
      <div
        className="hidden md:block flex-1 overflow-x-auto overflow-y-hidden bg-slate-50"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#CBD5E1 transparent" }}
      >
        <div className="flex h-full gap-5 px-6 py-6 min-w-max">
          {stagesWithCandidates.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              candidates={stage.candidates}
              onCardClick={(candidate, stageId, dotColor) =>
                setSelectedEntry({ candidate, stageId, dotColor })
              }
            />
          ))}
          <div className="w-2 shrink-0" />
        </div>
      </div>

      <CandidateDialog
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onAdvance={handleAdvance}
        onDecline={handleDecline}
      />

      <AddCandidateModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
