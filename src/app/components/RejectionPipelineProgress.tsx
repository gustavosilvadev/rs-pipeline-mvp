import { useState } from "react";
import { STAGES, STAGE_ORDER, STAGE_LABELS } from "../types";
import { XCircle, AlertTriangle, User, MessageSquare } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Candidate } from "../types";

interface Props {
  candidate: Candidate;
}

export function RejectionPipelineProgress({ candidate }: Props) {
  const [showRejectionDetails, setShowRejectionDetails] = useState(false);

  if (!candidate.rejectedAt) return null;

  const rejectedStageIndex = STAGE_ORDER.indexOf(candidate.rejectedAt.stageId);

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Progresso no Pipeline
        </p>
        <div className="flex items-center">
          {STAGES.map((stage, i) => {
            const isPast = i < rejectedStageIndex;
            const isRejected = i === rejectedStageIndex;
            const isFuture = i > rejectedStageIndex;

            return (
              <div key={stage.id} className="flex items-center" style={{ flex: i < STAGES.length - 1 ? 1 : undefined }}>
                <button
                  onClick={() => isRejected && setShowRejectionDetails(true)}
                  disabled={!isRejected}
                  className={`w-3 h-3 rounded-full shrink-0 transition-all ${
                    isRejected ? "cursor-pointer hover:scale-125" : ""
                  }`}
                  style={{
                    backgroundColor: isRejected ? "#EF4444" : isPast ? `${stage.dotColor}55` : "#E2E8F0",
                    boxShadow: isRejected ? "0 0 12px #EF444488" : "none",
                  }}
                  title={isRejected ? "Clique para ver detalhes da reprovação" : undefined}
                />
                {i < STAGES.length - 1 && (
                  <div
                    className="h-0.5 flex-1"
                    style={{ backgroundColor: isPast ? `${stage.dotColor}55` : "#E2E8F0" }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {STAGE_LABELS.map((s, i) => (
            <span
              key={s}
              className="text-[10px] uppercase tracking-wide font-medium"
              style={{ color: i === rejectedStageIndex ? "#EF4444" : i < rejectedStageIndex ? "#64748B" : "#CBD5E1" }}
            >
              {s.slice(0, 3)}
            </span>
          ))}
        </div>
      </div>

      <Dialog.Root open={showRejectionDetails} onOpenChange={setShowRejectionDetails}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <Dialog.Content
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            aria-describedby={undefined}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <XCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-white">
                      Candidato Reprovado
                    </Dialog.Title>
                    <p className="text-white/90 text-sm">{candidate.rejectedAt.stageName}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-900 mb-1">
                        Reprovado na etapa: {candidate.rejectedAt.stageName}
                      </p>
                      <p className="text-xs text-red-700">
                        Data: {candidate.rejectedAt.date}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Entrevistador
                    </p>
                  </div>
                  <p className="text-sm font-bold text-foreground">{candidate.rejectedAt.interviewer}</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-amber-700" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-900">
                      Parecer / Motivo da Reprovação
                    </p>
                  </div>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {candidate.rejectedAt.feedback}
                  </p>
                </div>

                <button
                  onClick={() => setShowRejectionDetails(false)}
                  className="w-full py-2.5 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
