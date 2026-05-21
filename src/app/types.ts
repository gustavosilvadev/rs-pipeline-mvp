export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
}

export interface EssayTopic {
  id: string;
  topic: string;
  response?: string;
}

export interface Assessment {
  id: string;
  candidateId: string;
  date: string;
  time: string;
  multipleChoice: AssessmentQuestion[];
  essays: EssayTopic[];
  score: number;
  evaluatorName: string;
  evaluatorUnit: string;
}

export interface CandidateEvaluation {
  candidateId: string;
  fluencyPronunciation: number; // 1-5
  grammarVocabulary: number; // 1-5
  listeningComprehension: number; // 1-5
  readingComprehension: number; // 1-5
  writingExpression: number; // 1-5
  conversationInteraction: number; // 1-5
  teachingSkills: number; // 1-5
  classroomManagement: number; // 1-5
  didactics: number; // 1-5
  professionalAttitude: number; // 1-5
  summary: string;
  evaluatorName: string;
  evaluationDate: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  tags: string[];
  appliedDate: string;
  source: string;
  jobId?: string;
  stageId?: string;
  daysInStage?: number;
  note?: string;
  status: "active" | "rejected" | "talent-pool" | "hired";
  timeline?: TimelineEntry[];
  proficiencyLevel?: "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo";
  assessment?: Assessment;
  evaluation?: CandidateEvaluation;
  rejectedAt?: {
    stageId: string;
    stageName: string;
    date: string;
    interviewer: string;
    feedback: string;
  };
  scheduledAt?: {
    date: string;
    time: string;
    stageLabel: string;
  };
}

export interface TimelineEntry {
  id: string;
  stageId: string;
  stageName: string;
  date: string;
  time: string;
  interviewer: string;
  interviewerUnit: string;
  feedback: string;
  decision: "approved" | "rejected" | "pending";
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: "open" | "closed";
  openings: number;
  createdDate: string;
  candidateCount: number;
}

export interface Stage {
  id: string;
  label: string;
  accentColor: string;
  dotColor: string;
}

export const STAGES: Stage[] = [
  { id: "applied", label: "Inscrito", accentColor: "#E2E8F0", dotColor: "#94A3B8" },
  { id: "screening", label: "Triagem", accentColor: "#FEF3C7", dotColor: "#F59E0B" },
  { id: "assessment", label: "Avaliação", accentColor: "#EDE9FE", dotColor: "#8B5CF6" },
  { id: "interview", label: "Entrevista", accentColor: "#DBEAFE", dotColor: "#3B82F6" },
  { id: "hired", label: "Contratado", accentColor: "#DCFCE7", dotColor: "#16A34A" },
];

export const STAGE_ORDER = ["applied", "screening", "assessment", "interview", "hired"];
export const STAGE_LABELS = ["Inscrito", "Triagem", "Avaliação", "Entrevista", "Contratado"];
