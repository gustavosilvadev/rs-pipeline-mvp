import { createContext, useContext, useState, ReactNode } from "react";
import { Candidate, Job } from "../types";

interface AppContextType {
  candidates: Candidate[];
  jobs: Job[];
  currentUser: {
    name: string;
    role: string;
    assignedStage: string;
  };
  addCandidate: (candidate: Omit<Candidate, "id" | "appliedDate" | "status" | "timeline">) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  addJob: (job: Omit<Job, "id" | "createdDate" | "candidateCount">) => void;
  updateUser: (updates: { assignedStage?: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_JOBS: Job[] = [
  { id: "1", title: "Professor de Inglês - Infantil", department: "Educação Infantil", location: "São Paulo - Unidade Jardins", type: "CLT", status: "open", openings: 2, createdDate: "2026-04-01", candidateCount: 0 },
  { id: "2", title: "Professor de Inglês - Teens", department: "Educação", location: "Rio de Janeiro - Unidade Barra", type: "CLT", status: "open", openings: 3, createdDate: "2026-04-05", candidateCount: 0 },
  { id: "3", title: "Professor de Inglês - Adultos", department: "Educação", location: "Belo Horizonte - Unidade Savassi", type: "PJ", status: "open", openings: 1, createdDate: "2026-04-10", candidateCount: 0 },
  { id: "4", title: "Professor de Inglês - Business", department: "Educação Corporativa", location: "Curitiba - Unidade Centro", type: "CLT", status: "open", openings: 2, createdDate: "2026-04-15", candidateCount: 0 },
  { id: "5", title: "Coordenador Pedagógico", department: "Gestão Pedagógica", location: "Porto Alegre - Unidade Moinhos", type: "CLT", status: "open", openings: 1, createdDate: "2026-03-20", candidateCount: 0 },
];

const MOCK_CANDIDATES: Candidate[] = [
  { id: "1", name: "Ana Carolina Santos", role: "Professor de Inglês - Infantil", email: "ana.santos@email.com", phone: "(11) 98765-4321", location: "São Paulo, SP", tags: ["Cambridge YLE", "Storytelling", "Jogos Educativos"], appliedDate: "2026-05-03", source: "LinkedIn", jobId: "1", stageId: "applied", daysInStage: 2, status: "active", timeline: [], proficiencyLevel: "Fluente" },
  { id: "2", name: "Rafael Oliveira Costa", role: "Professor de Inglês - Teens", email: "rafael.costa@email.com", phone: "(21) 99123-4567", location: "Rio de Janeiro, RJ", tags: ["TOEFL", "Conversação", "Cultura Pop"], appliedDate: "2026-05-04", source: "Indicação", jobId: "2", stageId: "screening", daysInStage: 2, status: "active", timeline: [
  { id: "t4a", stageId: "screening", stageName: "Triagem", date: "2026-05-05", time: "15:00", interviewer: "Paula Araújo", interviewerUnit: "", feedback: "Candidato nativo com experiência nos EUA. Excelente fluência e sotaque. Experiência prévia com preparação TOEFL. Perfil ideal para turmas teens. Agendar entrevista.", decision: "approved" }
  ], proficiencyLevel: "Nativo" },
  { id: "3", name: "Mariana Ferreira Lima", role: "Professor de Inglês - Business", email: "mariana.lima@email.com", phone: "(31) 98888-7777", location: "Belo Horizonte, MG", tags: ["Business English", "Apresentações", "Networking"], appliedDate: "2026-05-02", source: "Direto", jobId: "4", stageId: "applied", daysInStage: 3, status: "active", timeline: [], proficiencyLevel: "Avançado" },
  { id: "4", name: "Lucas Henrique Alves", role: "Professor de Inglês - Teens", email: "lucas.alves@email.com", phone: "(41) 99234-5678", location: "Curitiba, PR", tags: ["Gamificação", "Literatura", "Pronúncia"], appliedDate: "2026-05-04", source: "LinkedIn", jobId: "2", stageId: "applied", daysInStage: 1, status: "active", timeline: [], proficiencyLevel: "Fluente" },
  { id: "5", name: "Juliana Rodrigues Souza", role: "Professor de Inglês - Infantil", email: "juliana.souza@email.com", phone: "(11) 97777-8888", location: "São Paulo, SP", tags: ["TPR", "Músicas", "Artes"], appliedDate: "2026-04-28", source: "Indicação", jobId: "1", stageId: "screening", daysInStage: 4, note: "Experiência comprovada com crianças de 4-8 anos. Aula demonstrativa agendada.", status: "active", timeline: [
    { id: "t1", stageId: "screening", stageName: "Triagem", date: "2026-05-02", time: "10:30", interviewer: "Ana Silva", interviewerUnit: "", feedback: "Candidata demonstrou excelente didática para o público infantil. Certificação Cambridge TKT Young Learners válida. Experiência de 5 anos em escolas de idiomas. Recomendo avançar para aula demonstrativa.", decision: "approved" }
  ], proficiencyLevel: "Fluente" },
  { id: "6", name: "Bruno Henrique Martins", role: "Professor de Inglês - Adultos", email: "bruno.martins@email.com", phone: "(31) 98765-1234", location: "Belo Horizonte, MG", tags: ["IELTS", "Academic English", "Gramática Avançada"], appliedDate: "2026-04-27", source: "Site de Vagas", jobId: "3", stageId: "assessment", daysInStage: 3, status: "active", timeline: [
    { id: "t5a", stageId: "screening", stageName: "Triagem", date: "2026-04-29", time: "13:30", interviewer: "Roberto Santos", interviewerUnit: "", feedback: "Perfil acadêmico forte. Mestrado em Linguística Aplicada. Certificação IELTS examiner. Excelente para turmas preparatórias e inglês acadêmico.", decision: "approved" },
    { id: "t5b", stageId: "interview", stageName: "Entrevista", date: "2026-05-02", time: "16:20", interviewer: "Juliana Mendes", interviewerUnit: "", feedback: "Entrevista excelente. Bruno tem vasta experiência com preparação para IELTS e inglês acadêmico. Metodologia bem estruturada e materiais próprios desenvolvidos. Avançar para aula demonstrativa.", decision: "approved" },
    { id: "t5c", stageId: "assessment", stageName: "Avaliação", date: "2026-05-04", time: "08:30", interviewer: "Comissão Pedagógica", interviewerUnit: "", feedback: "Aula demonstrativa realizada com turma de preparação IELTS. Excelente domínio do conteúdo e didática clara. Alunos engajados. Aguardando decisão final para proposta.", decision: "pending" }
  ], proficiencyLevel: "Nativo" },
  { id: "7", name: "Camila Beatriz Silva", role: "Professor de Inglês - Business", email: "camila.silva@email.com", phone: "(21) 99876-5432", location: "Rio de Janeiro, RJ", tags: ["Inglês Corporativo", "Negociações", "E-mails Profissionais"], appliedDate: "2026-05-02", source: "Indicação", jobId: "4", stageId: "screening", daysInStage: 2, status: "active", timeline: [], proficiencyLevel: "Fluente" },
  { id: "8", name: "Fernando José Ribeiro", role: "Coordenador Pedagógico", email: "fernando.ribeiro@email.com", phone: "(51) 98234-5678", location: "Porto Alegre, RS", tags: ["Gestão de Equipes", "Metodologias Ativas", "Formação de Professores"], appliedDate: "2026-04-20", source: "LinkedIn", jobId: "5", stageId: "interview", daysInStage: 8, note: "Entrevista com diretoria agendada. Experiência de 10 anos em coordenação.", status: "active", timeline: [
    { id: "t2a", stageId: "screening", stageName: "Triagem", date: "2026-04-23", time: "11:30", interviewer: "Mariana Costa", interviewerUnit: "", feedback: "Currículo muito sólido. Experiência em coordenação pedagógica em 3 escolas diferentes. Certificações CELTA e DELTA. Recomendo para entrevista presencial com a equipe de gestão.", decision: "approved" },
    { id: "t2b", stageId: "interview", stageName: "Entrevista", date: "2026-04-30", time: "16:00", interviewer: "Carlos Mendes", interviewerUnit: "", feedback: "Candidato demonstrou forte capacidade de liderança e conhecimento profundo de metodologias ativas de ensino. Experiência em coordenar equipes de até 15 professores. Apresentou proposta de formação continuada muito alinhada com nossa filosofia pedagógica.", decision: "approved" }
  ], proficiencyLevel: "Fluente" },
  { id: "9", name: "Patrícia Gomes Pereira", role: "Professor de Inglês - Adultos", email: "patricia.pereira@email.com", phone: "(11) 99345-6789", location: "São Paulo, SP", tags: ["Conversação", "Cultura", "Viagens"], appliedDate: "2026-04-23", source: "Indicação", jobId: "3", stageId: "interview", daysInStage: 5, status: "active", timeline: [
    { id: "t3a", stageId: "screening", stageName: "Triagem", date: "2026-04-26", time: "10:00", interviewer: "Roberto Santos", interviewerUnit: "", feedback: "Indicação da professora Camila Silva. Candidata tem perfil interessante para turmas de conversação. Experiência com adultos em contexto corporativo. Avançar para entrevista.", decision: "approved" },
    { id: "t3b", stageId: "interview", stageName: "Entrevista", date: "2026-05-01", time: "18:00", interviewer: "Juliana Mendes", interviewerUnit: "", feedback: "Entrevista muito positiva. Patrícia demonstrou ótima habilidade de conversação e conhecimento cultural amplo. Metodologia comunicativa bem desenvolvida. Aguardando aula demonstrativa.", decision: "pending" }
  ], proficiencyLevel: "Avançado" },
  { id: "10", name: "Thiago Augusto Nunes", role: "Professor de Inglês - Infantil", email: "thiago.nunes@email.com", phone: "(41) 97123-4567", location: "Curitiba, PR", tags: ["Contação de Histórias", "Teatro", "Ludicidade"], appliedDate: "2026-04-26", source: "Site de Vagas", jobId: "1", stageId: "interview", daysInStage: 7, status: "active", timeline: [
    { id: "t6a", stageId: "screening", stageName: "Triagem", date: "2026-04-27", time: "10:00", interviewer: "Ana Silva", interviewerUnit: "São Paulo - Unidade Jardins", feedback: "Formação em Pedagogia e Letras. Certificado Cambridge TKT YL. Experiência de 3 anos com educação infantil. Perfil lúdico e criativo. Agendar entrevista presencial.", decision: "approved" },
    { id: "t6b", stageId: "assessment", stageName: "Avaliação", date: "2026-04-30", time: "14:30", interviewer: "Ana Silva", interviewerUnit: "São Paulo - Unidade Jardins", feedback: "Teste escrito com boa pontuação (85%). Conhecimento pedagógico sólido. Avançar para entrevista prática.", decision: "approved" },
    { id: "t6c", stageId: "interview", stageName: "Entrevista", date: "2026-05-02", time: "10:30", interviewer: "Carla Mendonça", interviewerUnit: "São Paulo - Unidade Jardins", feedback: "Thiago demonstrou grande entusiasmo e energia para trabalhar com crianças. Aula demonstrativa com storytelling foi excepcional. Aguardando parecer final da coordenação.", decision: "pending" }
  ], proficiencyLevel: "Fluente" },
  { id: "11", name: "Ricardo Mendes Oliveira", role: "Professor de Inglês - Business", email: "ricardo.oliveira@email.com", phone: "(11) 97654-3210", location: "São Paulo, SP", tags: ["Business English", "Negociações", "Apresentações"], appliedDate: "2026-04-10", source: "LinkedIn", jobId: "4", status: "rejected", proficiencyLevel: "Fluente", rejectedAt: { stageId: "interview", stageName: "Entrevista", date: "2026-04-25", interviewer: "Paula Rodrigues", feedback: "Candidato apresentou bom conhecimento de Business English, porém demonstrou dificuldade em adaptar a linguagem para diferentes níveis de proficiência corporativa. Durante a simulação de aula, não conseguiu simplificar conceitos complexos para iniciantes. Além disso, mostrou rigidez metodológica e resistência a feedback sobre abordagens mais dinâmicas solicitadas pela equipe." }, timeline: [] },
  { id: "12", name: "Gabriela Santos Costa", role: "Professor de Inglês - Infantil", email: "gabriela.costa@email.com", phone: "(31) 98123-4567", location: "Belo Horizonte, MG", tags: ["Storytelling", "Músicas", "TPR"], appliedDate: "2026-03-28", source: "Indicação", jobId: "1", status: "talent-pool", proficiencyLevel: "Avançado", timeline: [] },
  { id: "13", name: "André Felipe Souza", role: "Professor de Inglês - Teens", email: "andre.souza@email.com", phone: "(21) 99876-5432", location: "Rio de Janeiro, RJ", tags: ["Gaming", "YouTube", "Cultura Digital"], appliedDate: "2026-04-05", source: "Site de Vagas", jobId: "2", status: "rejected", proficiencyLevel: "Intermediário", rejectedAt: { stageId: "screening", stageName: "Triagem", date: "2026-04-08", interviewer: "Roberto Ferreira", feedback: "Embora o candidato tenha perfil jovem e conexão com a cultura teen, seu nível de proficiência em inglês foi avaliado como intermediário, abaixo do mínimo exigido (avançado/fluente) para lecionar. No teste de pronúncia e conversação, apresentou erros gramaticais frequentes e sotaque muito carregado. Recomendamos que aprimore seu inglês e reaplique futuramente." }, timeline: [] },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [currentUser, setCurrentUser] = useState({
    name: "Você",
    role: "Recrutador",
    assignedStage: "interview",
  });

  const addCandidate = (candidate: Omit<Candidate, "id" | "appliedDate" | "status" | "timeline">) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString().split("T")[0],
      status: "active",
      stageId: candidate.jobId ? "applied" : undefined,
      daysInStage: 0,
      timeline: [],
    };
    setCandidates((prev) => [...prev, newCandidate]);
  };

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const addJob = (job: Omit<Job, "id" | "createdDate" | "candidateCount">) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split("T")[0],
      candidateCount: 0,
    };
    setJobs((prev) => [...prev, newJob]);
  };

  const updateUser = (updates: { assignedStage?: string }) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        candidates,
        jobs,
        currentUser,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        addJob,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
