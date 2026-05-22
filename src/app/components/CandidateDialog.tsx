import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X, ArrowUpRight, XCircle, Calendar, MapPin, CheckCircle, Clock,
  ChevronDown, ChevronLeft, ChevronRight, ArrowLeft,
} from "lucide-react";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isToday,
  addMonths, subMonths, isBefore, startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { STAGE_ORDER, STAGE_LABELS } from "../types";
import type { Candidate } from "../types";
import { useApp } from "../context/AppContext";

interface SelectedEntry {
  candidate: Candidate;
  stageId: string;
  dotColor: string;
}

interface Props {
  entry: SelectedEntry | null;
  onClose: () => void;
  onAdvance: (candidateId: string, fromStageId: string, toStageId: string, feedback: string) => void;
  onDecline: (candidateId: string) => void;
}

const ADVANCE_OPTIONS = [
  { id: "assessment", label: "Avaliação", dotColor: "#8B5CF6" },
  { id: "interview", label: "Entrevista", dotColor: "#3B82F6" },
  { id: "hired", label: "Contratado", dotColor: "#16A34A" },
];

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getDefaultTarget(currentStageId: string): string {
  const currentIdx = STAGE_ORDER.indexOf(currentStageId);
  for (const opt of ADVANCE_OPTIONS) {
    if (STAGE_ORDER.indexOf(opt.id) > currentIdx) return opt.id;
  }
  return "hired";
}

