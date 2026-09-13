<div align="center">

  <img src="public/images/logo.png" alt="ResearchAI Enterprise Platform Logo" width="240" />

  # ResearchAI

  ### Enterprise Academic Intelligence and Literature Discovery Platform

  A multi-agent autonomous framework designed for systematic literature search, cross-document synthesis, research trend analytics, and contextual document inspection across global scholarly databases.

  <p align="center">
    <a href="#executive-summary">Executive Summary</a> &bull;
    <a href="#system-architecture">System Architecture</a> &bull;
    <a href="#core-capabilities">Core Capabilities</a> &bull;
    <a href="#analytics-and-metrics-engine">Analytics Engine</a> &bull;
    <a href="#technical-specifications">Technical Specifications</a> &bull;
    <a href="#deployment-and-setup">Deployment &amp; Setup</a> &bull;
    <a href="#project-structure">Project Structure</a>
  </p>

</div>

---

## Executive Summary

ResearchAI is an autonomous scientific discovery and research intelligence platform engineered to streamline literature review pipelines for academic institutions, research laboratories, and enterprise R&D organizations.

By bridging direct indexation against global repositories (including OpenAlex, arXiv, PubMed, Nature, and IEEE) with a specialized four-stage autonomous agent pipeline, ResearchAI eliminates the manual bottlenecks of traditional academic research. The platform automates paper discovery, structural data extraction, citation network analysis, cross-study contradiction detection, and real-time reading telemetry.

---

## System Architecture

The platform is structured into three discrete operational layers: an interactive client interface, an event-driven analytical engine, and a sequential multi-agent execution pipeline.

```mermaid
flowchart TD
    subgraph Client["Presentation & Interface Layer"]
        UI_Search["Search Workspace"]
        UI_Reader["Document Reader & Copilot"]
        UI_Analytics["Analytics Dashboard"]
        UI_Library["Research Repository"]
    end

    subgraph AnalyticsEngine["Telemetry & Analytics Engine"]
        Log_Search["Query Tracker"]
        Log_View["Document Interaction Logger"]
        Log_Duration["Session Telemetry"]
        Store_Local[("Encrypted Local Store")]
        Compute_Metrics["Quantitative Metrics Processor"]

        Log_Search --> Store_Local
        Log_View --> Store_Local
        Log_Duration --> Store_Local
        Store_Local --> Compute_Metrics
        Compute_Metrics --> UI_Analytics
    end

    subgraph AgentPipeline["Multi-Agent Autonomous Pipeline"]
        Agent1["Agent 1: Retrieval & Ingestion\nDirect OpenAlex Integration + BM25 Reranking"]
        Agent2["Agent 2: Structural Extraction\nMethodologies, Models, Datasets & Findings"]
        Agent3["Agent 3: Intelligence & Gap Detection\nConsensus, Contradictions & Emerging Trends"]
        Agent4["Agent 4: Synthesis & Reporting\nEvidence-Backed Literature Review Generation"]

        Agent1 --> Agent2 --> Agent3 --> Agent4
    end

    UI_Search -->|Query Dispatch| Agent1
    Agent1 -->|Telemetry Ingestion| Log_Search
    UI_Reader -->|Document Access| Log_View
    UI_Reader -->|Engagement Duration| Log_Duration
    Agent4 -->|Structured Intelligence| UI_Search
```

---

## Core Capabilities

### 1. Autonomous Literature Discovery
- **Comprehensive Corpus Indexation**: Connects to over 250 million academic records, encompassing peer-reviewed journal articles, conference proceedings, and preprints.
- **Hybrid Ranking Architecture**: Employs keyword relevance matching coupled with BM25 algorithmic reranking to score semantic relevance against user queries.
- **Parametric Filtering**: Filters results by publication timeframe, citation count, open access compliance, and field of study.

### 2. Multi-Agent Synthesis Framework
- **Stage 1: Discovery & Retrieval**: Analyzes research objectives, decomposes user queries into targeted sub-searches, and gathers document metadata.
- **Stage 2: Paper Analysis**: Ingests and evaluates document abstracts and full-text corpora to extract explicit research problems, methodologies, dataset benchmarks, and quantitative outcomes.
- **Stage 3: Research Gap Analysis**: Evaluates findings across multiple documents to identify statistical discrepancies, methodological limitations, and verified research voids.
- **Stage 4: Literature Review Generation**: Compiles structured, publication-ready literature reviews complete with inline citations, executive summaries, and future work trajectories.

### 3. Interactive Document Reader and Research Copilot
- **Dual-Mode Rendering**: Supports structured text-extracted view alongside direct high-fidelity PDF document rendering.
- **Annotation Framework**: Quad-color highlight management (Yellow, Blue, Green, Purple) with associated persistent commentary.
- **Contextual Copilot**: In-line language model integration capable of parsing mathematical equations, technical methodologies, and statistical outcomes directly from active document context.
- **Active Engagement Telemetry**: Automatically records reading duration when the application tab is active and visible.

### 4. Personal Research Library
- **Stateful Document Management**: Categorizes saved items under standardized reading states (`unread`, `read`, `has_notes`).
- **Annotation Indexing**: Centralizes saved notes, citations, and highlights for rapid review and export.

---

## Analytics and Metrics Engine

ResearchAI incorporates a fully reactive, privacy-preserving client analytics engine. Operating without remote telemetry dependencies, the platform calculates engagement velocity, discipline distribution, and research throughput entirely in the local runtime environment.

### Mathematical Formulations

#### 1. Hours Saved Formula
To quantify research acceleration, the platform models labor reduction across three operational tasks: automated retrieval synthesis, interactive reader parsing, and bibliographic organization.

