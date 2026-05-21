import { useState } from "react";
import { useApp } from "../context/AppContext";
import { STAGE_LABELS, STAGE_ORDER } from "../types";
import { User, Settings, Save, CheckCircle } from "lucide-react";

export function UserSettings() {
  const { currentUser, updateUser } = useApp();
  const [selectedStage, setSelectedStage] = useState(currentUser.assignedStage);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser({ assignedStage: selectedStage });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getStageLabel = (stageId: string) => {
    const idx = STAGE_ORDER.indexOf(stageId);
    return idx >= 0 ? STAGE_LABELS[idx] : stageId;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold">Configurações do Usuário</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl space-y-6">
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{currentUser.name}</h2>
                <p className="text-sm text-muted-foreground">{currentUser.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={currentUser.name}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-slate-50 text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Função
                </label>
                <input
                  type="text"
                  value={currentUser.role}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-slate-50 text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-foreground" />
              <h3 className="text-lg font-bold">Configurações de Entrevista</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Etapa Atribuída para Entrevistas
              </label>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione em qual etapa do pipeline você participará das entrevistas. Isso ajuda a organizar
                o processo seletivo e identifica sua responsabilidade no fluxo de contratação.
              </p>

              <div className="space-y-2">
                {STAGE_ORDER.map((stageId, idx) => (
                  <label
                    key={stageId}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedStage === stageId
                        ? "border-foreground bg-slate-50"
                        : "border-border hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      value={stageId}
                      checked={selectedStage === stageId}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{STAGE_LABELS[idx]}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {stageId === "screening" && "Análise inicial de currículos e triagem de perfis"}
                        {stageId === "interview" && "Condução de entrevistas técnicas e comportamentais"}
                        {stageId === "assessment" && "Avaliação de testes e desafios práticos"}
                        {stageId === "offer" && "Negociação e aprovação de propostas"}
                        {stageId === "applied" && "Verificação inicial de inscrições"}
                        {stageId === "hired" && "Onboarding e integração"}
                      </p>
                    </div>
                    {selectedStage === stageId && (
                      <CheckCircle className="w-5 h-5 text-foreground" />
                    )}
                  </label>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Etapa atual: <span className="font-semibold text-foreground">{getStageLabel(currentUser.assignedStage)}</span>
                </p>
                <button
                  onClick={handleSave}
                  disabled={selectedStage === currentUser.assignedStage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedStage === currentUser.assignedStage
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-foreground text-background hover:opacity-80"
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {saved ? "Salvo!" : "Salvar Alterações"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
