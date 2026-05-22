import { useState, useMemo, useRef } from "react";
import { useApp } from "../context/AppContext";
import { STAGES, STAGE_ORDER, STAGE_LABELS } from "../types";
import type { TimelineEntry } from "../types";
import { Clock, MapPin, Users, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { CandidateDialog } from "../components/CandidateDialog";
import { AddCandidateModal } from "../components/AddCandidateModal";
import type { Candidate } from "../types";

interface SelectedEntry {
  candidate: Candidate;
  stageId: string;
  dotColor: string;
}

function CandidateCard({ candidate, dotColor, onClick }: { candidate: Candidate; dotColor: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border bg-card border-border hover:border-slate-300 hover:shadow-md transition-all duration-200"
    >
      <p className="text-sm font-semibold text-foreground leading-snug">{candidate.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{candidate.role}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate max-w-[140px]">{candidate.location}</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
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
          <p className="text-[10px] uppercase tracking-widest text-green-800 font-bold mb-0.5">Teste</p>
          <p className="text-base font-bold text-green-700" style={{ fontFamily: "'Fraunces', serif" }}>
            {candidate.assessment.score}%
          </p>
        </div>
      )}
      {candidate.evaluation && candidate.stageId === "interview" && (
        <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-2">
          <p className="text-[10px] uppercase tracking-widest text-purple-800 font-bold mb-0.5">Avaliado</p>
          <div className="flex gap-1">
            {[candidate.evaluation.fluencyPronunciation, candidate.evaluation.grammarVocabulary, candidate.evaluation.teachingSkills].map((score, i) => (
              <div key={i} className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: score >= 4 ? "#10B981" : score >= 3 ? "#F59E0B" : "#EF4444" }}>
                {score}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {candidate.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[11px] px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium">{tag}</span>
        ))}
      </div>
    </button>
  );
}

function StageColumn({ stage, candidates, onCardClick }: {
  stage: typeof STAGES[0];
  candidates: Candidate[];
  onCardClick: (candidate: Candidate, stageId: string, dotColor: string) => void;
}) {
  return (
    <div className="flex flex-col w-72 shrink-0 h-full">
      <div className="flex items-center gap-2.5 mb-3 px-0.5">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: stage.dotColor }} />
        <span className="text-sm font-bold uppercase tracking-wider text-foreground/70">{stage.label}</span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
          style={{ backgroundColor: stage.accentColor, color: stage.dotColor }}>
          {candidates.length}
        </span>
      </div>
      <div className="h-0.5 mb-4 rounded-full" style={{ backgroundColor: stage.dotColor, opacity: 0.3 }} />
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-0.5" style={{ scrollbarWidth: "none" }}>
        {candidates.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground/50 uppercase tracking-widest">Nenhum candidato</div>
        ) : (
          candidates.map((c) => (
            <CandidateCard key={c.id} candidate={c} dotColor={stage.dotColor}
              onClick={() => onCardClick(c, stage.id, stage.dotColor)} />
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
  const [statsOpen, setStatsOpen] = useState(false);
  const touchStartX = useRef(0);

  const activeCandidates = useMemo(() => {
    let filtered = candidates.filter((c) => (c.status === "active" || c.status === "hired") && c.jobId && c.stageId);
    if (selectedJobId !== "all") filtered = filtered.filter((c) => c.jobId === selectedJobId);
    return filtered;
  }, [candidates, selectedJobId]);

  const stagesWithCandidates = useMemo(() => STAGES.map((stage) => ({
    ...stage,
    candidates: activeCandidates.filter((c) => c.stageId === stage.id),
  })), [activeCandidates]);

  const stats = useMemo(() => ({
    total: activeCandidates.length,
    applied: activeCandidates.filter((c) => c.stageId === "applied").length,
    screening: activeCandidates.filter((c) => c.stageId === "screening").length,
    assessment: activeCandidates.filter((c) => c.stageId === "assessment").length,
    interviewing: activeCandidates.filter((c) => c.stageId === "interview").length,
    hired: activeCandidates.filter((c) => c.stageId === "hired").length,
  }), [activeCandidates]);

  const mobileStageIdx = STAGES.findIndex((s) => s.id === activeMobileStage);
  const mobileStageData = stagesWithCandidates[mobileStageIdx];

  const goToStage = (dir: "prev" | "next") => {
    if (dir === "next" && mobileStageIdx < STAGES.length - 1) setActiveMobileStage(STAGES[mobileStageIdx + 1].id);
    if (dir === "prev" && mobileStageIdx > 0) setActiveMobileStage(STAGES[mobileStageIdx - 1].id);
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 55) goToStage(diff > 0 ? "next" : "prev");
  };

  const handleAdvance = (candidateId: string, fromStageId: string, toStageId: string, feedback: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    const toStageIdx = STAGE_ORDER.indexOf(toStageId);
    const newEntry: TimelineEntry = {
      id: `t${Date.now()}`, stageId: toStageId, stageName: STAGE_LABELS[toStageIdx],
      date: new Date().toISOString().split("T")[0], time: new Date().toTimeString().slice(0, 5),
      interviewer: currentUser.name, interviewerUnit: "",
      feedback: feedback || "Sem parecer registrado.",
      decision: toStageId === "hired" ? "approved" : "pending",
    };
    updateCandidate(candidateId, {
      stageId: toStageId, daysInStage: 0,
      status: toStageId === "hired" ? "hired" : "active",
      timeline: [...(candidate.timeline || []), newEntry],
    });
  };

  const handleDecline = (candidateId: string) => updateCandidate(candidateId, { status: "rejected", stageId: undefined });

  const stageStatItems = [
    { label: "Inscritos", value: stats.applied, color: "#94A3B8" },
    { label: "Triagem", value: stats.screening, color: "#F59E0B" },
    { label: "Avaliação", value: stats.assessment, color: "#8B5CF6" },
    { label: "Entrevista", value: stats.interviewing, color: "#3B82F6" },
    { label: "Contratados", value: stats.hired, color: "#16A34A" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="shrink-0 border-b border-border bg-white px-4 md:px-6 py-3">
        {/* Row 1: job filter + add */}
        <div className="flex items-center gap-2 mb-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="flex-1 min-w-0 bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-400 cursor-pointer hover:border-slate-300 transition-colors"
            style={{ WebkitAppearance: "menulist", MozAppearance: "menulist" }}
          >
            <option value="all">Todas as Vagas ({jobs.length})</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all active:scale-[0.97] shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>

        {/* Total line */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-bold text-foreground">{stats.total} candidatos no pipeline</span>
          </div>
          {/* Mobile accordion toggle */}
          <button
            onClick={() => setStatsOpen((o) => !o)}
            className="md:hidden flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver etapas
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${statsOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Stage stats — always visible on desktop, accordion on mobile */}
        <div className={`${statsOpen ? "block" : "hidden"} md:block`}>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {stageStatItems.map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-1.5 shrink-0">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-base font-bold tabular-nums" style={{ fontFamily: "'Fraunces', serif", color }}>{value}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: stage tabs ── */}
      <div className="md:hidden shrink-0 flex items-center bg-white border-b border-border">
        <button onClick={() => goToStage("prev")}
          className="px-3 py-3 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          disabled={mobileStageIdx === 0}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex">
            {stagesWithCandidates.map((stage) => {
              const active = activeMobileStage === stage.id;
              return (
                <button key={stage.id} onClick={() => setActiveMobileStage(stage.id)}
                  className="flex items-center gap-1.5 px-3 py-3 shrink-0 text-xs font-bold uppercase tracking-wide border-b-2 transition-all whitespace-nowrap"
                  style={{ borderColor: active ? stage.dotColor : "transparent", color: active ? stage.dotColor : "#94A3B8" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? stage.dotColor : "#CBD5E1" }} />
                  {stage.label}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: active ? stage.accentColor : "#F1F5F9", color: active ? stage.dotColor : "#94A3B8" }}>
                    {stage.candidates.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <button onClick={() => goToStage("next")}
          className="px-3 py-3 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          disabled={mobileStageIdx === STAGES.length - 1}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Mobile: swipeable single-stage list ── */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Swipe hint */}
        <div className="shrink-0 flex items-center justify-center gap-1.5 py-2">
          {STAGES.map((s, i) => (
            <button key={s.id} onClick={() => setActiveMobileStage(s.id)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === mobileStageIdx ? 20 : 6,
                height: 6,
                backgroundColor: i === mobileStageIdx ? mobileStageData?.dotColor : "#CBD5E1",
              }} />
          ))}
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2.5"
          style={{ scrollbarWidth: "thin" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {!mobileStageData || mobileStageData.candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: mobileStageData?.accentColor ?? "#F1F5F9" }}>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: mobileStageData?.dotColor ?? "#CBD5E1" }} />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">Nenhum candidato</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Arraste para navegar entre etapas</p>
            </div>
          ) : (
            mobileStageData.candidates.map((c) => (
              <CandidateCard key={c.id} candidate={c} dotColor={mobileStageData.dotColor}
                onClick={() => setSelectedEntry({ candidate: c, stageId: mobileStageData.id, dotColor: mobileStageData.dotColor })} />
            ))
          )}
        </div>
      </div>

      {/* ── Desktop: full horizontal kanban ── */}
      <div className="hidden md:block flex-1 overflow-x-auto overflow-y-hidden bg-slate-50"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#CBD5E1 transparent" }}>
        <div className="flex h-full gap-5 px-6 py-6 min-w-max">
          {stagesWithCandidates.map((stage) => (
            <StageColumn key={stage.id} stage={stage} candidates={stage.candidates}
              onCardClick={(candidate, stageId, dotColor) => setSelectedEntry({ candidate, stageId, dotColor })} />
          ))}
          <div className="w-2 shrink-0" />
        </div>
      </div>

      <CandidateDialog entry={selectedEntry} onClose={() => setSelectedEntry(null)}
        onAdvance={handleAdvance} onDecline={handleDecline} />
      <AddCandidateModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
