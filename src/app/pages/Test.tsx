import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Save, CheckCircle, Clock, User } from "lucide-react";
import type { AssessmentQuestion, EssayTopic, Assessment } from "../types";

const MULTIPLE_CHOICE_QUESTIONS: Omit<AssessmentQuestion, "selectedAnswer">[] = [
  {
    id: "q1",
    question: "Which sentence is grammatically correct?",
    options: [
      "She don't like coffee",
      "She doesn't likes coffee",
      "She doesn't like coffee",
      "She not like coffee"
    ],
    correctAnswer: 2
  },
  {
    id: "q2",
    question: "Choose the correct form of the verb: 'I _____ to the store yesterday.'",
    options: ["go", "went", "gone", "going"],
    correctAnswer: 1
  },
  {
    id: "q3",
    question: "What is the past participle of 'write'?",
    options: ["wrote", "writed", "written", "writing"],
    correctAnswer: 2
  },
  {
    id: "q4",
    question: "Which word is a synonym for 'happy'?",
    options: ["sad", "joyful", "angry", "tired"],
    correctAnswer: 1
  },
  {
    id: "q5",
    question: "Complete: 'If I _____ rich, I would travel the world.'",
    options: ["am", "was", "were", "be"],
    correctAnswer: 2
  },
  {
    id: "q6",
    question: "Which is the correct comparative form?",
    options: ["more good", "gooder", "better", "best"],
    correctAnswer: 2
  },
  {
    id: "q7",
    question: "Choose the correct preposition: 'She is interested _____ learning English.'",
    options: ["on", "in", "at", "for"],
    correctAnswer: 1
  },
  {
    id: "q8",
    question: "What is the meaning of 'break the ice'?",
    options: [
      "To cool down a drink",
      "To start a conversation in a social setting",
      "To break something fragile",
      "To stop a conversation"
    ],
    correctAnswer: 1
  },
  {
    id: "q9",
    question: "Which sentence uses the present perfect correctly?",
    options: [
      "I have seen that movie yesterday",
      "I have saw that movie",
      "I have seen that movie before",
      "I am seeing that movie"
    ],
    correctAnswer: 2
  },
  {
    id: "q10",
    question: "Choose the correct article: '_____ university is located in the city center.'",
    options: ["A", "An", "The", "No article needed"],
    correctAnswer: 2
  },
];

const ESSAY_TOPICS: Omit<EssayTopic, "response">[] = [
  {
    id: "e1",
    topic: "Describe your teaching philosophy and methodology for English language instruction."
  },
  {
    id: "e2",
    topic: "How would you engage students who are struggling with English pronunciation?"
  },
  {
    id: "e3",
    topic: "Write about a challenging situation you faced in a classroom and how you resolved it."
  },
  {
    id: "e4",
    topic: "Explain how you would incorporate technology and multimedia resources in your English lessons."
  },
  {
    id: "e5",
    topic: "Describe your approach to teaching English grammar in a way that is engaging and effective."
  },
];

export function Test() {
  const { candidates, updateCandidate } = useApp();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [multipleChoice, setMultipleChoice] = useState<AssessmentQuestion[]>(
    MULTIPLE_CHOICE_QUESTIONS.map(q => ({ ...q, selectedAnswer: undefined }))
  );
  const [essays, setEssays] = useState<EssayTopic[]>(
    ESSAY_TOPICS.map(t => ({ ...t, response: "" }))
  );
  const [evaluatorName, setEvaluatorName] = useState("");
  const [saved, setSaved] = useState(false);

  const activeCandidates = useMemo(() => {
    return candidates.filter(c => c.status === "active" && c.stageId === "assessment");
  }, [candidates]);

  const selectedCandidate = useMemo(() => {
    return candidates.find(c => c.id === selectedCandidateId);
  }, [candidates, selectedCandidateId]);

  const score = useMemo(() => {
    const correct = multipleChoice.filter(
      q => q.selectedAnswer !== undefined && q.selectedAnswer === q.correctAnswer
    ).length;
    return Math.round((correct / multipleChoice.length) * 100);
  }, [multipleChoice]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setMultipleChoice(prev =>
      prev.map(q => q.id === questionId ? { ...q, selectedAnswer: answerIndex } : q)
    );
  };

  const handleEssayChange = (topicId: string, response: string) => {
    setEssays(prev =>
      prev.map(t => t.id === topicId ? { ...t, response } : t)
    );
  };

  const handleSave = () => {
    if (!selectedCandidateId || !evaluatorName) {
      alert("Por favor, selecione um candidato e informe o nome do avaliador.");
      return;
    }

    const assessment: Assessment = {
      id: Date.now().toString(),
      candidateId: selectedCandidateId,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      multipleChoice,
      essays,
      score,
      evaluatorName,
      evaluatorUnit: selectedCandidate?.jobId ? "Unidade Principal" : "Sistema",
    };

    updateCandidate(selectedCandidateId, { assessment });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Teste de Avaliação de Candidatos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Aplicar teste de proficiência e habilidades pedagógicas
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={!selectedCandidateId || !evaluatorName}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-bold transition-all ${
              saved
                ? "bg-green-600 text-white"
                : "bg-foreground text-background hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
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
                Salvar Avaliação
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Selecionar Candidato *
            </label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
            >
              <option value="">Escolha um candidato...</option>
              {activeCandidates.map(candidate => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} - {candidate.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Nome do Avaliador *
            </label>
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Multiple Choice Section */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Questões de Múltipla Escolha</h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600" style={{ fontFamily: "'Fraunces', serif" }}>
                  {score}%
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Pontuação
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {multipleChoice.map((question, idx) => (
                <div key={question.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                  <p className="text-sm font-bold mb-3">
                    {idx + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          question.selectedAnswer === optIdx
                            ? "border-blue-500 bg-blue-50"
                            : "border-border hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          checked={question.selectedAnswer === optIdx}
                          onChange={() => handleAnswerChange(question.id, optIdx)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Essay Section */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Questões Dissertativas em Inglês</h2>
            <div className="space-y-6">
              {essays.map((essay, idx) => (
                <div key={essay.id}>
                  <label className="block text-sm font-bold mb-2">
                    {idx + 1}. {essay.topic}
                  </label>
                  <textarea
                    value={essay.response || ""}
                    onChange={(e) => handleEssayChange(essay.id, e.target.value)}
                    placeholder="Write your answer in English (minimum 100 words)..."
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    {essay.response?.split(/\s+/).filter(w => w).length || 0} palavras
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Assessment */}
          {selectedCandidate?.assessment && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-bold">Avaliação Concluída</h3>
                  <p className="text-sm text-muted-foreground">Teste aplicado com sucesso</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-border">
                  <div className="text-2xl font-bold text-green-600" style={{ fontFamily: "'Fraunces', serif" }}>
                    {selectedCandidate.assessment.score}%
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    Pontuação Final
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{selectedCandidate.assessment.evaluatorName}</span>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Avaliador
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{selectedCandidate.assessment.date} às {selectedCandidate.assessment.time}</span>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Data/Hora
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
