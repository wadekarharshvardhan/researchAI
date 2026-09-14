import { Node, Edge } from "@xyflow/react";

export type NodeType =
  | "topic"
  | "subtopic"
  | "paper"
  | "method"
  | "dataset"
  | "finding"
  | "gap";

export interface BaseNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  type: NodeType;
  description?: string;
  badge?: string;
  category?: string;
}

export interface TopicNodeData extends BaseNodeData {
  type: "topic" | "subtopic";
  iconName?: string;
  paperCount?: number;
  subtopicCount?: number;
}

export interface PaperNodeData extends BaseNodeData {
  type: "paper";
  authors: string[];
  year: number;
  citationCount: number;
  abstract?: string;
  method?: string;
  dataset?: string;
  keyFinding?: string;
  relatedTopic?: string;
  url?: string;
  pdfUrl?: string;
  venue?: string;
}

export interface MethodNodeData extends BaseNodeData {
  type: "method";
  methodName: string;
  categoryName?: string;
  papersCount?: number;
  supportingPapers?: string[];
  reportedAdvantages?: string[];
  reportedLimitations?: string[];
}

export interface DatasetNodeData extends BaseNodeData {
  type: "dataset";
  datasetName: string;
  paperCount?: number;
  datasetType?: "controlled" | "real_world" | "synthetic" | "unspecified";
  supportingPapers?: string[];
  limitations?: string[];
}

export interface FindingNodeData extends BaseNodeData {
  type: "finding";
  findingText: string;
  metricIncrease?: string;
  supportingPapers?: string[];
  evidence?: string;
}

export interface GapNodeData extends BaseNodeData {
  type: "gap";
  gapTitle: string;
  priority: "High Priority" | "Medium" | "Low";
  evidenceStrength: "High" | "Medium" | "Low";
  confidence: number; // e.g. 88
  whyItMatters: string;
  supportingPapers: Array<{
    paperId?: string;
    title: string;
    year?: number;
    limitationReported: string;
  }>;
  repeatedLimitations: string[];
  relatedMethods: string[];
  relatedDatasets: string[];
  potentialResearchDirections: string[];
}

export type ResearchMapNodeData =
  | TopicNodeData
  | PaperNodeData
  | MethodNodeData
  | DatasetNodeData
  | FindingNodeData
  | GapNodeData;

export type ResearchMapNode = Node<ResearchMapNodeData>;
export type ResearchMapEdge = Edge;

export interface ResearchMapStats {
  paperCount: number;
  methodCount: number;
  datasetCount: number;
  findingCount: number;
  gapCount: number;
}

export interface BottomCardItem {
  id: string;
  nodeId?: string;
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  badgeVariant?: "red" | "orange" | "blue" | "purple" | "green";
  metric?: string;
}

export interface ResearchMapGraph {
  query: string;
  nodes: ResearchMapNode[];
  edges: ResearchMapEdge[];
  stats: ResearchMapStats;
  relatedGaps: BottomCardItem[];
  emergingTrends: BottomCardItem[];
  topAuthors: BottomCardItem[];
  keyDatasets: BottomCardItem[];
}
