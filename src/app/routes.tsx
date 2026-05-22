import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Pipeline } from "./pages/Pipeline";
import { Candidates } from "./pages/Candidates";
import { Jobs } from "./pages/Jobs";
import { JobReport } from "./pages/JobReport";
import { Rejected } from "./pages/Rejected";
import { TalentPool } from "./pages/TalentPool";
import { UserSettings } from "./pages/UserSettings";
import { JobsReport } from "./pages/JobsReport";
import { CandidatesReport } from "./pages/CandidatesReport";
import { CandidateTimeline } from "./pages/CandidateTimeline";
import { Test } from "./pages/Test";
import { CandidateEvaluationReport } from "./pages/CandidateEvaluationReport";
import { Reports } from "./pages/Reports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Pipeline },
      { path: "candidatos", Component: Candidates },
      { path: "candidatos/:candidateId/timeline", Component: CandidateTimeline },
      { path: "vagas", Component: Jobs },
      { path: "vagas/:jobId", Component: JobReport },
      { path: "relatorios", Component: Reports },
      { path: "relatorios/vagas", Component: JobsReport },
      { path: "relatorios/candidatos", Component: CandidatesReport },
      { path: "relatorios/avaliacao", Component: CandidateEvaluationReport },
      { path: "teste", Component: Test },
      { path: "reprovados", Component: Rejected },
      { path: "banco-talentos", Component: TalentPool },
      { path: "configuracoes", Component: UserSettings },
    ],
  },
]);
