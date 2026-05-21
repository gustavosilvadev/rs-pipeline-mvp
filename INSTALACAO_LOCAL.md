# 🚀 Instalação Local - Sistema de Recrutamento

## Pré-requisitos

- Node.js versão 18 ou superior
- pnpm (gerenciador de pacotes)

## Passo a Passo

### 1. Baixar todos os arquivos do projeto

Copie toda a estrutura de pastas e arquivos para seu PC:

```
sistema-recrutamento/
├── package.json
├── vite.config.ts
├── tsconfig.json (criar)
├── index.html (criar)
├── src/
│   ├── main.tsx (criar)
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   ├── types.ts
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── CandidateDialog.tsx
│   │   │   ├── AddCandidateModal.tsx
│   │   │   ├── AddJobModal.tsx
│   │   │   ├── RejectionPipelineProgress.tsx
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   └── ui/ (todos os componentes)
│   │   ├── context/
│   │   │   └── AppContext.tsx
│   │   └── pages/
│   │       ├── Pipeline.tsx
│   │       ├── Candidates.tsx
│   │       ├── CandidateTimeline.tsx
│   │       ├── CandidatesReport.tsx
│   │       ├── Jobs.tsx
│   │       ├── JobReport.tsx
│   │       ├── JobsReport.tsx
│   │       ├── Test.tsx
│   │       ├── CandidateEvaluationReport.tsx
│   │       ├── Rejected.tsx
│   │       ├── TalentPool.tsx
│   │       └── UserSettings.tsx
│   └── styles/
│       ├── index.css
│       ├── globals.css
│       ├── tailwind.css
│       ├── theme.css
│       └── fonts.css
```

### 2. Criar arquivo index.html

Crie o arquivo `index.html` na raiz do projeto:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de Recrutamento</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 3. Criar arquivo src/main.tsx

Crie o arquivo `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./app/routes";
import { AppProvider } from "./app/context/AppContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);
```

### 4. Criar arquivo tsconfig.json

Crie o arquivo `tsconfig.json` na raiz:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 5. Criar arquivo tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 6. Instalar dependências

Abra o terminal na pasta do projeto e execute:

```bash
pnpm install
```

### 7. Rodar o projeto

```bash
pnpm dev
```

O sistema abrirá em: http://localhost:5173

## ✅ Funcionalidades Incluídas

- ✅ Pipeline de 5 etapas (Inscritos → Triagem → Avaliação → Entrevista → Contratado)
- ✅ Gestão de candidatos e vagas
- ✅ Teste de avaliação com 10 questões + 5 redações
- ✅ Relatório de avaliação profissional (10 critérios)
- ✅ Timeline detalhado de cada candidato
- ✅ Relatórios de vagas e candidatos
- ✅ Exportação para Excel
- ✅ Candidatos rejeitados e banco de talentos
- ✅ Sistema em português brasileiro
- ✅ Interface profissional e responsiva

## 🛠️ Tecnologias Utilizadas

- React 18.3.1
- TypeScript
- Vite 6.3.5
- React Router 7.13.0
- Tailwind CSS v4
- Radix UI (componentes)
- Lucide React (ícones)
- XLSX (exportação Excel)

## 📝 Scripts Disponíveis

- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Cria versão de produção
- `pnpm preview` - Visualiza build de produção

## 🔧 Personalizações

Você pode editar:
- **Dados mock**: `src/app/context/AppContext.tsx`
- **Estilos**: `src/styles/theme.css`
- **Etapas do pipeline**: `src/app/types.ts` (array STAGES)

## ⚠️ Importante

Este projeto está usando dados mockados (fictícios). Para conectar a um backend real:
1. Crie uma API REST ou GraphQL
2. Substitua o AppContext por chamadas à API
3. Configure variáveis de ambiente para a URL da API

## 📧 Suporte

Para dúvidas sobre a instalação local, verifique:
- Node.js instalado: `node -v`
- pnpm instalado: `pnpm -v`
- Portas disponíveis (padrão: 5173)
