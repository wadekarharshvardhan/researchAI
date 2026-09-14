import { ResearchMapGraph, ResearchMapNode, ResearchMapEdge } from "@/types/research-map";

/**
 * Preset 1: "Renewable Energy"
 * Faithful recreation of the user-provided reference design screenshot.
 */
export const RENEWABLE_ENERGY_GRAPH: ResearchMapGraph = {
  query: "Renewable Energy",
  stats: {
    paperCount: 1240,
    methodCount: 28,
    datasetCount: 16,
    findingCount: 12,
    gapCount: 8,
  },
  nodes: [
    // ── Center Hub ──
    {
      id: "topic-root",
      type: "topic",
      position: { x: 500, y: 320 },
      data: {
        id: "topic-root",
        type: "topic",
        label: "Renewable Energy",
        iconName: "leaf",
        description:
          "Comprehensive research map spanning solar forecasting, wind telemetry, battery optimization, and decentralized smart grid networks.",
        badge: "Central Topic",
      },
    },

    // ── Upper Left Hub ──
    {
      id: "dataset-pv-live",
      type: "dataset",
      position: { x: 230, y: 190 },
      data: {
        id: "dataset-pv-live",
        type: "dataset",
        label: "PV-Live Dataset",
        datasetName: "PV-Live Dataset",
        badge: "Dataset",
        paperCount: 38,
        datasetType: "real_world",
        description:
          "Sub-minute solar PV generation estimates and real-time outturn feeds across national distribution networks.",
        supportingPapers: ["A Review of Renewable Systems (2022)"],
        limitations: [
          "Limited geographic metadata for rooftop PV installations",
          "Inconsistent calibration intervals across regional micro-inverters",
        ],
      },
    },
    {
      id: "method-ml",
      type: "method",
      position: { x: 240, y: 280 },
      data: {
        id: "method-ml",
        type: "method",
        label: "Machine Learning",
        methodName: "Machine Learning",
        badge: "Method",
        categoryName: "Predictive Analytics",
        papersCount: 412,
        reportedAdvantages: [
          "Non-linear mapping of atmospheric temperature and solar irradiance",
          "Fast inference capability suitable for primary substation controllers",
        ],
        reportedLimitations: [
          "Black-box opacity hindering grid operator compliance",
          "Sensitivity to extreme weather anomalies",
        ],
      },
    },
    {
      id: "paper-review-renewable",
      type: "paper",
      position: { x: 130, y: 370 },
      data: {
        id: "paper-review-renewable",
        type: "paper",
        label: "A Review of Renewable Systems (2022)",
        authors: ["Taylor, R.", "Al-Mansoor, S.", "Patel, H."],
        year: 2022,
        citationCount: 342,
        venue: "Renewable and Sustainable Energy Reviews",
        abstract:
          "This comprehensive survey synthesizes two decades of modern renewable grid integration literature, emphasizing the transition from deterministic thermal forecasting to stochastic machine learning algorithms.",
        method: "Comprehensive Meta-Analysis & Cross-Venue Comparison",
        dataset: "PV-Live Dataset",
        keyFinding: "Hybrid forecasting algorithms reduce peak reserve margins by 14.2%.",
        relatedTopic: "Renewable Energy Systems",
        url: "https://doi.org/10.1016/j.rser.2022.112445",
      },
    },

    // ── Upper Center / Top ──
    {
      id: "paper-deep-learning-solar",
      type: "paper",
      position: { x: 440, y: 130 },
      data: {
        id: "paper-deep-learning-solar",
        type: "paper",
        label: "Deep Learning for Solar Forecasting (2023)",
        authors: ["Chen et al."],
        year: 2023,
        citationCount: 124,
        venue: "Applied Energy",
        abstract:
          "This paper proposes a deep learning approach for short-term solar power forecasting using LSTM networks. It demonstrates improved accuracy compared to traditional machine learning methods across diverse climate zones.",
        method: "LSTM (Long Short-Term Memory)",
        dataset: "Solar-Energy Dataset",
        keyFinding: "18% higher prediction accuracy over baseline autoregressive models.",
        relatedTopic: "Solar Energy, Renewable Energy",
        url: "https://doi.org/10.1016/j.apenergy.2023.120938",
      },
    },

    // ── Upper Right / Top Right ──
    {
      id: "method-lstm",
      type: "method",
      position: { x: 670, y: 150 },
      data: {
        id: "method-lstm",
        type: "method",
        label: "LSTM",
        methodName: "LSTM (Long Short-Term Memory)",
        badge: "Method",
        categoryName: "Recurrent Neural Networks",
        papersCount: 89,
        reportedAdvantages: [
          "Captures sequential temporal dynamics and day-night seasonality",
          "Effective memory retention for cloud cover lag effects",
        ],
        reportedLimitations: [
          "High gradient volatility during abrupt cloud dissipation events",
        ],
      },
    },
    {
      id: "dataset-solar-energy",
      type: "dataset",
      position: { x: 740, y: 230 },
      data: {
        id: "dataset-solar-energy",
        type: "dataset",
        label: "Solar-Energy Dataset",
        datasetName: "Solar-Energy Dataset",
        badge: "Dataset",
        paperCount: 52,
        datasetType: "controlled",
        description:
          "Comprehensive multi-state photovoltaic generation benchmarks with synchronous solar irradiance, ambient temperature, and humidity sensors.",
        supportingPapers: ["Deep Learning for Solar Forecasting (2023)"],
        limitations: ["Missing high-resolution cloud satellite motion imagery"],
      },
    },
    {
      id: "finding-improved-accuracy",
      type: "finding",
      position: { x: 790, y: 310 },
      data: {
        id: "finding-improved-accuracy",
        type: "finding",
        label: "Improved Prediction Accuracy (+18%)",
        findingText: "Improved Prediction Accuracy (+18%)",
        badge: "Finding",
        metricIncrease: "+18%",
        evidence:
          "Validated across 14 commercial solar farms over 12 consecutive months against gradient boosted trees.",
        supportingPapers: ["Deep Learning for Solar Forecasting (2023)"],
      },
    },
    {
      id: "gap-real-time-data",
      type: "gap",
      position: { x: 800, y: 400 },
      data: {
        id: "gap-real-time-data",
        type: "gap",
        label: "Lack of Real-time Multi-source Data",
        gapTitle: "Lack of Real-time Multi-source Data",
        badge: "Research Gap",
        priority: "High Priority",
        evidenceStrength: "High",
        confidence: 88,
        whyItMatters:
          "Real-time grid scheduling requires synchronized sub-second feeds from weather radars, sky cameras, and inverter telemetry. Without unified multi-source streams, models fail to predict rapid ramping events.",
        supportingPapers: [
          {
            title: "Deep Learning for Solar Forecasting (2023)",
            year: 2023,
            limitationReported:
              "Unable to incorporate real-time cloud satellite vectoring due to bandwidth constraints at remote substations.",
          },
          {
            title: "A Review of Renewable Systems (2022)",
            year: 2022,
            limitationReported:
              "Data fragmentation between independent system operators and private solar telemetry providers.",
          },
        ],
        repeatedLimitations: [
          "Data latency between weather satellites and edge inverters exceeds 15 minutes",
          "Lack of standardized API protocols for mixed-vendor SCADA architectures",
        ],
        relatedMethods: ["LSTM", "Multi-modal Sensor Fusion"],
        relatedDatasets: ["Solar-Energy Dataset", "PV-Live Dataset"],
        potentialResearchDirections: [
          "Federated edge streaming architectures for microsecond inverter telemetries",
          "Self-supervised representation learning directly on uncalibrated multimodal sensor streams",
        ],
      },
    },

    // ── Bottom Branch 1: Solar Energy ──
    {
      id: "subtopic-solar",
      type: "subtopic",
      position: { x: 100, y: 530 },
      data: {
        id: "subtopic-solar",
        type: "subtopic",
        label: "Solar Energy",
        iconName: "sun",
        badge: "Domain",
        description: "Photovoltaic cells, concentrated solar, and cell degradation dynamics.",
      },
    },
    {
      id: "paper-solar-panel-efficiency",
      type: "paper",
      position: { x: 90, y: 620 },
      data: {
        id: "paper-solar-panel-efficiency",
        type: "paper",
        label: "Solar Panel Efficiency Analysis (2023)",
        authors: ["Gupta, A.", "Svensson, K."],
        year: 2023,
        citationCount: 88,
        venue: "IEEE Transactions on Sustainable Energy",
        abstract:
          "Investigates perovskite-silicon tandem cell efficiency degradation under severe thermal cycling using hybrid physics-informed neural networks.",
        method: "Physics-Informed Neural Network (PINN)",
        dataset: "National Solar Radiation Database",
        keyFinding: "Higher efficiency with hybrid models compared to pure empirical regression.",
        relatedTopic: "Solar Energy",
      },
    },
    {
      id: "finding-solar-efficiency",
      type: "finding",
      position: { x: 90, y: 730 },
      data: {
        id: "finding-solar-efficiency",
        type: "finding",
        label: "Higher efficiency with hybrid models",
        findingText: "Higher efficiency with hybrid models",
        badge: "Finding",
        evidence: "Physics constraints prevent physically impossible non-monotonic power degradation curves.",
      },
    },

    // ── Bottom Branch 2: Wind Energy ──
    {
      id: "subtopic-wind",
      type: "subtopic",
      position: { x: 340, y: 530 },
      data: {
        id: "subtopic-wind",
        type: "subtopic",
        label: "Wind Energy",
        iconName: "wind",
        badge: "Domain",
        description: "Aerodynamic load monitoring, turbine yaw optimization, and offshore farms.",
      },
    },
    {
      id: "paper-wind-turbine",
      type: "paper",
      position: { x: 330, y: 620 },
      data: {
        id: "paper-wind-turbine",
        type: "paper",
        label: "Wind Turbine Fault Detection (2022)",
        authors: ["Møller, J.", "Lindqvist, E."],
        year: 2022,
        citationCount: 164,
        venue: "Wind Energy Science",
        abstract:
          "Presents early gearbox bearing anomaly detection using vibration SCADA telemetry and unsupervised autoencoders before catastrophic failures occur.",
        method: "Convolutional Autoencoder",
        dataset: "Wind Turbine SCADA Dataset",
        keyFinding: "Predicts bearing faults 28 days prior to mechanical shutdown.",
        relatedTopic: "Wind Energy",
      },
    },
    {
      id: "dataset-wind-scada",
      type: "dataset",
      position: { x: 330, y: 730 },
      data: {
        id: "dataset-wind-scada",
        type: "dataset",
        label: "Wind Turbine SCADA Dataset",
        datasetName: "Wind Turbine SCADA Dataset",
        badge: "Dataset",
        paperCount: 44,
        datasetType: "real_world",
        description: "10-minute averaged turbine SCADA signals from 24 offshore 4MW turbines over 3 years.",
      },
    },

    // ── Bottom Branch 3: Energy Storage ──
    {
      id: "subtopic-storage",
      type: "subtopic",
      position: { x: 570, y: 530 },
      data: {
        id: "subtopic-storage",
        type: "subtopic",
        label: "Energy Storage",
        iconName: "battery-charging",
        badge: "Domain",
        description: "Battery management systems, electrochemical lifespan modeling, and virtual power plants.",
      },
    },
    {
      id: "method-rl",
      type: "method",
      position: { x: 570, y: 620 },
      data: {
        id: "method-rl",
        type: "method",
        label: "Reinforcement Learning",
        methodName: "Reinforcement Learning",
        badge: "Method",
        categoryName: "Dynamic Control",
        papersCount: 73,
        reportedAdvantages: ["Learns dynamic arbitrage strategies in volatile day-ahead electricity markets"],
      },
    },
    {
      id: "paper-battery-opt",
      type: "paper",
      position: { x: 560, y: 730 },
      data: {
        id: "paper-battery-opt",
        type: "paper",
        label: "Battery Optimization Using RL (2023)",
        authors: ["Vance, M.", "Kovacs, T."],
        year: 2023,
        citationCount: 95,
        venue: "Journal of Energy Storage",
        abstract:
          "Formulates battery life extension and dispatch bidding as a constrained Markov Decision Process using Deep Q-Networks.",
        method: "Deep Q-Networks (DQN)",
        keyFinding: "Extends battery cycle lifespan by 22% while maintaining 94% arbitrage revenue.",
        relatedTopic: "Energy Storage",
      },
    },

    // ── Bottom Branch 4: Smart Grids ──
    {
      id: "subtopic-grid",
      type: "subtopic",
      position: { x: 800, y: 530 },
      data: {
        id: "subtopic-grid",
        type: "subtopic",
        label: "Smart Grids",
        iconName: "grid",
        badge: "Domain",
        description: "Decentralized microgrids, demand response, and IoT smart meter coordination.",
      },
    },
    {
      id: "paper-smart-grid-load",
      type: "paper",
      position: { x: 790, y: 620 },
      data: {
        id: "paper-smart-grid-load",
        type: "paper",
        label: "Smart Grid Load Forecasting (2023)",
        authors: ["Rossi, E.", "Dubois, P."],
        year: 2023,
        citationCount: 156,
        venue: "IEEE Smart Grid Transactions",
        abstract:
          "Graph neural networks for residential distribution load forecasting accounting for neighborhood EV charging peaks.",
        method: "Spatio-Temporal Graph Neural Network",
        keyFinding: "Accounts for localized EV charging spikes with 31% lower error variance.",
        relatedTopic: "Smart Grids",
      },
    },
    {
      id: "gap-iot-devices",
      type: "gap",
      position: { x: 790, y: 730 },
      data: {
        id: "gap-iot-devices",
        type: "gap",
        label: "Integration with IoT Devices",
        gapTitle: "Integration with IoT Devices",
        badge: "Research Gap",
        priority: "Medium",
        evidenceStrength: "Medium",
        confidence: 76,
        whyItMatters:
          "While simulated testbeds achieve high precision, real-world smart inverters and domestic heat pumps have severe compute constraints, packet loss, and zero-trust security restrictions.",
        supportingPapers: [
          {
            title: "Smart Grid Load Forecasting (2023)",
            year: 2023,
            limitationReported:
              "Assumed lossless low-latency 5G telemetry across all consumer premises, failing during cell tower congestion.",
          },
        ],
        repeatedLimitations: [
          "No consensus on edge encryption standards for micro-grid inverters",
          "High packet dropout rate over cellular LPWAN protocols in rural feeders",
        ],
        relatedMethods: ["Graph Neural Networks", "Edge Computing"],
        relatedDatasets: ["Pecan Street Dataport"],
        potentialResearchDirections: [
          "Asynchronous gossip protocols for bandwidth-constrained decentralized frequency regulation",
        ],
      },
    },
  ],
  edges: [
    // Center to Upper Left
    {
      id: "e-root-pvlive",
      source: "topic-root",
      target: "dataset-pv-live",
      animated: true,
      style: { stroke: "#F59E0B", strokeWidth: 2 },
    },
    {
      id: "e-root-ml",
      source: "topic-root",
      target: "method-ml",
      animated: true,
      style: { stroke: "#8B5CF6", strokeWidth: 2 },
    },
    {
      id: "e-ml-review",
      source: "method-ml",
      target: "paper-review-renewable",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },
    {
      id: "e-root-review",
      source: "topic-root",
      target: "paper-review-renewable",
      animated: true,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },

    // Center to Top
    {
      id: "e-root-paper-dl",
      source: "topic-root",
      target: "paper-deep-learning-solar",
      animated: true,
      style: { stroke: "#10B981", strokeWidth: 2.5 },
    },
    {
      id: "e-dl-lstm",
      source: "paper-deep-learning-solar",
      target: "method-lstm",
      animated: false,
      style: { stroke: "#8B5CF6", strokeWidth: 2 },
    },
    {
      id: "e-dl-solardataset",
      source: "paper-deep-learning-solar",
      target: "dataset-solar-energy",
      animated: false,
      style: { stroke: "#F59E0B", strokeWidth: 2 },
    },
    {
      id: "e-dl-finding",
      source: "paper-deep-learning-solar",
      target: "finding-improved-accuracy",
      animated: false,
      style: { stroke: "#06B6D4", strokeWidth: 2 },
    },
    {
      id: "e-dl-gap",
      source: "paper-deep-learning-solar",
      target: "gap-real-time-data",
      animated: true,
      style: { stroke: "#EF4444", strokeWidth: 2 },
    },
    {
      id: "e-root-gap",
      source: "topic-root",
      target: "gap-real-time-data",
      animated: true,
      style: { stroke: "#EF4444", strokeWidth: 1.5, strokeDasharray: "4 4" },
    },

    // Center to Subtopics
    {
      id: "e-root-solar",
      source: "topic-root",
      target: "subtopic-solar",
      animated: true,
      style: { stroke: "#2563EB", strokeWidth: 2.5 },
    },
    {
      id: "e-solar-paper",
      source: "subtopic-solar",
      target: "paper-solar-panel-efficiency",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },
    {
      id: "e-solar-finding",
      source: "paper-solar-panel-efficiency",
      target: "finding-solar-efficiency",
      animated: false,
      style: { stroke: "#06B6D4", strokeWidth: 2 },
    },

    {
      id: "e-root-wind",
      source: "topic-root",
      target: "subtopic-wind",
      animated: true,
      style: { stroke: "#2563EB", strokeWidth: 2.5 },
    },
    {
      id: "e-wind-paper",
      source: "subtopic-wind",
      target: "paper-wind-turbine",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },
    {
      id: "e-wind-dataset",
      source: "paper-wind-turbine",
      target: "dataset-wind-scada",
      animated: false,
      style: { stroke: "#F59E0B", strokeWidth: 2 },
    },

    {
      id: "e-root-storage",
      source: "topic-root",
      target: "subtopic-storage",
      animated: true,
      style: { stroke: "#2563EB", strokeWidth: 2.5 },
    },
    {
      id: "e-storage-method",
      source: "subtopic-storage",
      target: "method-rl",
      animated: false,
      style: { stroke: "#8B5CF6", strokeWidth: 2 },
    },
    {
      id: "e-storage-paper",
      source: "method-rl",
      target: "paper-battery-opt",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },

    {
      id: "e-root-grid",
      source: "topic-root",
      target: "subtopic-grid",
      animated: true,
      style: { stroke: "#2563EB", strokeWidth: 2.5 },
    },
    {
      id: "e-grid-paper",
      source: "subtopic-grid",
      target: "paper-smart-grid-load",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },
    {
      id: "e-grid-gap",
      source: "paper-smart-grid-load",
      target: "gap-iot-devices",
      animated: true,
      style: { stroke: "#EF4444", strokeWidth: 2 },
    },
  ],
  relatedGaps: [
    {
      id: "gap-real-time-data",
      nodeId: "gap-real-time-data",
      title: "Lack of real-time multi-source data",
      badge: "High Priority",
      badgeVariant: "red",
      description: "Limited availability of real-time, high-quality multi-source datasets for solar forecasting.",
    },
    {
      id: "gap-scalability",
      title: "Scalability to different regions",
      badge: "Medium",
      badgeVariant: "orange",
      description: "Models often lack generalization across different geographical regions and climates.",
    },
    {
      id: "gap-iot-devices",
      nodeId: "gap-iot-devices",
      title: "Integration with IoT devices",
      badge: "Medium",
      badgeVariant: "orange",
      description: "Limited research on integrating forecasting models with real-world IoT devices.",
    },
  ],
  emergingTrends: [
    {
      id: "trend-1",
      title: "Physics-Informed Deep Learning (PINN)",
      badge: "Fast Growing",
      badgeVariant: "blue",
      description: "Infusing thermodynamic laws and Navier-Stokes equations into neural architectures.",
      metric: "+142% citations/yr",
    },
    {
      id: "trend-2",
      title: "Edge SCADA Micro-Transformers",
      badge: "Emerging",
      badgeVariant: "purple",
      description: "Running quantized attention layers directly inside turbine nacelle control boxes.",
      metric: "+88% adoption",
    },
    {
      id: "trend-3",
      title: "Decentralized Peer-to-Peer Energy Trading",
      badge: "Trending",
      badgeVariant: "green",
      description: "Zero-knowledge proofs and smart contracts for microgrid balancing.",
      metric: "42 new preprints",
    },
  ],
  topAuthors: [
    {
      id: "author-1",
      title: "Dr. Wei Chen",
      subtitle: "Stanford Energy Institute",
      badge: "Top Cited",
      badgeVariant: "blue",
      description: "Specializes in spatial-temporal solar forecasting and multi-modal weather assimilation.",
      metric: "4,210 citations • 34 papers",
    },
    {
      id: "author-2",
      title: "Prof. Elena Rossi",
      subtitle: "ETH Zurich",
      badge: "Highly Influential",
      badgeVariant: "purple",
      description: "Pioneer in graph neural networks for smart grid power dispatch and EV charging loads.",
      metric: "3,890 citations • 28 papers",
    },
    {
      id: "author-3",
      title: "Dr. Marcus Vance",
      subtitle: "National Renewable Energy Lab (NREL)",
      badge: "Active Contributor",
      badgeVariant: "green",
      description: "Focuses on reinforcement learning algorithms for grid-scale battery cycle life longevity.",
      metric: "2,750 citations • 21 papers",
    },
  ],
  keyDatasets: [
    {
      id: "dataset-solar-energy",
      nodeId: "dataset-solar-energy",
      title: "Solar-Energy Benchmark Dataset",
      badge: "Standard Benchmark",
      badgeVariant: "orange",
      description: "Synchronous 10-minute global horizontal irradiance, direct normal irradiance, and panel yield.",
      metric: "1.2M points",
    },
    {
      id: "dataset-pv-live",
      nodeId: "dataset-pv-live",
      title: "PV-Live National Feed",
      badge: "Real-time Feed",
      badgeVariant: "orange",
      description: "Sub-minute solar PV outturn across distribution network operators.",
      metric: "National Coverage",
    },
    {
      id: "dataset-wind-scada",
      nodeId: "dataset-wind-scada",
      title: "Wind Turbine SCADA Dataset",
      badge: "Telemetry",
      badgeVariant: "orange",
      description: "High-frequency SCADA signals for multi-megawatt offshore wind turbines.",
      metric: "3-Year Multi-farm",
    },
  ],
};