$$\text{Hours Saved} = \mathrm{round}(1.5 \cdot Q + 2.0 \cdot V + 0.5 \cdot S)$$

Where:
- $Q$ = Executed literature search queries.
- $V$ = Individual research papers viewed and analyzed.
- $S$ = Publications cataloged within the local library.

#### 2. Period Growth Delta
Compares metric performance in the current operational window against the identical preceding period:

$$\Delta\% = \mathrm{round}\left(\frac{M_{\text{current}} - M_{\text{previous}}}{M_{\text{previous}}}\right) \cdot 100\%$$

#### 3. Open Access Availability Ratio
Tracks adherence to open-science publishing:

$$\text{OAR} = \mathrm{round}\left(\frac{V_{\text{OA}}}{V_{\text{total}}}\right) \cdot 100\%$$

#### 4. Mean Citation Impact
Calculates the average academic citation density across all examined literature:

$$\bar{C} = \mathrm{round}\left(\frac{\sum_{i=1}^{N} C_i}{N}\right)$$

### Analytics Visualizations
- **Research Activity Timeline**: Dual-metric daily activity distribution contrasting queries executed versus document views, complete with interactive tooltips.
- **Top Research Topics**: Ranked frequency distribution with quantitative progress bars and direct query execution.
- **Source Index Distribution**: Segmented breakdown of contributing repositories (OpenAlex, arXiv, PubMed, Nature, IEEE, Crossref).
- **Multidisciplinary Categorization**: Automated categorization into Computer Science, Healthcare & Medicine, Environmental Sciences, Physics, and Biological Sciences.
- **Quality Metrics Grid**: Average citation impact, Open Access adoption rate, aggregate active reading minutes, and research milestones.

---

## Technical Specifications

| Component | Specification | Description |
| :--- | :--- | :--- |
| Application Framework | Next.js 16.3 (App Router, Turbopack) | Server-side rendering, static generation, and modular routing |
| User Interface | React 19.2 | Declarative component architecture |
| Type System | TypeScript 5.0+ | Static type enforcement across models, tools, and endpoints |
| Styling Architecture | Tailwind CSS 3.4 | Standardized design system and tokenized components |
| Animation Engine | Motion 12.0 (Framer Motion) | Hardware-accelerated UI transitions and micro-interactions |
| Data Layer | Drizzle ORM 0.45 + Neon PostgreSQL | Type-safe schema definitions and serverless persistence |
| Academic Provider | OpenAlex REST API | Scholarly metadata indexation covering global publications |
| AI Integration | Vercel AI SDK 4.0 / 7.0 | Streaming language model orchestration and copilot integration |
| Iconography | Lucide React | Standardized system iconography |

---

## Deployment and Setup

### Prerequisites
- Node.js 18.18 or higher
- npm 9.0+ or compatible package manager (pnpm, yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wadekarharshvardhan/researchAI.git
   cd researchAI
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create an environment file `.env.local` in the project root:
   ```env
   # LLM Orchestration (Required for Copilot and Literature Synthesis)
   OPENAI_API_KEY=your_api_key_here

   # PostgreSQL Database (Optional for remote persistent profiles)
   DATABASE_URL=postgresql://user:password@endpoint/database?sslmode=require
   ```
   *Note: Literature search and OpenAlex index queries execute without external API keys.*

4. Launch local development server:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` in your web browser.

5. Production compilation:
   ```bash
   npm run build
   npm run start
   ```

---

## Project Structure

```
researchAI/
├── public/
│   ├── images/
│   │   ├── logo.png               # Enterprise cover brand asset
│   │   ├── logoblue.png           # Standard application brand asset
│   │   ├── logowhite.png          # High-contrast inverted asset
│   │   └── hero-bg.webp           # Presentation layer background
│   └── favicon.ico                # Application shortcut icon
├── src/
│   ├── app/                       # Next.js App Router definitions
│   │   ├── analytics/             # Research analytics entry point
│   │   ├── reader/                # Interactive document viewer and copilot
│   │   ├── api/                   # Server endpoints (search, copilot, agent orchestration)
│   │   └── page.tsx               # Primary dashboard interface
│   ├── components/
│   │   ├── dashboard/             # Dashboard modules (Analytics, Explore, Library, Research)
│   │   ├── reader/                # Document viewer, toolbar, and copilot panels
│   │   └── navbar/                # Navigation and system controls
│   ├── lib/
│   │   ├── analytics-store.ts     # Telemetry logging and quantitative analytics engine
│   │   ├── library-papers.ts      # Document bookmarking and status tracking
│   │   ├── paper-reader-store.ts  # Document highlights and active reader sessions
│   │   └── search-service.ts      # Academic search routing service
│   ├── tools/
│   │   └── openalex.ts            # OpenAlex API integration and data mapping
│   └── types/
│       └── research-paper.ts      # Interfaces for papers, analysis, reports, and gaps
├── drizzle.config.ts              # Database ORM configuration
├── tsconfig.json                  # TypeScript compiler options
└── package.json                   # Project manifest and build scripts
```

---

## Quality Assurance and Verification

Static type checking:
```bash
npx tsc --noEmit
```

Linting and code style:
```bash
npm run lint
```

Build validation:
```bash
npm run build
```

---

## Data Governance and Privacy

ResearchAI operates with a privacy-first data handling architecture:
- **Local Persistence**: User queries, highlighted text, and personal research metrics remain isolated to client-side storage by default.
- **Stateless Agent Requests**: API transactions for research discovery communicate with academic indexes without transmitting personally identifiable information.
- **Zero Third-Party Ad Trackers**: No third-party behavioral analytics or commercial tracking scripts are embedded within the application codebase.

---

## License

This software is distributed under the terms of the MIT License. See [LICENSE](LICENSE) for complete terms.
