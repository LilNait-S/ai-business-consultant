
export interface DiscoveryData {
  currentSituation: string;
  goals: string;
  resources: string;
  competition: string;
  timeline: string;
}

export interface AnalysisSection {
  title: string;
  points: string[];
}

export interface RoadmapDetail {
  initiative: string;
  resources: string[];
  timeline: string;
  kpis: string[];
  owner: string;
}

export interface StrategicInitiative {
  title: string;
  description: string;
  details: RoadmapDetail;
}

export interface StrategicPlan {
  analysis: {
    currentSituation: AnalysisSection;
    gaps: AnalysisSection;
    opportunities: AnalysisSection;
    risks: AnalysisSection;
  };
  strategy: {
    quickWins: StrategicInitiative[];
    strategicInitiatives: StrategicInitiative[];
    transformationalBets: StrategicInitiative[];
  };
  conclusion: string;
}