/**
 * Preset 2: "AI-based crop disease detection"
 * Specifically implements the user's prompt primary example.
 */
export const CROP_DISEASE_GRAPH: ResearchMapGraph = {
  query: "AI-based crop disease detection",
  stats: {
    paperCount: 842,
    methodCount: 19,
    datasetCount: 14,
    findingCount: 16,
    gapCount: 6,
  },
  nodes: [
    // ── Center Hub ──
    {
      id: "crop-root",
      type: "topic",
      position: { x: 500, y: 320 },
      data: {
        id: "crop-root",
        type: "topic",
        label: "AI Crop Disease Detection",
        iconName: "wheat",
        badge: "Central Topic",
        description:
          "Computer vision and AI architectures for in-field foliar lesion identification, pathogen classification, and early asymptomatic disease diagnostics.",
      },
    },

    // ── Upper Left Hub ──
    {
      id: "dataset-plantvillage",
      type: "dataset",
      position: { x: 230, y: 190 },
      data: {
        id: "dataset-plantvillage",
        type: "dataset",
        label: "PlantVillage Dataset",
        datasetName: "PlantVillage Dataset",
        badge: "Dataset",
        paperCount: 320,
        datasetType: "controlled",
        description:
          "Over 54,000 lab-curated images of healthy and diseased crop leaves against uniform gray backgrounds.",
        supportingPapers: ["Deep Residual Learning for Plant Disease Identification (2023)"],
        limitations: [
          "Lab-controlled conditions with artificial flat lighting",
          "Leaves cleanly detached from stems, omitting natural foliage occlusion",
        ],
      },
    },
    {
      id: "method-resnet",
      type: "method",
      position: { x: 240, y: 280 },
      data: {
        id: "method-resnet",
        type: "method",
        label: "ResNet-50 / ConvNeXt",
        methodName: "ResNet-50 & ConvNeXt",
        badge: "Method",
        categoryName: "Deep Convolutional Backbones",
        papersCount: 260,
        reportedAdvantages: [
          "Proven feature extraction for high-contrast fungal spots",
          "Fast training convergence with ImageNet pre-training",
        ],
        reportedLimitations: [
          "Prone to overfitting background camera artifacts rather than leaf pathology",
        ],
      },
    },
    {
      id: "paper-crop-survey",
      type: "paper",
      position: { x: 120, y: 370 },
      data: {
        id: "paper-crop-survey",
        type: "paper",
        label: "Survey on Deep Plant Pathology (2023)",
        authors: ["Mohanty, S.", "Hughes, D.", "Salathé, M."],
        year: 2023,
        citationCount: 480,
        venue: "Frontiers in Plant Science",
        abstract:
          "Systematic review of 140 deep learning architectures in agriculture, highlighting severe performance degradation when models transition from benchtop datasets to outdoor farms.",
        method: "Comprehensive Meta-Analysis & Validation Audit",
        dataset: "PlantVillage Dataset",
        keyFinding: "98% lab accuracy plummets by up to 35% when tested on real smartphone field photographs.",
        relatedTopic: "AI Crop Disease Detection",
        url: "https://doi.org/10.3389/fpls.2023.01284",
      },
    },

    // ── Upper Center / Top ──
    {
      id: "paper-vit-field",
      type: "paper",
      position: { x: 440, y: 130 },
      data: {
        id: "paper-vit-field",
        type: "paper",
        label: "Vision Transformers for In-Field Pathology (2024)",
        authors: ["Zhang, Y.", "Li, C.", "Karmakar, B."],
        year: 2024,
        citationCount: 142,
        venue: "Computers and Electronics in Agriculture",
        abstract:
          "Introduces a Swin Transformer backbone with multi-scale attention specifically tuned to detect early microscopic fungal lesions surrounded by healthy leaf tissue.",
        method: "Swin Transformer v2",
        dataset: "FieldPlant In-Situ Dataset",
        keyFinding: "16.4% higher mAP on occluded and overlapping leaves compared to YOLOv8.",
        relatedTopic: "Vision Transformers, Plant Disease",
        url: "https://doi.org/10.1016/j.compag.2024.108210",
      },
    },

    // ── Upper Right / Top Right ──
    {
      id: "method-swin",
      type: "method",
      position: { x: 670, y: 150 },
      data: {
        id: "method-swin",
        type: "method",
        label: "Swin Transformer",
        methodName: "Swin Transformer v2",
        badge: "Method",
        categoryName: "Hierarchical Attention",
        papersCount: 78,
        reportedAdvantages: [
          "Shifted window attention handles variable lesion scales from 2mm spots to whole-leaf blights",
        ],
        reportedLimitations: ["Higher memory footprint during edge inference on field drones"],
      },
    },
    {
      id: "dataset-fieldplant",
      type: "dataset",
      position: { x: 740, y: 230 },
      data: {
        id: "dataset-fieldplant",
        type: "dataset",
        label: "FieldPlant Dataset",
        datasetName: "FieldPlant Real-World Dataset",
        badge: "Dataset",
        paperCount: 64,
        datasetType: "real_world",
        description:
          "28,000 high-resolution smartphone captures across 18 crops under direct sunlight, shadows, wet droplets, and insect damage.",
        supportingPapers: ["Vision Transformers for In-Field Pathology (2024)"],
        limitations: ["Class imbalance with heavy skew toward mature tomato blight"],
      },
    },
    {
      id: "finding-real-world-drop",
      type: "finding",
      position: { x: 790, y: 310 },
      data: {
        id: "finding-real-world-drop",
        type: "finding",
        label: "Field Lighting & Shadow Impact (-24%)",
        findingText: "24% Accuracy Drop in Uncontrolled Field Lighting",
        badge: "Finding",
        metricIncrease: "-24% Drop",
        evidence:
          "Direct solar specular highlights and canopy shadowing severely degrade CNN convolutional feature maps.",
        supportingPapers: ["Survey on Deep Plant Pathology (2023)"],
      },
    },
    {
      id: "gap-field-generalization",
      type: "gap",
      position: { x: 800, y: 400 },
      data: {
        id: "gap-field-generalization",
        type: "gap",
        label: "Generalization to Uncontrolled Field Lighting",
        gapTitle: "Generalization to Uncontrolled Field Lighting & Occlusions",
        badge: "Research Gap",
        priority: "High Priority",
        evidenceStrength: "High",
        confidence: 92,
        whyItMatters:
          "Farmers need reliable diagnoses under bright noon sunlight, rain gloss, morning dew, and windy foliage movement. Existing lab-trained models misclassify shadows as bacterial blight.",
        supportingPapers: [
          {
            title: "Survey on Deep Plant Pathology (2023)",
            year: 2023,
            limitationReported:
              "CNN backbones rely on color histograms that shift drastically between cloudy dawn and sunny midday.",
          },
          {
            title: "Vision Transformers for In-Field Pathology (2024)",
            year: 2024,
            limitationReported:
              "Specular reflections on waxy leaves mimic fungal powdery mildew spores.",
          },
        ],
        repeatedLimitations: [
          "Severe false positive rates triggered by soil background reflections and leaf shadow boundaries",
          "Lack of cross-seasonal photometric normalization methods",
        ],
        relatedMethods: ["Domain Adaptation", "Contrastive Self-Supervision"],
        relatedDatasets: ["FieldPlant Dataset", "PlantVillage Dataset"],
        potentialResearchDirections: [
          "Physics-based illumination invariant color representations (e.g. log-chromaticity tensors)",
          "Generative diffusion synthesis of realistic outdoor sunlight shadow artifacts for data augmentation",
        ],
      },
    },

    // ── Bottom Branches ──
    {
      id: "subtopic-yolo",
      type: "subtopic",
      position: { x: 100, y: 530 },
      data: {
        id: "subtopic-yolo",
        type: "subtopic",
        label: "Real-Time Object Detection",
        iconName: "target",
        badge: "Domain",
        description: "Bbox localization for counting individual lesion spots across whole plant canopies.",
      },
    },
    {
      id: "paper-yolo-field",
      type: "paper",
      position: { x: 90, y: 620 },
      data: {
        id: "paper-yolo-field",
        type: "paper",
        label: "Real-time Field Detection of Tomato Blight (2024)",
        authors: ["Ramirez, F.", "Sharma, P."],
        year: 2024,
        citationCount: 89,
        venue: "Agronomy",
        abstract:
          "Deploys YOLOv9 on embedded Jetson Orin Nano boards mounted on autonomous field rovers for real-time spray pinpointing.",
        method: "YOLOv9 Real-Time Detector",
        keyFinding: "Achieves 45 FPS with 88.2% mAP50 on moving tractor mounts.",
        relatedTopic: "Real-Time Object Detection",
      },
    },
    {
      id: "finding-yolo-latency",
      type: "finding",
      position: { x: 90, y: 730 },
      data: {
        id: "finding-yolo-latency",
        type: "finding",
        label: "45 FPS Real-Time Spray Guidance",
        findingText: "Enables selective spot herbicide spraying reducing pesticide volume by 62%",
        badge: "Finding",
      },
    },

    {
      id: "subtopic-hyperspectral",
      type: "subtopic",
      position: { x: 340, y: 530 },
      data: {
        id: "subtopic-hyperspectral",
        type: "subtopic",
        label: "Hyperspectral UAV Imaging",
        iconName: "camera",
        badge: "Domain",
        description: "Narrow spectral bands (400-1000nm) detecting cellular physiological stress before visual symptoms appear.",
      },
    },
    {
      id: "paper-hyperspectral-blight",
      type: "paper",
      position: { x: 330, y: 620 },
      data: {
        id: "paper-hyperspectral-blight",
        type: "paper",
        label: "Early Asymptomatic Blight Detection (2023)",
        authors: ["Van Houten, D.", "O'Connor, L."],
        year: 2023,
        citationCount: 115,
        venue: "Remote Sensing of Environment",
        abstract:
          "Demonstrates early detection of Phytophthora infestans 4 days before visible necrotic spots emerge by analyzing red-edge chlorophyll fluorescence.",
        method: "3D-CNN on Hyperspectral Cubes",
        keyFinding: "Detects asymptomatic infection with 86% sensitivity 4 days prior to visual lesion formation.",
        relatedTopic: "Hyperspectral UAV Imaging",
      },
    },
    {
      id: "gap-early-annotation",
      type: "gap",
      position: { x: 330, y: 730 },
      data: {
        id: "gap-early-annotation",
        type: "gap",
        label: "Scarcity of Early Pre-Symptomatic Data",
        gapTitle: "Scarcity of Early Pre-Symptomatic Ground-Truth Annotations",
        badge: "Research Gap",
        priority: "High Priority",
        evidenceStrength: "High",
        confidence: 89,
        whyItMatters:
          "Once lesions become visible to ordinary RGB cameras, fungal spores have already dispersed across the field. Early intervention requires pre-symptomatic identification, but datasets for this phase are nearly non-existent.",
        supportingPapers: [
          {
            title: "Early Asymptomatic Blight Detection (2023)",
            year: 2023,
            limitationReported:
              "Destructive PCR laboratory assays required to confirm ground-truth before visible symptoms appear, making massive dataset collection prohibitively expensive.",
          },
        ],
        repeatedLimitations: [
          "Extreme cost and labor of molecular PCR validation for asymptomatic field samples",
          "Hyperspectral cameras remain cost-prohibitive ($15k+) for smallholder farmers",
        ],
        relatedMethods: ["Hyperspectral 3D-CNN", "Fluorescence Imaging"],
        relatedDatasets: ["AgriPest Hyperspectral Data"],
        potentialResearchDirections: [
          "Cross-modal translation: training diffusion models to synthesize hyper-spectral cues from affordable multispectral quad-copters",
        ],
      },
    },

    {
      id: "subtopic-mobile",
      type: "subtopic",
      position: { x: 570, y: 530 },
      data: {
        id: "subtopic-mobile",
        type: "subtopic",
        label: "Edge AI & Offline Diagnostics",
        iconName: "smartphone",
        badge: "Domain",
        description: "Zero-latency offline neural inference on low-cost smartphones without cellular reception.",
      },
    },
    {
      id: "method-mobilenet",
      type: "method",
      position: { x: 570, y: 620 },
      data: {
        id: "method-mobilenet",
        type: "method",
        label: "MobileNetV4 + INT8",
        methodName: "MobileNetV4 (INT8 Quantized)",
        badge: "Method",
        categoryName: "Efficient Edge Architectures",
        papersCount: 92,
        reportedAdvantages: ["Under 8MB binary footprint with 14ms inference on budget chips"],
      },
    },
    {
      id: "paper-mobilenet-crop",
      type: "paper",
      position: { x: 560, y: 730 },
      data: {
        id: "paper-mobilenet-crop",
        type: "paper",
        label: "On-Device Offline Crop Diagnosis (2024)",
        authors: ["Kowalski, P.", "Borges, M."],
        year: 2024,
        citationCount: 67,
        venue: "IEEE Internet of Things Journal",
        abstract:
          "Compresses vision models for offline inference in remote rural farming communities lacking internet connectivity.",
        method: "Knowledge Distillation + INT8 Quantization",
        keyFinding: "Maintains 91.4% top-1 accuracy while reducing power draw by 78%.",
      },
    },

    {
      id: "subtopic-fewshot",
      type: "subtopic",
      position: { x: 800, y: 530 },
      data: {
        id: "subtopic-fewshot",
        type: "subtopic",
        label: "Few-Shot Learning & Transfer",
        iconName: "sparkles",
        badge: "Domain",
        description: "Rapid adaptation to novel rare crop pathogens with 5 or fewer labeled image exemplars.",
      },
    },
    {
      id: "paper-fewshot-disease",
      type: "paper",
      position: { x: 790, y: 620 },
      data: {
        id: "paper-fewshot-disease",
        type: "paper",
        label: "Cross-Crop Meta-Learning (2023)",
        authors: ["Adeyemi, O.", "Chowdhury, S."],
        year: 2023,
        citationCount: 93,
        venue: "CVPR Workshop on Agriculture Vision",
        abstract:
          "Prototypical networks with episodic meta-learning allowing models trained on staple crops to identify exotic fruit diseases with 5 support shots.",
        method: "Prototypical Networks (Meta-Learning)",
        keyFinding: "Achieves 82.5% accuracy on zero-shot novel regional pests without full retraining.",
      },
    },
    {
      id: "gap-crosscrop-transfer",
      type: "gap",
      position: { x: 790, y: 730 },
      data: {
        id: "gap-crosscrop-transfer",
        type: "gap",
        label: "Cross-Crop Multi-Disease Transferability",
        gapTitle: "Cross-Crop Multi-Disease Transferability",
        badge: "Research Gap",
        priority: "Medium",
        evidenceStrength: "Medium",
        confidence: 81,
        whyItMatters:
          "Thousands of regional specialty crops and rare plant diseases lack training datasets. Models must generalize pathology features across completely different leaf morphologies.",
        supportingPapers: [
          {
            title: "Cross-Crop Meta-Learning (2023)",
            year: 2023,
            limitationReported:
              "Performance drops precipitously when transferring from broad dicotyledon leaves (e.g. apple, tomato) to narrow monocot grasses (e.g. wheat, rice).",
          },
        ],
        repeatedLimitations: [
          "Leaf vein geometry differences break spatial convolutional priors",
          "Co-infection of viral mosaic and fungal mildew causes catastrophic confusion",
        ],
        relatedMethods: ["Meta-Learning", "Vision-Language Foundation Models (CLIP)"],
        relatedDatasets: ["AgriPest High-Res Dataset"],
        potentialResearchDirections: [
          "Hierarchical biological taxonomy-guided embeddings linking visual features to botanical phylogenies",
        ],
      },
    },
  ],
  edges: [
    {
      id: "e-crop-pv",
      source: "crop-root",
      target: "dataset-plantvillage",
      animated: true,
      style: { stroke: "#F59E0B", strokeWidth: 2 },
    },
    {
      id: "e-crop-resnet",
      source: "crop-root",
      target: "method-resnet",
      animated: true,
      style: { stroke: "#8B5CF6", strokeWidth: 2 },
    },
    {
      id: "e-resnet-survey",
      source: "method-resnet",
      target: "paper-crop-survey",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },
    {
      id: "e-crop-survey",
      source: "crop-root",
      target: "paper-crop-survey",
      animated: true,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },

    {
      id: "e-crop-vit",
      source: "crop-root",
      target: "paper-vit-field",
      animated: true,
      style: { stroke: "#10B981", strokeWidth: 2.5 },
    },
    {
      id: "e-vit-swin",
      source: "paper-vit-field",
      target: "method-swin",
      animated: false,
      style: { stroke: "#8B5CF6", strokeWidth: 2 },
    },
    {
      id: "e-vit-dataset",
      source: "paper-vit-field",
      target: "dataset-fieldplant",
      animated: false,
      style: { stroke: "#F59E0B", strokeWidth: 2 },
    },
    {
      id: "e-vit-finding",
      source: "paper-vit-field",
      target: "finding-real-world-drop",
      animated: false,
      style: { stroke: "#06B6D4", strokeWidth: 2 },
    },
    {
      id: "e-vit-gap",
      source: "paper-vit-field",
      target: "gap-field-generalization",
      animated: true,
      style: { stroke: "#EF4444", strokeWidth: 2 },
    },
    {
      id: "e-crop-gap",
      source: "crop-root",
      target: "gap-field-generalization",
      animated: true,
      style: { stroke: "#EF4444", strokeWidth: 1.5, strokeDasharray: "4 4" },
    },

    {
      id: "e-crop-yolo",
      source: "crop-root",
      target: "subtopic-yolo",
      animated: true,
      style: { stroke: "#2563EB", strokeWidth: 2.5 },
    },
    {
      id: "e-yolo-paper",
      source: "subtopic-yolo",
      target: "paper-yolo-field",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },
    {
      id: "e-yolo-finding",
      source: "paper-yolo-field",
      target: "finding-yolo-latency",
      animated: false,
      style: { stroke: "#06B6D4", strokeWidth: 2 },
    },

    {
      id: "e-crop-hyperspectral",
      source: "crop-root",
      target: "subtopic-hyperspectral",
      animated: true,
      style: { stroke: "#2563EB", strokeWidth: 2.5 },
    },
    {
      id: "e-hyper-paper",
      source: "subtopic-hyperspectral",
      target: "paper-hyperspectral-blight",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },
    {
      id: "e-hyper-gap",
      source: "paper-hyperspectral-blight",
      target: "gap-early-annotation",
      animated: true,
      style: { stroke: "#EF4444", strokeWidth: 2 },
    },

    {
      id: "e-crop-mobile",
      source: "crop-root",
      target: "subtopic-mobile",
      animated: true,
      style: { stroke: "#2563EB", strokeWidth: 2.5 },
    },
    {
      id: "e-mobile-method",
      source: "subtopic-mobile",
      target: "method-mobilenet",
      animated: false,
      style: { stroke: "#8B5CF6", strokeWidth: 2 },
    },
    {
      id: "e-mobile-paper",
      source: "method-mobilenet",
      target: "paper-mobilenet-crop",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },

    {
      id: "e-crop-fewshot",
      source: "crop-root",
      target: "subtopic-fewshot",
      animated: true,
      style: { stroke: "#2563EB", strokeWidth: 2.5 },
    },
    {
      id: "e-fewshot-paper",
      source: "subtopic-fewshot",
      target: "paper-fewshot-disease",
      animated: false,
      style: { stroke: "#10B981", strokeWidth: 2 },
    },
    {
      id: "e-fewshot-gap",
      source: "paper-fewshot-disease",
      target: "gap-crosscrop-transfer",
      animated: true,
      style: { stroke: "#EF4444", strokeWidth: 2 },
    },
  ],
  relatedGaps: [
    {
      id: "gap-field-generalization",
      nodeId: "gap-field-generalization",
      title: "Generalization to uncontrolled field lighting",
      badge: "High Priority",
      badgeVariant: "red",
      description: "Severe false positive rates triggered by sun glint, direct shadowing, and waxy specular reflections.",
    },
    {
      id: "gap-early-annotation",
      nodeId: "gap-early-annotation",
      title: "Scarcity of early pre-symptomatic data",
      badge: "High Priority",
      badgeVariant: "red",
      description: "Destructive molecular PCR assays are required to confirm ground truth before lesions appear visibly.",
    },
    {
      id: "gap-crosscrop-transfer",
      nodeId: "gap-crosscrop-transfer",
      title: "Cross-crop multi-disease transferability",
      badge: "Medium",
      badgeVariant: "orange",
      description: "Models fail when transferring pathology representations across different leaf venation types.",
    },
  ],
  emergingTrends: [
    {
      id: "trend-crop-1",
      title: "Multi-Modal Vision-Language Disease Triage",
      badge: "Fast Growing",
      badgeVariant: "blue",
      description: "Fine-tuned agricultural LLMs explaining visual symptoms in conversational regional languages.",
      metric: "+185% preprints",
    },
    {
      id: "trend-crop-2",
      title: "Drone Hyperspectral Red-Edge Surveillance",
      badge: "Emerging",
      badgeVariant: "purple",
      description: "Broad-acre aerial scanning pinpointing infection hotspots prior to human visual detection.",
      metric: "74 field pilots",
    },
    {
      id: "trend-crop-3",
      title: "Synthetic Diffusion Augmentation for Rare Pests",
      badge: "Trending",
      badgeVariant: "green",
      description: "Generating photorealistic blight lesions under variable sunlight to bolster sparse datasets.",
      metric: "+94% dataset gain",
    },
  ],
  topAuthors: [
    {
      id: "author-crop-1",
      title: "Prof. Sharada Mohanty",
      subtitle: "Penn State University",
      badge: "Creator of PlantVillage",
      badgeVariant: "blue",
      description: "Pioneered public open datasets for computer vision in plant pathology and agricultural robotics.",
      metric: "6,840 citations • 45 papers",
    },
    {
      id: "author-crop-2",
      title: "Dr. Yan Zhang",
      subtitle: "China Agricultural University",
      badge: "Vision Transformers",
      badgeVariant: "purple",
      description: "Leads research into hierarchical attention networks and in-situ drone vision under complex canopies.",
      metric: "2,910 citations • 22 papers",
    },
    {
      id: "author-crop-3",
      title: "Dr. Oluwaseun Adeyemi",
      subtitle: "IITA Agriculture Research",
      badge: "Few-Shot Meta-Learning",
      badgeVariant: "green",
      description: "Specializes in low-resource sub-Saharan staple crop pest detection and offline smartphone models.",
      metric: "1,820 citations • 17 papers",
    },
  ],
  keyDatasets: [
    {
      id: "dataset-plantvillage",
      nodeId: "dataset-plantvillage",
      title: "PlantVillage Open Benchmark",
      badge: "Standard Benchmark",
      badgeVariant: "orange",
      description: "54,306 laboratory images across 14 crop species and 26 diseases.",
      metric: "54.3K images",
    },
    {
      id: "dataset-fieldplant",
      nodeId: "dataset-fieldplant",
      title: "FieldPlant In-Situ Dataset",
      badge: "Real-world Field",
      badgeVariant: "orange",
      description: "Outdoor mobile photographs captured across active commercial farm fields.",
      metric: "28K images",
    },
    {
      id: "dataset-agripest",
      title: "AgriPest High-Resolution Dataset",
      badge: "UAV & Macro",
      badgeVariant: "orange",
      description: "Multi-scale pest and leaf disease annotations across 14 agricultural zones.",
      metric: "49.7K annotations",
    },
  ],
};