function CalendarPicker({ selected, onSelect, dotColor }: { selected: Date; onSelect: (d: Date) => void; dotColor: string }) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected));
  const today = startOfDay(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 }),
  });

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-foreground capitalize">
          {format(viewMonth, "MMMM yyyy", { locale: ptBR })}
        </span>
        <button
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-muted-foreground"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day) => {
          const isSelected = isSameDay(day, selected);
          const isPast = isBefore(startOfDay(day), today);
          const isOtherMonth = !isSameMonth(day, viewMonth);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={day.toISOString()}
              disabled={isPast}
              onClick={() => onSelect(day)}
              className={[
                "h-8 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                isSelected ? "text-white font-bold shadow-sm"
                  : isCurrentDay ? "font-bold"
                  : isPast ? "text-slate-300 cursor-not-allowed"
                  : isOtherMonth ? "text-slate-400 hover:bg-slate-50"
                  : "text-foreground hover:bg-slate-100",
              ].join(" ")}
              style={
                isSelected
                  ? { backgroundColor: dotColor }
                  : isCurrentDay && !isSelected
                  ? { color: dotColor, outline: `2px solid ${dotColor}`, outlineOffset: "-2px" }
                  : {}
              }
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PipelineProgressVisual({ currentStageId, dotColor }: { currentStageId: string; dotColor: string }) {
  const currentIdx = STAGE_ORDER.indexOf(currentStageId);
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        Progresso no Pipeline
      </p>
      <div className="flex items-center mb-4">
        {STAGE_LABELS.map((s, i) => {
          const done = i <= currentIdx;
          const current = i === currentIdx;
          return (
            <div key={s} className="flex items-center" style={{ flex: i < STAGE_LABELS.length - 1 ? 1 : undefined }}>
              <div
                className="w-3 h-3 rounded-full shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: current ? dotColor : done ? `${dotColor}55` : "#E2E8F0",
                  boxShadow: current ? `0 0 8px ${dotColor}99` : "none",
                }}
              />
              {i < STAGE_LABELS.length - 1 && (
                <div className="h-0.5 flex-1"
                  style={{ backgroundColor: done && i < currentIdx ? `${dotColor}55` : "#E2E8F0" }} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between">
        {STAGE_LABELS.map((s, i) => (
          <span key={s} className="text-[10px] uppercase tracking-wide font-medium"
            style={{ color: i === currentIdx ? dotColor : "#CBD5E1" }}>
            {s.slice(0, 3)}
          </span>
        ))}
      </div>
    </div>
  );
}

function TimelineHistory({ timeline }: { timeline?: Candidate["timeline"] }) {
  if (!timeline || timeline.length === 0) return null;
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Histórico de Avaliações
      </p>
      {timeline.map((entry) => (
        <div key={entry.id} className="bg-slate-50 border border-border rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    entry.decision === "approved" ? "#10B981"
                      : entry.decision === "rejected" ? "#EF4444"
                      : "#F59E0B",
                }}
              />
              <span className="text-sm font-bold text-foreground">{entry.stageName}</span>
              {entry.decision === "approved" && <CheckCircle className="w-4 h-4 text-green-600" />}
              {entry.decision === "rejected" && <XCircle className="w-4 h-4 text-red-600" />}
              {entry.decision === "pending" && <Clock className="w-4 h-4 text-amber-600" />}
            </div>
            <span className="text-xs text-muted-foreground">{entry.date}</span>
          </div>
          <div className="mb-2">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Entrevistador:</span> {entry.interviewer}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Parecer</p>
            <p className="text-sm text-foreground leading-relaxed">{entry.feedback}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CandidateDialog({ entry, onClose, onAdvance, onDecline }: Props) {
  const { currentUser, updateCandidate } = useApp();

  const [targetStageId, setTargetStageId] = useState<string>("assessment");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedDate, setSchedDate] = useState<Date>(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d;
  });
  const [schedTime, setSchedTime] = useState("09:00");

  useEffect(() => {
    if (entry) {
      setTargetStageId(getDefaultTarget(entry.stageId));
      setFeedbackText("");
      setShowScheduler(false);
      if (entry.candidate.scheduledAt) {
        const [y, m, d] = entry.candidate.scheduledAt.date.split("-").map(Number);
        setSchedDate(new Date(y, m - 1, d));
        setSchedTime(entry.candidate.scheduledAt.time);
      } else {
        const d = new Date(); d.setDate(d.getDate() + 1);
        setSchedDate(d);
        setSchedTime("09:00");
      }
    }
  }, [entry?.candidate.id, entry?.stageId]);

  if (!entry) return null;
  const { candidate, stageId, dotColor } = entry;
  const currentIdx = STAGE_ORDER.indexOf(stageId);
  const stageLabel = STAGE_LABELS[currentIdx];
  const isHired = stageId === "hired";
  const selectedOption = ADVANCE_OPTIONS.find((o) => o.id === targetStageId) ?? ADVANCE_OPTIONS[2];

  const handleConfirm = () => {
    onAdvance(candidate.id, stageId, targetStageId, feedbackText);
    onClose();
  };

  const handleSaveSchedule = () => {
    updateCandidate(candidate.id, {
      scheduledAt: {
        date: format(schedDate, "yyyy-MM-dd"),
        time: schedTime,
        stageLabel,
      },
    });
    setShowScheduler(false);
  };

  const formattedSchedule = candidate.scheduledAt
    ? (() => {
        const [y, m, d] = candidate.scheduledAt.date.split("-").map(Number);
        return `${format(new Date(y, m - 1, d), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às ${candidate.scheduledAt.time}`;
      })()
    : null;

  return (
    <Dialog.Root open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="fixed inset-0 flex flex-col justify-end md:items-center md:justify-center z-50 md:p-4"
          aria-describedby={undefined}
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col relative"
            style={{ maxWidth: 680, maxHeight: "92vh" }}
          >
            {/* Mobile drag handle */}
            <div className="md:hidden flex justify-center pt-3 pb-0 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>
            {/* ── Scheduling overlay ── */}
            {showScheduler && (
              <div className="absolute inset-0 bg-white z-10 flex flex-col rounded-t-2xl md:rounded-2xl">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
                  <button
                    onClick={() => setShowScheduler(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <Dialog.Title className="text-base font-bold leading-tight">
                      {candidate.scheduledAt ? "Redefinir Agendamento" : "Agendar Entrevista"}
                    </Dialog.Title>
                    <p className="text-xs text-muted-foreground">{candidate.name}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5" style={{ scrollbarWidth: "thin" }}>
                  {candidate.scheduledAt && (
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Agendamento Atual</p>
                        <p className="text-sm font-semibold text-blue-900 mt-0.5">{formattedSchedule}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-border rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Selecione o Dia</p>
                    <CalendarPicker selected={schedDate} onSelect={setSchedDate} dotColor={dotColor} />
                  </div>

                  <div className="bg-slate-50 border border-border rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Horário</p>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                      <input
                        type="time"
                        value={schedTime}
                        onChange={(e) => setSchedTime(e.target.value)}
                        className="flex-1 bg-white border-2 border-border rounded-lg px-4 py-2.5 text-base font-semibold text-foreground focus:outline-none focus:border-slate-400 transition-colors"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Horário de Brasília (BRT, UTC−3)</p>
                  </div>

                  <div
                    className="rounded-xl p-4 border-2"
                    style={{ backgroundColor: `${dotColor}0D`, borderColor: `${dotColor}33` }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: dotColor }}>
                      Resumo do Agendamento
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {format(schedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-lg font-bold mt-1" style={{ fontFamily: "'Fraunces', serif", color: dotColor }}>
                      {schedTime}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{candidate.name} · {stageLabel}</p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-border shrink-0 flex gap-2.5">
                  <button
                    onClick={() => setShowScheduler(false)}
                    className="flex-1 py-3 rounded-xl border border-border text-muted-foreground text-sm font-semibold hover:bg-muted transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveSchedule}
                    className="flex-1 py-3 rounded-xl text-white text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: dotColor }}
                  >
                    {candidate.scheduledAt ? "Atualizar Agendamento" : "Confirmar Agendamento"}
                  </button>
                </div>
              </div>
            )}

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${dotColor}22`, color: dotColor, border: `1px solid ${dotColor}44` }}
                >
                  {stageLabel}
                </span>
                <div>
                  <Dialog.Title className="text-xl font-bold leading-tight">{candidate.name}</Dialog.Title>
                  <p className="text-sm text-muted-foreground">{candidate.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {candidate.scheduledAt && (
                  <button
                    onClick={() => setShowScheduler(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:opacity-80"
                    style={{ backgroundColor: `${dotColor}10`, borderColor: `${dotColor}40`, color: dotColor }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {candidate.scheduledAt.date.split("-").reverse().join("/")} · {candidate.scheduledAt.time}
                  </button>
                )}
                <Dialog.Close className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </Dialog.Close>
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "thin" }}>
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Localização", value: candidate.location, icon: MapPin },
                  { label: "Na Etapa", value: `${candidate.daysInStage || 0} dias`, icon: Clock },
                  { label: "Origem", value: candidate.source, icon: ArrowUpRight },
                  { label: "Proficiência", value: candidate.proficiencyLevel || "—", icon: CheckCircle },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3.5 border border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {/* Email / Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">E-mail</p>
                  <p className="text-sm text-foreground">{candidate.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Telefone</p>
                  <p className="text-sm text-foreground">{candidate.phone || "—"}</p>
                </div>
              </div>

              {/* Habilidades */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Habilidades</p>
                <div className="flex flex-wrap gap-2">
                  {candidate.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1.5 rounded-full font-medium border"
                      style={{ borderColor: `${dotColor}40`, color: dotColor, backgroundColor: `${dotColor}0D` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Observação */}
              {candidate.note && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Observação do Recrutador
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-900 leading-relaxed">{candidate.note}</p>
                  </div>
                </div>
              )}

              {/* Progresso visual */}
              <PipelineProgressVisual currentStageId={stageId} dotColor={dotColor} />

              {/* ── Mover Candidato (inline no body) ── */}
              {!isHired && (
                <div className="bg-slate-50 rounded-xl border border-border p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mover Candidato</p>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Próxima Etapa</label>
                    <div className="relative">
                      <select
                        value={targetStageId}
                        onChange={(e) => setTargetStageId(e.target.value)}
                        className="w-full appearance-none bg-white border-2 rounded-lg px-4 py-2.5 pr-10 text-sm font-semibold focus:outline-none transition-colors cursor-pointer"
                        style={{ borderColor: `${selectedOption.dotColor}66`, color: selectedOption.dotColor }}
                      >
                        {ADVANCE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id} style={{ color: opt.dotColor }}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: selectedOption.dotColor }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                      Parecer do Entrevistador
                      <span className="ml-1 text-[10px] normal-case font-normal text-muted-foreground/60">
                        — {currentUser.name}
                      </span>
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Descreva o resultado desta etapa e a recomendação para o candidato..."
                      rows={3}
                      className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Histórico de Avaliações */}
              <TimelineHistory timeline={candidate.timeline} />

              {/* Assessment */}
              {candidate.assessment && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-green-900 mb-3">
                    Resultado do Teste de Avaliação
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-border">
                      <div className="text-3xl font-bold text-green-600" style={{ fontFamily: "'Fraunces', serif" }}>
                        {candidate.assessment.score}%
                      </div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Pontuação</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-border">
                      <div className="text-sm font-semibold text-foreground mb-1">{candidate.assessment.evaluatorName}</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Avaliador</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-border">
                      <div className="text-sm font-semibold text-foreground mb-1">{candidate.assessment.date}</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Data</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Evaluation */}
              {candidate.evaluation && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-purple-900 mb-4">
                    Avaliação de Competências
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: "Fluência e Pronúncia", value: candidate.evaluation.fluencyPronunciation },
                      { label: "Gramática e Vocabulário", value: candidate.evaluation.grammarVocabulary },
                      { label: "Habilidades Pedagógicas", value: candidate.evaluation.teachingSkills },
                      { label: "Gestão de Sala", value: candidate.evaluation.classroomManagement },
                      { label: "Didática", value: candidate.evaluation.didactics },
                      { label: "Postura Profissional", value: candidate.evaluation.professionalAttitude },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white rounded-lg p-3 border border-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
                          style={{ backgroundColor: value >= 4 ? "#10B981" : value >= 3 ? "#F59E0B" : "#EF4444" }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                  {candidate.evaluation.summary && (
                    <div className="bg-white rounded-lg p-4 border border-border">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Resumo da Avaliação
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{candidate.evaluation.summary}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Fixed footer ── */}
            <div className="px-6 py-4 border-t border-border shrink-0">
              {isHired ? (
                <div className="flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-bold text-green-700">Candidato Contratado</span>
                </div>
              ) : (
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setShowScheduler(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all whitespace-nowrap"
                    style={
                      candidate.scheduledAt
                        ? { borderColor: `${dotColor}50`, color: dotColor, backgroundColor: `${dotColor}08` }
                        : { borderColor: "#E2E8F0", color: "#64748B" }
                    }
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    {candidate.scheduledAt ? "Redefinir" : "Agendar"}
                  </button>

                  <button
                    onClick={handleConfirm}
                    disabled={!feedbackText.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: selectedOption.dotColor }}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Mover para {selectedOption.label}
                  </button>

                  <button
                    onClick={() => { onDecline(candidate.id); onClose(); }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-400 text-sm font-semibold hover:bg-red-50 hover:text-red-500 transition-all whitespace-nowrap"
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    Reprovar
                  </button>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