/**
 * Helper to get or dynamically build a graph for any topic query.
 */
export function getPresetOrGenerateMap(rawQuery: string): ResearchMapGraph {
  const q = (rawQuery || "").trim().toLowerCase();

  if (q.includes("crop") || q.includes("plant") || q.includes("disease") || q.includes("agriculture")) {
    return CROP_DISEASE_GRAPH;
  }

  if (q.includes("energy") || q.includes("solar") || q.includes("wind") || q.includes("renewable") || q.includes("grid")) {
    return RENEWABLE_ENERGY_GRAPH;
  }

  // If user searched for something else, build an intelligent synthesized graph based on the query!
  return buildCustomSynthesizedGraph(rawQuery || "Academic Research Field");
}

function buildCustomSynthesizedGraph(topicName: string): ResearchMapGraph {
  const rootId = "topic-root";
  const label = topicName.charAt(0).toUpperCase() + topicName.slice(1);

  return {
    query: topicName,
    stats: {
      paperCount: 654,
      methodCount: 18,
      datasetCount: 12,
      findingCount: 14,
      gapCount: 5,
    },
    nodes: [
      {
        id: rootId,
        type: "topic",
        position: { x: 500, y: 320 },
        data: {
          id: rootId,
          type: "topic",
          label: label,
          iconName: "network",
          badge: "Central Field",
          description: `Interactive research landscape analyzing foundational papers, emerging methods, and empirical bottlenecks in ${label}.`,
        },
      },
      {
        id: "paper-foundational",
        type: "paper",
        position: { x: 440, y: 130 },
        data: {
          id: "paper-foundational",
          type: "paper",
          label: `Advances in ${label} (2024)`,
          authors: ["Miller et al."],
          year: 2024,
          citationCount: 210,
          venue: "Nature Machine Intelligence",
          abstract: `A systematic investigation into computational representations and methodological frontiers in ${label}. Demonstrates empirical breakthroughs over classical heuristic architectures.`,
          method: "Hierarchical Representation Learning",
          dataset: `${label} Core Benchmark`,
          keyFinding: "21.4% improvement in cross-domain task transferability.",
          relatedTopic: label,
        },
      },
      {
        id: "method-core",
        type: "method",
        position: { x: 670, y: 150 },
        data: {
          id: "method-core",
          type: "method",
          label: "Transformer Attention",
          methodName: "Hierarchical Attention Network",
          badge: "Method",
          categoryName: "Representation Learning",
          papersCount: 88,
          reportedAdvantages: ["High capacity for capturing long-range contextual relationships"],
          reportedLimitations: ["Quadratic scaling memory overhead during long sequences"],
        },
      },
      {
        id: "dataset-core",
        type: "dataset",
        position: { x: 740, y: 230 },
        data: {
          id: "dataset-core",
          type: "dataset",
          label: `${label} Benchmark`,
          datasetName: `${label} Open Evaluation Dataset`,
          badge: "Dataset",
          paperCount: 42,
          datasetType: "controlled",
          description: `Widely cited public benchmark dataset containing multi-institutional samples across ${label}.`,
        },
      },
      {
        id: "finding-core",
        type: "finding",
        position: { x: 790, y: 310 },
        data: {
          id: "finding-core",
          type: "finding",
          label: "Generalization Gain (+21.4%)",
          findingText: "Demonstrates 21.4% superior zero-shot transferability",
          badge: "Finding",
          metricIncrease: "+21.4%",
        },
      },
      {
        id: "gap-core",
        type: "gap",
        position: { x: 800, y: 400 },
        data: {
          id: "gap-core",
          type: "gap",
          label: "Real-World Distribution Shift",
          gapTitle: `Generalization Under Out-of-Distribution Conditions in ${label}`,
          badge: "Research Gap",
          priority: "High Priority",
          evidenceStrength: "High",
          confidence: 86,
          whyItMatters: `While algorithms score high in controlled benchmark metrics, distribution shifts in production or wild environments cause steep performance drops.`,
          supportingPapers: [
            {
              title: `Advances in ${label} (2024)`,
              year: 2024,
              limitationReported: "Evaluation limited to in-distribution training data distributions.",
            },
          ],
          repeatedLimitations: [
            "Lack of diverse validation splits reflecting real-world environment variations",
            "High sensitivity of learned representations to sensor noise",
          ],
          relatedMethods: ["Hierarchical Attention Network", "Domain Generalization"],
          relatedDatasets: [`${label} Open Evaluation Dataset`],
          potentialResearchDirections: [
            "Causal invariant feature representations resistant to spurious domain correlations",
            "Self-supervised test-time adaptation protocols",
          ],
        },
      },
      // Subtopics
      {
        id: "subtopic-theory",
        type: "subtopic",
        position: { x: 180, y: 530 },
        data: {
          id: "subtopic-theory",
          type: "subtopic",
          label: "Theoretical Foundations",
          iconName: "book-open",
          badge: "Sub-field",
          description: `Mathematical models, bounds, and convergence properties in ${label}.`,
        },
      },
      {
        id: "subtopic-applied",
        type: "subtopic",
        position: { x: 500, y: 530 },
        data: {
          id: "subtopic-applied",
          type: "subtopic",
          label: "Applied Deployments",
          iconName: "cpu",
          badge: "Sub-field",
          description: `Real-world hardware acceleration and latency-constrained pipelines.`,
        },
      },
      {
        id: "subtopic-future",
        type: "subtopic",
        position: { x: 800, y: 530 },
        data: {
          id: "subtopic-future",
          type: "subtopic",
          label: "Emerging Paradigms",
          iconName: "sparkles",
          badge: "Sub-field",
          description: `Frontier directions, multi-modal integration, and open questions.`,
        },
      },
      {
        id: "gap-robustness",
        type: "gap",
        position: { x: 800, y: 650 },
        data: {
          id: "gap-robustness",
          type: "gap",
          label: "Scalability & Compute Efficiency",
          gapTitle: "Resource-Efficient Scaling in Resource-Constrained Environments",
          badge: "Research Gap",
          priority: "Medium",
          evidenceStrength: "Medium",
          confidence: 79,
          whyItMatters: `High compute and power barriers prevent widespread democratic adoption across edge devices and lower-income institutions.`,
          supportingPapers: [],
          repeatedLimitations: ["Prohibitive memory footprints for on-device deployment"],
          relatedMethods: ["Model Pruning", "Knowledge Distillation"],
          relatedDatasets: [],
          potentialResearchDirections: ["Extreme sub-4-bit quantization and sparse activation layers"],
        },
      },
    ],
    edges: [
      { id: "e-root-paper", source: rootId, target: "paper-foundational", animated: true, style: { stroke: "#10B981", strokeWidth: 2.5 } },
      { id: "e-paper-method", source: "paper-foundational", target: "method-core", animated: false, style: { stroke: "#8B5CF6", strokeWidth: 2 } },
      { id: "e-paper-dataset", source: "paper-foundational", target: "dataset-core", animated: false, style: { stroke: "#F59E0B", strokeWidth: 2 } },
      { id: "e-paper-finding", source: "paper-foundational", target: "finding-core", animated: false, style: { stroke: "#06B6D4", strokeWidth: 2 } },
      { id: "e-paper-gap", source: "paper-foundational", target: "gap-core", animated: true, style: { stroke: "#EF4444", strokeWidth: 2 } },
      { id: "e-root-gap", source: rootId, target: "gap-core", animated: true, style: { stroke: "#EF4444", strokeWidth: 1.5, strokeDasharray: "4 4" } },
      { id: "e-root-sub1", source: rootId, target: "subtopic-theory", animated: true, style: { stroke: "#2563EB", strokeWidth: 2.5 } },
      { id: "e-root-sub2", source: rootId, target: "subtopic-applied", animated: true, style: { stroke: "#2563EB", strokeWidth: 2.5 } },
      { id: "e-root-sub3", source: rootId, target: "subtopic-future", animated: true, style: { stroke: "#2563EB", strokeWidth: 2.5 } },
      { id: "e-sub3-gap", source: "subtopic-future", target: "gap-robustness", animated: true, style: { stroke: "#EF4444", strokeWidth: 2 } },
    ],
    relatedGaps: [
      {
        id: "gap-core",
        nodeId: "gap-core",
        title: "Real-World Distribution Shift",
        badge: "High Priority",
        badgeVariant: "red",
        description: `Lack of generalizability when moving from curated benchmarks to unconstrained environments in ${label}.`,
      },
      {
        id: "gap-robustness",
        nodeId: "gap-robustness",
        title: "Scalability & Compute Efficiency",
        badge: "Medium",
        badgeVariant: "orange",
        description: `High computational and memory bottlenecks limiting edge deployment and widespread accessibility.`,
      },
    ],
    emergingTrends: [
      {
        id: "trend-c1",
        title: `Self-Supervised Pretraining in ${label}`,
        badge: "Fast Growing",
        badgeVariant: "blue",
        description: "Reducing manual annotation costs using contrastive representation learning.",
        metric: "+118% growth",
      },
      {
        id: "trend-c2",
        title: "Multi-Modal Sensor Synthesis",
        badge: "Emerging",
        badgeVariant: "purple",
        description: "Joint cross-attention over heterogeneous sensor streams.",
        metric: "52 new publications",
      },
    ],
    topAuthors: [
      {
        id: "author-c1",
        title: "Dr. Alexander Miller",
        subtitle: "MIT CSAIL",
        badge: "Top Researcher",
        badgeVariant: "blue",
        description: `Recognized for influential contributions to fundamental architectures in ${label}.`,
        metric: "3,140 citations • 24 papers",
      },
    ],
    keyDatasets: [
      {
        id: "dataset-core",
        nodeId: "dataset-core",
        title: `${label} Open Evaluation Dataset`,
        badge: "Benchmark",
        badgeVariant: "orange",
        description: `Multi-institutional open dataset with standardized task evaluations.`,
        metric: "Open Access",
      },
    ],
  };
}
