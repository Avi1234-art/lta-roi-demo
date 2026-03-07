const SCENARIOS = ["low", "base", "high"];
const WORKER_LOOKUP_URL = "https://persana-company-lookup.avi-lta-demo.workers.dev/company-lookup";
const MAX_ESTIMATED_REPS = 600;
const SCENARIO_LABELS = {
  low: "Low",
  base: "Base",
  high: "High"
};

const SCENARIO_COLORS = {
  bg: ["rgba(239, 68, 68, 0.7)", "rgba(234, 179, 8, 0.7)", "rgba(34, 197, 94, 0.7)"],
  border: ["rgba(239, 68, 68, 1)", "rgba(234, 179, 8, 1)", "rgba(34, 197, 94, 1)"]
};

const BREAKDOWN_COLORS = {
  time: ["rgba(248, 113, 113, 0.65)", "rgba(250, 204, 21, 0.65)", "rgba(74, 222, 128, 0.65)"],
  tools: ["rgba(239, 68, 68, 0.75)", "rgba(234, 179, 8, 0.75)", "rgba(34, 197, 94, 0.75)"],
  revenue: ["rgba(185, 28, 28, 0.7)", "rgba(161, 120, 5, 0.7)", "rgba(21, 128, 61, 0.7)"]
};

const FIELD_IDS = [
  "companySizeEmployees",
  "currentToolingAnnualUsd",
  "salesVolumeAnnualUsd"
];

const DEFAULT_MOCKS = [
  {
    aliases: ["microsoft", "msft"],
    companyName: "Microsoft",
    employeeEstimate: 221000,
    revenueEstimateUsd: 245000000000,
    logoUrl: "https://logo.clearbit.com/microsoft.com",
    confidence: 0.88,
    sources: [
      { label: "Wikipedia: Microsoft", url: "https://en.wikipedia.org/wiki/Microsoft", field: "company" },
      { label: "Wikidata: Microsoft", url: "https://www.wikidata.org/wiki/Q2283", field: "employeeEstimate,revenueEstimateUsd" }
    ]
  },
  {
    aliases: ["salesforce", "crm"],
    companyName: "Salesforce",
    employeeEstimate: 72682,
    revenueEstimateUsd: 34860000000,
    logoUrl: "https://logo.clearbit.com/salesforce.com",
    confidence: 0.84,
    sources: [
      { label: "Wikipedia: Salesforce", url: "https://en.wikipedia.org/wiki/Salesforce", field: "company" },
      { label: "Wikidata: Salesforce", url: "https://www.wikidata.org/wiki/Q42576", field: "employeeEstimate,revenueEstimateUsd" }
    ]
  },
  {
    aliases: ["hubspot"],
    companyName: "HubSpot",
    employeeEstimate: 8400,
    revenueEstimateUsd: 2200000000,
    logoUrl: "https://logo.clearbit.com/hubspot.com",
    confidence: 0.79,
    sources: [
      { label: "Wikipedia: HubSpot", url: "https://en.wikipedia.org/wiki/HubSpot", field: "company" }
    ]
  },
  {
    aliases: ["adobe"],
    companyName: "Adobe",
    employeeEstimate: 29800,
    revenueEstimateUsd: 21500000000,
    logoUrl: "https://logo.clearbit.com/adobe.com",
    confidence: 0.82,
    sources: [
      { label: "Wikipedia: Adobe", url: "https://en.wikipedia.org/wiki/Adobe_Inc.", field: "company" }
    ]
  },
  {
    aliases: ["oracle"],
    companyName: "Oracle",
    employeeEstimate: 159000,
    revenueEstimateUsd: 53000000000,
    logoUrl: "https://logo.clearbit.com/oracle.com",
    confidence: 0.84,
    sources: [
      { label: "Wikipedia: Oracle", url: "https://en.wikipedia.org/wiki/Oracle_Corporation", field: "company" }
    ]
  },
  {
    aliases: ["google", "alphabet"],
    companyName: "Google",
    employeeEstimate: 182502,
    revenueEstimateUsd: 307400000000,
    logoUrl: "https://logo.clearbit.com/google.com",
    confidence: 0.9,
    sources: [
      { label: "Wikipedia: Google", url: "https://en.wikipedia.org/wiki/Google", field: "company" },
      { label: "Wikipedia: Alphabet Inc.", url: "https://en.wikipedia.org/wiki/Alphabet_Inc.", field: "employeeEstimate,revenueEstimateUsd" }
    ]
  },
  {
    aliases: ["tesla"],
    companyName: "Tesla",
    employeeEstimate: 140473,
    revenueEstimateUsd: 96773000000,
    logoUrl: "https://logo.clearbit.com/tesla.com",
    confidence: 0.9,
    sources: [
      { label: "Wikipedia: Tesla", url: "https://en.wikipedia.org/wiki/Tesla,_Inc.", field: "company" },
      { label: "Wikidata: Tesla", url: "https://www.wikidata.org/wiki/Q478214", field: "employeeEstimate,revenueEstimateUsd" }
    ]
  },
  {
    aliases: ["amazon", "amzn"],
    companyName: "Amazon",
    employeeEstimate: 1525000,
    revenueEstimateUsd: 575000000000,
    logoUrl: "https://logo.clearbit.com/amazon.com",
    confidence: 0.88,
    sources: [
      { label: "Wikipedia: Amazon", url: "https://en.wikipedia.org/wiki/Amazon_(company)", field: "company" }
    ]
  },
  {
    aliases: ["apple", "aapl"],
    companyName: "Apple",
    employeeEstimate: 164000,
    revenueEstimateUsd: 383000000000,
    logoUrl: "https://logo.clearbit.com/apple.com",
    confidence: 0.9,
    sources: [
      { label: "Wikipedia: Apple", url: "https://en.wikipedia.org/wiki/Apple_Inc.", field: "company" }
    ]
  },
  {
    aliases: ["meta", "facebook", "fb"],
    companyName: "Meta",
    employeeEstimate: 67317,
    revenueEstimateUsd: 135000000000,
    logoUrl: "https://logo.clearbit.com/meta.com",
    confidence: 0.87,
    sources: [
      { label: "Wikipedia: Meta Platforms", url: "https://en.wikipedia.org/wiki/Meta_Platforms", field: "company" }
    ]
  },
  {
    aliases: ["netflix", "nflx"],
    companyName: "Netflix",
    employeeEstimate: 13000,
    revenueEstimateUsd: 33700000000,
    logoUrl: "https://logo.clearbit.com/netflix.com",
    confidence: 0.85,
    sources: [
      { label: "Wikipedia: Netflix", url: "https://en.wikipedia.org/wiki/Netflix", field: "company" }
    ]
  },
  {
    aliases: ["nvidia", "nvda"],
    companyName: "Nvidia",
    employeeEstimate: 29600,
    revenueEstimateUsd: 60900000000,
    logoUrl: "https://logo.clearbit.com/nvidia.com",
    confidence: 0.86,
    sources: [
      { label: "Wikipedia: Nvidia", url: "https://en.wikipedia.org/wiki/Nvidia", field: "company" }
    ]
  },
  {
    aliases: ["shopify", "shop"],
    companyName: "Shopify",
    employeeEstimate: 11600,
    revenueEstimateUsd: 7060000000,
    logoUrl: "https://logo.clearbit.com/shopify.com",
    confidence: 0.82,
    sources: [
      { label: "Wikipedia: Shopify", url: "https://en.wikipedia.org/wiki/Shopify", field: "company" }
    ]
  },
  {
    aliases: ["spotify"],
    companyName: "Spotify",
    employeeEstimate: 9800,
    revenueEstimateUsd: 14300000000,
    logoUrl: "https://logo.clearbit.com/spotify.com",
    confidence: 0.83,
    sources: [
      { label: "Wikipedia: Spotify", url: "https://en.wikipedia.org/wiki/Spotify", field: "company" }
    ]
  },
  {
    aliases: ["uber"],
    companyName: "Uber",
    employeeEstimate: 32800,
    revenueEstimateUsd: 37300000000,
    logoUrl: "https://logo.clearbit.com/uber.com",
    confidence: 0.85,
    sources: [
      { label: "Wikipedia: Uber", url: "https://en.wikipedia.org/wiki/Uber", field: "company" }
    ]
  },
  {
    aliases: ["zoom", "zm"],
    companyName: "Zoom",
    employeeEstimate: 7400,
    revenueEstimateUsd: 4530000000,
    logoUrl: "https://logo.clearbit.com/zoom.us",
    confidence: 0.81,
    sources: [
      { label: "Wikipedia: Zoom", url: "https://en.wikipedia.org/wiki/Zoom_Video_Communications", field: "company" }
    ]
  },
  {
    aliases: ["ibm"],
    companyName: "IBM",
    employeeEstimate: 282200,
    revenueEstimateUsd: 61900000000,
    logoUrl: "https://logo.clearbit.com/ibm.com",
    confidence: 0.86,
    sources: [
      { label: "Wikipedia: IBM", url: "https://en.wikipedia.org/wiki/IBM", field: "company" }
    ]
  }
];

const form = document.getElementById("roi-form");
const scenarioButtons = document.querySelectorAll(".scenario-btn");
const companySearchRow = document.getElementById("companySearchRow");
const companyNameInput = document.getElementById("companyName");
const coreInputsPanel = document.getElementById("coreInputsPanel");
const autofillButton = document.getElementById("autofillBtn");
const lookupModeInputs = document.querySelectorAll("input[name='lookupMode']");
const lookupStatus = document.getElementById("lookupStatus");
const aiModeNote = document.getElementById("aiModeNote");
const lookupMeta = document.getElementById("lookupMeta");
const sourceList = document.getElementById("sourceList");
const confidenceBadge = document.getElementById("confidenceBadge");
const companyLogoWrap = document.getElementById("companyLogoWrap");
const companyLogo = document.getElementById("companyLogo");
const autoSyncTierCostsCheckbox = document.getElementById("autoSyncTierCosts");
const lookupCompanyNameEl = document.getElementById("lookupCompanyName");
const gatedSections = document.querySelectorAll(".data-gated");
const livePreview = document.getElementById("livePreview");
const livePreviewScenario = document.getElementById("livePreviewScenario");
const livePreviewRoi = document.getElementById("livePreviewRoi");
const livePreviewPayback = document.getElementById("livePreviewPayback");
const livePreviewBenefit = document.getElementById("livePreviewBenefit");
const livePreviewNet = document.getElementById("livePreviewNet");
const livePreviewHint = document.getElementById("livePreviewHint");
const AI_PLACEHOLDER_COMPANIES = ["Google", "Tesla", "Microsoft", "Salesforce", "HubSpot"];
const AI_PLACEHOLDER_PREFIX = "Search for ";

const outputNodes = {
  activeScenarioName: document.getElementById("activeScenarioName"),
  kpiRoiPct: document.getElementById("kpiRoiPct"),
  kpiPaybackMonths: document.getElementById("kpiPaybackMonths"),
  kpiTotalBenefit: document.getElementById("kpiTotalBenefit"),
  kpiNetBenefit: document.getElementById("kpiNetBenefit"),
  activeTimeSavings: document.getElementById("activeTimeSavings"),
  activeToolSavings: document.getElementById("activeToolSavings"),
  activeRevenueLift: document.getElementById("activeRevenueLift"),
  activePersanaCost: document.getElementById("activePersanaCost")
};

let activeScenario = "low";
let lookupMode = "manual";
let hasAiLookupData = false;
let placeholderTicker = null;
let placeholderCompanyIndex = 0;
let placeholderSuffixCount = 0;
let placeholderPhase = "typing";
let placeholderHoldTicks = 0;
let hasUserTriggeredResults = false;
let chartInstances = {
  roi: null,
  breakdown: null,
  payback: null
};

function setResultsVisibility(isReady) {
  gatedSections.forEach((section) => {
    section.classList.toggle("is-pending", !isReady);
    section.classList.toggle("is-ready", isReady);
  });

  if (livePreview) {
    livePreview.classList.toggle("is-pending", !isReady);
    livePreview.classList.toggle("is-ready", isReady);
  }

  if (livePreviewHint) {
    livePreviewHint.textContent = isReady
      ? "Live values update as you edit any field."
      : "Press Enter or edit any input to reveal results.";
  }
}

function primeResultsVisibility() {
  if (hasUserTriggeredResults) {
    return;
  }

  hasUserTriggeredResults = true;
  setResultsVisibility(true);
}

function getInputValue(id) {
  const element = document.getElementById(id);
  if (!element) {
    return 0;
  }

  const parsed = Number.parseFloat(element.value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getTierKey(companySize) {
  if (companySize <= 200) {
    return "smb";
  }

  if (companySize <= 1000) {
    return "mid";
  }

  return "ent";
}

function getTierDefaults() {
  return {
    smb: Math.max(0, getInputValue("tierSmbCostUsd")),
    mid: Math.max(0, getInputValue("tierMidCostUsd")),
    ent: Math.max(0, getInputValue("tierEntCostUsd"))
  };
}

function syncScenarioCostsFromTier() {
  if (!autoSyncTierCostsCheckbox.checked) {
    return;
  }

  const companySize = Math.max(1, getInputValue("companySizeEmployees"));
  const tierDefaults = getTierDefaults();
  const tierKey = getTierKey(companySize);
  const targetCost = tierDefaults[tierKey];

  SCENARIOS.forEach((scenario) => {
    const costInput = document.getElementById(`${scenario}-persanaAnnualCostUsd`);
    if (costInput) {
      costInput.value = String(Math.round(targetCost));
    }
  });
}

function validateMainInputs() {
  const errors = {};

  const companySizeEmployees = getInputValue("companySizeEmployees");
  const currentToolingAnnualUsd = getInputValue("currentToolingAnnualUsd");
  const salesVolumeAnnualUsd = getInputValue("salesVolumeAnnualUsd");

  if (companySizeEmployees < 1) {
    errors.companySizeEmployees = "Company size must be at least 1.";
  }

  if (currentToolingAnnualUsd < 0) {
    errors.currentToolingAnnualUsd = "Tooling spend cannot be negative.";
  }

  if (salesVolumeAnnualUsd < 0) {
    errors.salesVolumeAnnualUsd = "Sales volume cannot be negative.";
  }

  FIELD_IDS.forEach((fieldId) => {
    const errorNode = document.getElementById(`${fieldId}Error`);
    if (errorNode) {
      errorNode.textContent = errors[fieldId] || "";
    }
  });

  return errors;
}

function readScenarioAssumptions(scenario) {
  return {
    timeSavedHoursPerRepPerWeek: Math.max(0, getInputValue(`${scenario}-timeSavedHoursPerRepPerWeek`)),
    conversionLiftPct: Math.max(0, getInputValue(`${scenario}-conversionLiftPct`)),
    toolsReplacedPct: clamp(getInputValue(`${scenario}-toolsReplacedPct`), 0, 100),
    persanaAnnualCostUsd: Math.max(0, getInputValue(`${scenario}-persanaAnnualCostUsd`)),
    repCountRatio: Math.max(0, getInputValue(`${scenario}-repCountRatio`)),
    repFullyLoadedAnnualUsd: Math.max(0, getInputValue(`${scenario}-repFullyLoadedAnnualUsd`))
  };
}

function computeScenarioOutput(scenario) {
  const assumptions = readScenarioAssumptions(scenario);

  const companySizeEmployees = Math.max(1, getInputValue("companySizeEmployees"));
  const currentToolingAnnualUsd = Math.max(0, getInputValue("currentToolingAnnualUsd"));
  const salesVolumeAnnualUsd = Math.max(0, getInputValue("salesVolumeAnnualUsd"));

  const estimatedReps = clamp(companySizeEmployees * assumptions.repCountRatio, 1, MAX_ESTIMATED_REPS);
  const repHourlyCost = assumptions.repFullyLoadedAnnualUsd / 2000;
  const annualHoursSaved = estimatedReps * assumptions.timeSavedHoursPerRepPerWeek * 52;

  const timeSavingsValueUsd = annualHoursSaved * repHourlyCost;
  const toolSavingsUsd = currentToolingAnnualUsd * (assumptions.toolsReplacedPct / 100);
  const revenueLiftUsd = salesVolumeAnnualUsd * (assumptions.conversionLiftPct / 100);

  const totalBenefitUsd = timeSavingsValueUsd + toolSavingsUsd + revenueLiftUsd;
  const netBenefitUsd = totalBenefitUsd - assumptions.persanaAnnualCostUsd;
  const roiPct = assumptions.persanaAnnualCostUsd > 0
    ? (netBenefitUsd / assumptions.persanaAnnualCostUsd) * 100
    : 0;
  const paybackMonths = assumptions.persanaAnnualCostUsd > 0 && totalBenefitUsd > 0
    ? assumptions.persanaAnnualCostUsd / (totalBenefitUsd / 12)
    : null;

  return {
    assumptions,
    companySizeEmployees,
    estimatedReps,
    timeSavingsValueUsd,
    toolSavingsUsd,
    revenueLiftUsd,
    totalBenefitUsd,
    netBenefitUsd,
    roiPct,
    paybackMonths
  };
}

function computeAllScenarios() {
  const output = {};
  SCENARIOS.forEach((scenario) => {
    output[scenario] = computeScenarioOutput(scenario);
  });
  return output;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function formatPercent(value) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value || 0)}%`;
}

function formatMonths(value) {
  if (!Number.isFinite(value) || value === null) {
    return "Not reached";
  }

  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)} months`;
}

let previousKpiValues = {
  roiPct: 0, paybackMonths: 0, totalBenefit: 0, netBenefit: 0,
  timeSavings: 0, toolSavings: 0, revenueLift: 0, persanaCost: 0
};

function animateValue(element, start, end, duration, formatter) {
  if (Math.abs(start - end) < 0.01) { element.textContent = formatter(end); return; }
  const startTime = performance.now();
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = start + (end - start) * easeOutExpo(progress);
    element.textContent = formatter(current);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* Trigger pop animation on the parent kpi-card */
  const card = element.closest(".kpi-card");
  if (card) {
    card.classList.remove("kpi-pop");
    void card.offsetWidth; /* force reflow to restart animation */
    card.classList.add("kpi-pop");
  }
}

function updateImpactMeter(roiPct) {
  const marker = document.getElementById("impactMarker");
  const label = document.getElementById("impactLabel");
  if (!marker || !label) return;

  /* Map ROI% to 0-100% position on gauge (cap at 1500% ROI) */
  const clamped = Math.max(0, Math.min(roiPct, 1500));
  const pct = (clamped / 1500) * 100;
  marker.style.left = `${pct}%`;

  let level, text;
  if (roiPct < 150) {
    level = "low"; text = `Low Impact \u2022 ${formatPercent(roiPct)} ROI`;
  } else if (roiPct < 500) {
    level = "moderate"; text = `Moderate Impact \u2022 ${formatPercent(roiPct)} ROI`;
  } else if (roiPct < 1000) {
    level = "strong"; text = `Strong Impact \u2022 ${formatPercent(roiPct)} ROI`;
  } else {
    level = "exceptional"; text = `Exceptional \u2022 ${formatPercent(roiPct)} ROI`;
  }

  label.textContent = text;
  label.dataset.level = level;
}

function renderKpis(result) {
  outputNodes.activeScenarioName.textContent = SCENARIO_LABELS[activeScenario];
  const duration = 800;

  animateValue(outputNodes.kpiRoiPct, previousKpiValues.roiPct, result.roiPct, duration, formatPercent);

  if (Number.isFinite(result.paybackMonths)) {
    animateValue(outputNodes.kpiPaybackMonths, previousKpiValues.paybackMonths, result.paybackMonths, duration, formatMonths);
  } else {
    outputNodes.kpiPaybackMonths.textContent = "Not reached";
  }

  animateValue(outputNodes.kpiTotalBenefit, previousKpiValues.totalBenefit, result.totalBenefitUsd, duration, formatCurrency);
  animateValue(outputNodes.kpiNetBenefit, previousKpiValues.netBenefit, result.netBenefitUsd, duration, formatCurrency);
  animateValue(outputNodes.activeTimeSavings, previousKpiValues.timeSavings, result.timeSavingsValueUsd, duration, formatCurrency);
  animateValue(outputNodes.activeToolSavings, previousKpiValues.toolSavings, result.toolSavingsUsd, duration, formatCurrency);
  animateValue(outputNodes.activeRevenueLift, previousKpiValues.revenueLift, result.revenueLiftUsd, duration, formatCurrency);
  animateValue(outputNodes.activePersanaCost, previousKpiValues.persanaCost, result.assumptions.persanaAnnualCostUsd, duration, formatCurrency);

  previousKpiValues = {
    roiPct: result.roiPct,
    paybackMonths: Number.isFinite(result.paybackMonths) ? result.paybackMonths : 0,
    totalBenefit: result.totalBenefitUsd,
    netBenefit: result.netBenefitUsd,
    timeSavings: result.timeSavingsValueUsd,
    toolSavings: result.toolSavingsUsd,
    revenueLift: result.revenueLiftUsd,
    persanaCost: result.assumptions.persanaAnnualCostUsd
  };

  updateImpactMeter(result.roiPct);
}

function renderLivePreview(result) {
  if (!livePreview) {
    return;
  }

  if (livePreviewScenario) {
    livePreviewScenario.textContent = SCENARIO_LABELS[activeScenario];
  }

  if (livePreviewRoi) {
    livePreviewRoi.textContent = formatPercent(result.roiPct);
  }

  if (livePreviewPayback) {
    livePreviewPayback.textContent = formatMonths(result.paybackMonths);
  }

  if (livePreviewBenefit) {
    livePreviewBenefit.textContent = formatCurrency(result.totalBenefitUsd);
  }

  if (livePreviewNet) {
    livePreviewNet.textContent = formatCurrency(result.netBenefitUsd);
  }
}

function buildChartTheme() {
  return {
    axis: "#6f807a",
    accent: "#2f6f5a",
    accentSecondary: "#43856d",
    border: "#d6cec2",
    gridLine: "rgba(123, 138, 134, 0.22)",
    foreground: "#243331"
  };
}

function createBarGradients(ctx, colors, chartHeight) {
  return colors.map((color) => {
    const gradient = ctx.createLinearGradient(0, chartHeight, 0, 0);
    /* Parse rgba color and create faded version for top */
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const [, r, g, b] = match;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.85)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.3)`);
    } else {
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color);
    }
    return gradient;
  });
}

function createOrUpdateCharts(resultsByScenario) {
  const theme = buildChartTheme();
  const labels = SCENARIOS.map((scenario) => SCENARIO_LABELS[scenario]);

  const roiData = SCENARIOS.map((scenario) => round(resultsByScenario[scenario].roiPct));
  const paybackData = SCENARIOS.map((scenario) => {
    const value = resultsByScenario[scenario].paybackMonths;
    return Number.isFinite(value) ? round(value) : 0;
  });

  const breakdownData = {
    time: SCENARIOS.map((scenario) => round(resultsByScenario[scenario].timeSavingsValueUsd)),
    tools: SCENARIOS.map((scenario) => round(resultsByScenario[scenario].toolSavingsUsd)),
    revenue: SCENARIOS.map((scenario) => round(resultsByScenario[scenario].revenueLiftUsd))
  };

  const chartFont = { family: "'Inter', system-ui, sans-serif" };

  const tooltipStyle = {
    backgroundColor: "#ffffff",
    titleColor: "#25312f",
    bodyColor: "#586864",
    borderColor: "#d6cec2",
    borderWidth: 1,
    cornerRadius: 8,
    padding: 10,
    displayColors: false,
    titleFont: { ...chartFont, weight: "600", size: 13 },
    bodyFont: { ...chartFont, size: 12 }
  };

  const commonScales = {
    x: {
      ticks: { color: theme.axis, font: { ...chartFont, size: 12, weight: "500" } },
      grid: { display: false },
      border: { display: false }
    },
    y: {
      ticks: { color: theme.axis, font: { ...chartFont, size: 11 } },
      grid: { color: theme.gridLine, lineWidth: 0.6 },
      border: { display: false }
    }
  };

  if (!chartInstances.roi) {
    const roiCtx = document.getElementById("roiChart").getContext("2d");
    const roiGradients = createBarGradients(roiCtx, SCENARIO_COLORS.bg, 220);
    chartInstances.roi = new Chart(roiCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "ROI %",
          data: roiData,
          backgroundColor: roiGradients,
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 56
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle },
        scales: commonScales
      }
    });
  } else {
    chartInstances.roi.data.datasets[0].data = roiData;
    chartInstances.roi.update();
  }

  if (!chartInstances.breakdown) {
    const breakdownCtx = document.getElementById("breakdownChart").getContext("2d");
    const timeGradients = createBarGradients(breakdownCtx, BREAKDOWN_COLORS.time, 220);
    const toolsGradients = createBarGradients(breakdownCtx, BREAKDOWN_COLORS.tools, 220);
    const revenueGradients = createBarGradients(breakdownCtx, BREAKDOWN_COLORS.revenue, 220);
    chartInstances.breakdown = new Chart(breakdownCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Time savings",
            data: breakdownData.time,
            backgroundColor: timeGradients,
            borderRadius: 0,
            maxBarThickness: 56
          },
          {
            label: "Tool savings",
            data: breakdownData.tools,
            backgroundColor: toolsGradients,
            borderRadius: 0,
            maxBarThickness: 56
          },
          {
            label: "Revenue lift",
            data: breakdownData.revenue,
            backgroundColor: revenueGradients,
            borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 0, bottomRight: 0 },
            maxBarThickness: 56
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, ...commonScales.x },
          y: { stacked: true, ...commonScales.y }
        },
        plugins: {
          legend: {
            labels: {
              color: theme.foreground,
              boxWidth: 10,
              boxHeight: 10,
              borderRadius: 3,
              useBorderRadius: true,
              font: { ...chartFont, size: 11 },
              padding: 12
            }
          },
          tooltip: tooltipStyle
        }
      }
    });
  } else {
    chartInstances.breakdown.data.datasets[0].data = breakdownData.time;
    chartInstances.breakdown.data.datasets[1].data = breakdownData.tools;
    chartInstances.breakdown.data.datasets[2].data = breakdownData.revenue;
    chartInstances.breakdown.update();
  }

  if (!chartInstances.payback) {
    const paybackCtx = document.getElementById("paybackChart").getContext("2d");
    const paybackGradients = createBarGradients(paybackCtx, SCENARIO_COLORS.bg, 220);
    chartInstances.payback = new Chart(paybackCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Payback (months)",
          data: paybackData,
          backgroundColor: paybackGradients,
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 56
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipStyle },
        scales: commonScales
      }
    });
  } else {
    chartInstances.payback.data.datasets[0].data = paybackData;
    chartInstances.payback.update();
  }

  /* Update chart card footers with key insights */
  updateChartFooters(resultsByScenario);
}

function updateChartFooters(resultsByScenario) {
  const roiFooter = document.getElementById("roiChartFooter");
  const breakdownFooter = document.getElementById("breakdownChartFooter");
  const paybackFooter = document.getElementById("paybackChartFooter");

  if (roiFooter) {
    const bestScenario = SCENARIOS.reduce((a, b) =>
      resultsByScenario[a].roiPct >= resultsByScenario[b].roiPct ? a : b);
    roiFooter.innerHTML = `Best case: <span class="chart-footer-highlight">${formatPercent(resultsByScenario[bestScenario].roiPct)}</span> in ${SCENARIO_LABELS[bestScenario]} scenario`;
  }

  if (breakdownFooter) {
    const baseBenefit = resultsByScenario.base.totalBenefitUsd;
    breakdownFooter.innerHTML = `Base total benefit: <span class="chart-footer-highlight">${formatCurrency(baseBenefit)}</span>`;
  }

  if (paybackFooter) {
    const basePayback = resultsByScenario.base.paybackMonths;
    paybackFooter.innerHTML = Number.isFinite(basePayback)
      ? `Base payback: <span class="chart-footer-highlight">${formatMonths(basePayback)}</span>`
      : `Base payback: <span class="chart-footer-highlight">Not reached</span>`;
  }
}

function renderScenarioSelector() {
  scenarioButtons.forEach((button) => {
    const isActive = button.dataset.scenario === activeScenario;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function recalculate() {
  validateMainInputs();

  const resultsByScenario = computeAllScenarios();
  renderLivePreview(resultsByScenario[activeScenario]);
  renderKpis(resultsByScenario[activeScenario]);

  if (hasUserTriggeredResults) {
    createOrUpdateCharts(resultsByScenario);
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function round(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundToNearest(value, step) {
  if (!Number.isFinite(value) || step <= 0) {
    return 0;
  }
  return Math.round(value / step) * step;
}

function normalizeName(input) {
  return input.trim().toLowerCase();
}

function setCoreInputsVisible(visible) {
  coreInputsPanel.classList.toggle("is-hidden", !visible);
}

function estimateToolingSpendFromEmployees(employeeEstimate) {
  const estimatedReps = clamp(employeeEstimate * 0.002, 3, MAX_ESTIMATED_REPS);
  const tooling = estimatedReps * 2500;
  return roundToNearest(clamp(tooling, 20000, 800000), 1000);
}

function estimateAddressableSalesVolume(employeeEstimate, revenueEstimateUsd) {
  if (Number.isFinite(revenueEstimateUsd) && revenueEstimateUsd > 0) {
    const billions = revenueEstimateUsd / 1e9;
    const fraction = billions > 1 ? 0.0002 / (1 + Math.log10(billions)) : 0.0002;
    const scaled = revenueEstimateUsd * fraction;
    return roundToNearest(clamp(scaled, 500000, 15000000), 10000);
  }

  const fallback = Math.min(employeeEstimate * 12000, 10000000);
  return roundToNearest(clamp(fallback, 500000, 10000000), 10000);
}

function findDemoMock(companyName) {
  const normalized = normalizeName(companyName);
  if (!normalized) {
    return null;
  }

  return DEFAULT_MOCKS.find((entry) => entry.aliases.some((alias) => normalized.includes(alias))) || null;
}

function deterministicFallback(companyName) {
  const normalized = normalizeName(companyName);
  if (!normalized) {
    return null;
  }

  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = ((hash << 5) - hash + normalized.charCodeAt(i)) | 0;
  }

  const seed = Math.abs(hash);
  const employeeEstimate = 120 + (seed % 7000);
  const revenuePerEmployee = 120000 + (seed % 90000);
  const revenueEstimateUsd = employeeEstimate * revenuePerEmployee;

  return {
    companyName,
    employeeEstimate,
    employeeRangeLabel: employeeRangeLabel(employeeEstimate),
    revenueEstimateUsd,
    confidence: 0.35,
    sources: [
      {
        label: "Deterministic demo fallback",
        url: "https://en.wikipedia.org/wiki/Main_Page",
        field: "employeeEstimate,revenueEstimateUsd"
      }
    ],
    usedMock: true
  };
}

async function runLookup(companyName) {
  const lookupUrl = new URL(WORKER_LOOKUP_URL);
  lookupUrl.searchParams.set("name", companyName.trim());

  const response = await fetch(lookupUrl.toString(), {
    method: "GET",
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Lookup failed with status ${response.status}`);
  }

  return response.json();
}

function applyLookupResult(data) {
  const companySizeInput = document.getElementById("companySizeEmployees");
  const toolingInput = document.getElementById("currentToolingAnnualUsd");
  const salesVolumeInput = document.getElementById("salesVolumeAnnualUsd");
  const employeeEstimate = Number.isFinite(data.employeeEstimate) && data.employeeEstimate > 0
    ? Math.round(data.employeeEstimate)
    : null;

  if (employeeEstimate) {
    companySizeInput.value = String(employeeEstimate);
  }

  if (employeeEstimate) {
    toolingInput.value = String(estimateToolingSpendFromEmployees(employeeEstimate));
    salesVolumeInput.value = String(
      estimateAddressableSalesVolume(employeeEstimate, Number.isFinite(data.revenueEstimateUsd) ? data.revenueEstimateUsd : 0)
    );
  }

  if (autoSyncTierCostsCheckbox.checked) {
    syncScenarioCostsFromTier();
  }

  primeResultsVisibility();
  hasAiLookupData = true;
  setCoreInputsVisible(true);
  lookupMeta.classList.remove("hidden");

  if (lookupCompanyNameEl) {
    lookupCompanyNameEl.textContent = data.companyName || "";
  }

  if (data.logoUrl) {
    companyLogo.onerror = function () {
      /* Fallback chain: try Google S2 favicon if primary fails */
      const domain = (data.companyName || "").toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
      const fallback = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      if (companyLogo.src !== fallback) {
        companyLogo.src = fallback;
      } else {
        companyLogoWrap.classList.add("hidden");
      }
    };
    companyLogo.src = data.logoUrl;
    companyLogo.alt = `${data.companyName || "Company"} logo`;
    companyLogoWrap.classList.remove("hidden");
  } else {
    companyLogo.removeAttribute("src");
    companyLogo.alt = "";
    companyLogoWrap.classList.add("hidden");
  }

  const confidencePct = Math.max(0, Math.min(100, Math.round((data.confidence || 0) * 100)));
  confidenceBadge.textContent = `Confidence: ${confidencePct}%${data.usedMock ? " (demo fallback)" : ""}`;

  const sources = Array.isArray(data.sources) ? data.sources : [];
  sourceList.innerHTML = "";

  if (!sources.length) {
    const noSource = document.createElement("li");
    noSource.textContent = "No source links were returned.";
    sourceList.appendChild(noSource);
    return;
  }

  sources.forEach((source) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = source.url;
    link.textContent = source.label;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const fieldLabel = source.field ? ` (${source.field})` : "";
    listItem.appendChild(link);
    listItem.appendChild(document.createTextNode(fieldLabel));
    sourceList.appendChild(listItem);
  });
}

function tickPlaceholderAnimation() {
  if (lookupMode !== "ai") {
    return;
  }

  if (document.activeElement === companyNameInput || companyNameInput.value.trim()) {
    return;
  }

  const targetSuffix = `${AI_PLACEHOLDER_COMPANIES[placeholderCompanyIndex]}...`;

  if (placeholderPhase === "typing") {
    placeholderSuffixCount += 1;
    if (placeholderSuffixCount >= targetSuffix.length) {
      placeholderSuffixCount = targetSuffix.length;
      placeholderPhase = "hold";
      placeholderHoldTicks = 0;
    }
  } else if (placeholderPhase === "hold") {
    placeholderHoldTicks += 1;
    if (placeholderHoldTicks >= 10) {
      placeholderPhase = "deleting";
    }
  } else if (placeholderPhase === "deleting") {
    placeholderSuffixCount -= 1;
    if (placeholderSuffixCount <= 0) {
      placeholderSuffixCount = 0;
      placeholderPhase = "pause";
      placeholderHoldTicks = 0;
    }
  } else {
    /* pause phase — brief empty state before typing next company */
    placeholderHoldTicks += 1;
    if (placeholderHoldTicks >= 5) {
      placeholderPhase = "typing";
      placeholderCompanyIndex = (placeholderCompanyIndex + 1) % AI_PLACEHOLDER_COMPANIES.length;
    }
  }

  const typedSuffix = targetSuffix.slice(0, placeholderSuffixCount);
  companyNameInput.placeholder = `${AI_PLACEHOLDER_PREFIX}${typedSuffix}`;
}

function startPlaceholderAnimation() {
  if (placeholderTicker) {
    return;
  }

  placeholderCompanyIndex = 0;
  placeholderSuffixCount = 0;
  placeholderPhase = "typing";
  placeholderHoldTicks = 0;
  placeholderTicker = window.setInterval(tickPlaceholderAnimation, 110);
}

function stopPlaceholderAnimation() {
  if (!placeholderTicker) {
    return;
  }

  window.clearInterval(placeholderTicker);
  placeholderTicker = null;
}

function updateLookupModeUI() {
  const aiMode = lookupMode === "ai";
  autofillButton.classList.toggle("hidden", !aiMode);
  autofillButton.disabled = !aiMode;
  companySearchRow.classList.toggle("with-action", aiMode);
  aiModeNote.classList.toggle("hidden", !aiMode);

  if (aiMode) {
    lookupStatus.textContent = "AI Powered mode is on. Run lookup to pull company size and revenue estimate.";
    if (hasAiLookupData) {
      lookupMeta.classList.remove("hidden");
      setCoreInputsVisible(true);
    } else {
      confidenceBadge.textContent = "Confidence: not run";
      sourceList.innerHTML = "<li>Run AI-powered lookup to attach source references.</li>";
      lookupMeta.classList.add("hidden");
      setCoreInputsVisible(false);
    }
    startPlaceholderAnimation();
    return;
  }

  lookupStatus.textContent = "Manual mode is on. Enter values directly.";
  setCoreInputsVisible(true);
  lookupMeta.classList.add("hidden");
  companyNameInput.placeholder = "Company name (optional in Manual mode)";
  stopPlaceholderAnimation();
}

function employeeRangeLabel(value) {
  if (value <= 200) {
    return "1-200";
  }

  if (value <= 1000) {
    return "201-1000";
  }

  if (value <= 5000) {
    return "1001-5000";
  }

  return "5000+";
}

async function onAutofillClicked() {
  if (lookupMode !== "ai") {
    lookupStatus.textContent = "Switch to AI Powered mode to run lookup.";
    return;
  }

  const companyName = (document.getElementById("companyName").value || "").trim();
  if (!companyName) {
    lookupStatus.textContent = "Enter a company name before auto-fill.";
    return;
  }

  primeResultsVisibility();
  autofillButton.disabled = true;
  lookupStatus.textContent = "Looking up company data...";

  try {
    const result = await runLookup(companyName);
    if (!result) {
      throw new Error("No lookup result available.");
    }

    applyLookupResult(result);
    lookupStatus.textContent = result.usedMock
      ? `Loaded fallback profile for ${result.companyName || companyName}.`
      : `Loaded live public data for ${result.companyName || companyName}.`;
    recalculate();
  } catch (error) {
    const fallback = findDemoMock(companyName) || deterministicFallback(companyName);
    if (fallback) {
      applyLookupResult(fallback);
      lookupStatus.textContent = "Live lookup unavailable; demo fallback data applied.";
      recalculate();
    } else {
      lookupStatus.textContent = "Lookup failed. Continue with manual inputs.";
    }
  } finally {
    autofillButton.disabled = false;
  }
}

function onScenarioButtonClick(event) {
  primeResultsVisibility();
  activeScenario = event.currentTarget.dataset.scenario;
  renderScenarioSelector();
  recalculate();
}

function onLookupModeChanged(event) {
  lookupMode = event.target.value;
  updateLookupModeUI();
}

function onInputChanged(event) {
  const { id } = event.target;
  const isLookupModeControl = event.target.name === "lookupMode";

  if (!isLookupModeControl) {
    primeResultsVisibility();
  }

  if (
    id === "companySizeEmployees" ||
    id === "tierSmbCostUsd" ||
    id === "tierMidCostUsd" ||
    id === "tierEntCostUsd"
  ) {
    syncScenarioCostsFromTier();
  }

  recalculate();
}

function initInfoTooltips() {
  const tooltip = document.createElement("div");
  tooltip.className = "info-tooltip";
  document.body.appendChild(tooltip);

  let hideTimer = null;

  function showTooltip(dot) {
    clearTimeout(hideTimer);
    const text = dot.getAttribute("data-help");
    if (!text) return;
    tooltip.textContent = text;
    tooltip.classList.add("is-visible");

    const rect = dot.getBoundingClientRect();
    const tooltipWidth = 240;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));
    const top = rect.top - 8;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.transform = "translateY(-100%)";
  }

  function hideTooltip() {
    hideTimer = setTimeout(() => {
      tooltip.classList.remove("is-visible");
    }, 80);
  }

  document.addEventListener("mouseenter", (e) => {
    if (e.target.closest(".info-dot")) showTooltip(e.target.closest(".info-dot"));
  }, true);

  document.addEventListener("mouseleave", (e) => {
    if (e.target.closest(".info-dot")) hideTooltip();
  }, true);

  document.addEventListener("focusin", (e) => {
    if (e.target.closest(".info-dot")) showTooltip(e.target.closest(".info-dot"));
  });

  document.addEventListener("focusout", (e) => {
    if (e.target.closest(".info-dot")) hideTooltip();
  });
}

/* ——— Autocomplete dropdown ——— */
let autocompleteDropdown = null;
let autocompleteDebounceTimer = null;
let autocompleteRequestId = 0; /* Prevents stale responses from overwriting newer ones */

function onAutocompleteInput() {
  if (lookupMode !== "ai") { hideAutocomplete(); return; }
  const query = companyNameInput.value.trim().toLowerCase();
  if (!query || query.length < 1) { hideAutocomplete(); return; }

  /* Instant: show local matches immediately */
  const localMatches = DEFAULT_MOCKS.filter((mock) =>
    mock.companyName.toLowerCase().includes(query) ||
    mock.aliases.some((a) => a.includes(query))
  );
  renderAutocomplete(localMatches, [], query);

  /* Debounced: fetch live results from the worker after a short delay */
  clearTimeout(autocompleteDebounceTimer);
  if (query.length >= 2) {
    autocompleteDebounceTimer = setTimeout(() => fetchLiveAutocomplete(query, localMatches), 250);
  }
}

async function fetchLiveAutocomplete(query, localMatches) {
  const requestId = ++autocompleteRequestId;
  try {
    const url = WORKER_LOOKUP_URL.replace("/company-lookup", "/company-search") + "?q=" + encodeURIComponent(query) + "&limit=6";
    const response = await fetch(url);
    if (!response.ok) return;
    const data = await response.json();
    /* Only update if this is still the latest request and the input hasn't changed */
    if (requestId !== autocompleteRequestId) return;
    const currentQuery = companyNameInput.value.trim().toLowerCase();
    if (currentQuery !== query) return;

    const liveResults = (data.results || []).filter((r) => {
      /* Remove results that already appear in local matches */
      const name = r.name.toLowerCase();
      return !localMatches.some((m) => m.companyName.toLowerCase() === name);
    });

    renderAutocomplete(localMatches, liveResults, query);
  } catch (err) {
    /* Silently fail — local results are already shown */
  }
}

function renderAutocomplete(localMatches, liveResults, query) {
  if (localMatches.length === 0 && liveResults.length === 0) { hideAutocomplete(); return; }

  hideAutocomplete();
  autocompleteDropdown = document.createElement("div");
  autocompleteDropdown.className = "autocomplete-dropdown";

  /* Local (instant) results */
  localMatches.forEach((mock) => {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    const domain = mock.logoUrl.replace("https://logo.clearbit.com/", "");
    item.innerHTML = `
      <img class="autocomplete-logo" src="${mock.logoUrl}" alt=""
           onerror="this.src='https://www.google.com/s2/favicons?domain=${domain}&sz=64'" />
      <div class="autocomplete-info">
        <span class="autocomplete-name">${mock.companyName}</span>
        <span class="autocomplete-meta">${mock.employeeEstimate.toLocaleString()} employees</span>
      </div>
    `;
    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
      companyNameInput.value = mock.companyName;
      hideAutocomplete();
      onAutofillClicked();
    });
    autocompleteDropdown.appendChild(item);
  });

  /* Live (API) results */
  if (liveResults.length > 0) {
    if (localMatches.length > 0) {
      const divider = document.createElement("div");
      divider.className = "autocomplete-divider";
      autocompleteDropdown.appendChild(divider);
    }
    liveResults.forEach((result) => {
      const item = document.createElement("div");
      item.className = "autocomplete-item autocomplete-item--live";
      item.innerHTML = `
        <img class="autocomplete-logo" src="${result.logoUrl}" alt=""
             onerror="this.src='https://www.google.com/s2/favicons?domain=${result.name.toLowerCase().replace(/[\\s]+/g,'')}.com&sz=64'" />
        <div class="autocomplete-info">
          <span class="autocomplete-name">${result.name}</span>
          <span class="autocomplete-meta">${result.description ? result.description.substring(0, 60) : "Search via Wikipedia"}</span>
        </div>
      `;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        companyNameInput.value = result.name;
        hideAutocomplete();
        onAutofillClicked();
      });
      autocompleteDropdown.appendChild(item);
    });
  }

  /* Loading indicator (shown briefly while API hasn't returned yet) */
  if (liveResults.length === 0 && query.length >= 2) {
    const loader = document.createElement("div");
    loader.className = "autocomplete-loader";
    loader.textContent = "Searching more companies…";
    autocompleteDropdown.appendChild(loader);
  }

  const parent = companySearchRow || companyNameInput.parentElement;
  parent.style.position = "relative";
  parent.appendChild(autocompleteDropdown);
}

function hideAutocomplete() {
  if (autocompleteDropdown) {
    autocompleteDropdown.remove();
    autocompleteDropdown = null;
  }
}

/* ——— Compare companies ——— */
function computeComparisonOutput(scenario, employees, revenueUsd) {
  const assumptions = readScenarioAssumptions(scenario);
  const tooling = estimateToolingSpendFromEmployees(employees);
  const salesVolume = estimateAddressableSalesVolume(employees, revenueUsd);
  const tierDefaults = getTierDefaults();
  const tierKey = getTierKey(employees);
  const persanaCost = autoSyncTierCostsCheckbox.checked ? tierDefaults[tierKey] : assumptions.persanaAnnualCostUsd;

  const estimatedReps = clamp(employees * assumptions.repCountRatio, 1, MAX_ESTIMATED_REPS);
  const repHourlyCost = assumptions.repFullyLoadedAnnualUsd / 2000;
  const annualHoursSaved = estimatedReps * assumptions.timeSavedHoursPerRepPerWeek * 52;
  const timeSavingsValueUsd = annualHoursSaved * repHourlyCost;
  const toolSavingsUsd = tooling * (assumptions.toolsReplacedPct / 100);
  const revenueLiftUsd = salesVolume * (assumptions.conversionLiftPct / 100);
  const totalBenefitUsd = timeSavingsValueUsd + toolSavingsUsd + revenueLiftUsd;
  const netBenefitUsd = totalBenefitUsd - persanaCost;
  const roiPct = persanaCost > 0 ? (netBenefitUsd / persanaCost) * 100 : 0;
  const paybackMonths = persanaCost > 0 && totalBenefitUsd > 0 ? persanaCost / (totalBenefitUsd / 12) : null;

  return { roiPct, paybackMonths, totalBenefitUsd, netBenefitUsd };
}

function openComparePicker() {
  const existing = document.getElementById("comparePickerOverlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "comparePickerOverlay";
  overlay.className = "compare-picker";
  overlay.innerHTML = `
    <div class="demo-picker-inner">
      <h2 class="demo-picker-title">Compare With</h2>
      <p class="demo-picker-sub">Select a company to compare against the current data</p>
      <div class="demo-picker-grid" id="comparePickerGrid"></div>
      <button class="demo-picker-cancel" id="comparePickerCancel">Cancel</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const grid = overlay.querySelector("#comparePickerGrid");
  DEFAULT_MOCKS.forEach((mock) => {
    const card = document.createElement("button");
    card.className = "demo-picker-card";
    card.dataset.company = mock.companyName;
    const domain = mock.logoUrl.replace("https://logo.clearbit.com/", "");
    card.innerHTML = `
      <img class="demo-picker-logo" src="${mock.logoUrl}" alt="${mock.companyName}"
           onerror="this.src='https://www.google.com/s2/favicons?domain=${domain}&sz=128'" />
      <span class="demo-picker-name">${mock.companyName}</span>
    `;
    grid.appendChild(card);
  });

  requestAnimationFrame(() => overlay.classList.add("is-active"));

  overlay.addEventListener("click", (e) => {
    const card = e.target.closest(".demo-picker-card");
    if (card) {
      overlay.classList.remove("is-active");
      setTimeout(() => overlay.remove(), 300);
      runComparison(card.dataset.company);
      return;
    }
    if (e.target.id === "comparePickerCancel" || e.target === overlay) {
      overlay.classList.remove("is-active");
      setTimeout(() => overlay.remove(), 300);
    }
  });
}

function runComparison(companyName) {
  const mock = DEFAULT_MOCKS.find((m) => m.companyName === companyName);
  if (!mock) return;

  const currentResult = computeScenarioOutput(activeScenario);
  const currentName = lookupCompanyNameEl?.textContent || "Current Company";
  const currentLogo = companyLogo?.src || "";

  const compareResult = computeComparisonOutput(activeScenario, mock.employeeEstimate, mock.revenueEstimateUsd);

  showComparisonCard(currentName, currentLogo, currentResult, mock.companyName, mock.logoUrl, compareResult);
}

function showComparisonCard(nameA, logoA, resultA, nameB, logoB, resultB) {
  const container = document.getElementById("compareResult");
  if (!container) return;

  const metrics = [
    { label: "ROI", a: formatPercent(resultA.roiPct), b: formatPercent(resultB.roiPct), aVal: resultA.roiPct, bVal: resultB.roiPct, higher: true },
    { label: "Payback", a: formatMonths(resultA.paybackMonths), b: formatMonths(resultB.paybackMonths), aVal: resultA.paybackMonths || 999, bVal: resultB.paybackMonths || 999, higher: false },
    { label: "Total Benefit", a: formatCurrency(resultA.totalBenefitUsd), b: formatCurrency(resultB.totalBenefitUsd), aVal: resultA.totalBenefitUsd, bVal: resultB.totalBenefitUsd, higher: true },
    { label: "Net Benefit", a: formatCurrency(resultA.netBenefitUsd), b: formatCurrency(resultB.netBenefitUsd), aVal: resultA.netBenefitUsd, bVal: resultB.netBenefitUsd, higher: true }
  ];

  function betterClass(m, side) {
    const aWins = m.higher ? m.aVal >= m.bVal : m.aVal <= m.bVal;
    return (side === "a" ? aWins : !aWins) ? " is-better" : "";
  }

  function logoFallback(name) {
    const domain = (name || "").toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  container.innerHTML = `
    <h3 class="compare-title">${nameA} vs ${nameB} — ${SCENARIO_LABELS[activeScenario]} Scenario</h3>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-col-head">
          ${logoA ? `<img class="compare-col-logo" src="${logoA}" alt="" onerror="this.src='${logoFallback(nameA)}'" />` : ""}
          <span class="compare-col-name">${nameA}</span>
        </div>
        ${metrics.map((m) => `<div class="compare-row"><span class="compare-row-label">${m.label}</span><span class="compare-row-value${betterClass(m, "a")}">${m.a}</span></div>`).join("")}
      </div>
      <div class="compare-col">
        <div class="compare-col-head">
          ${logoB ? `<img class="compare-col-logo" src="${logoB}" alt="" onerror="this.src='${logoFallback(nameB)}'" />` : ""}
          <span class="compare-col-name">${nameB}</span>
        </div>
        ${metrics.map((m) => `<div class="compare-row"><span class="compare-row-label">${m.label}</span><span class="compare-row-value${betterClass(m, "b")}">${m.b}</span></div>`).join("")}
      </div>
    </div>
  `;
  container.classList.remove("hidden");
  container.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ——— PDF export ——— */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function exportPdf() {
  const pdfBtn = document.getElementById("pdfBtn");
  pdfBtn.textContent = "Generating...";
  pdfBtn.disabled = true;

  try {
    if (!window.html2canvas) {
      await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
    }
    if (!window.jspdf) {
      await loadScript("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    /* Light background */
    doc.setFillColor(247, 243, 236);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    /* Header */
    doc.setTextColor(31, 42, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Persana AI", 20, 25);
    doc.setFontSize(14);
    doc.setTextColor(88, 104, 100);
    doc.text("ROI Analysis Report", 20, 34);

    /* Company + date */
    const companyName = lookupCompanyNameEl?.textContent || "Company";
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    doc.setFontSize(10);
    doc.setTextColor(123, 138, 134);
    doc.text(`${companyName} \u2014 ${date}`, 20, 42);
    doc.text(`Scenario: ${SCENARIO_LABELS[activeScenario]}`, 20, 48);

    /* Divider */
    doc.setDrawColor(214, 206, 194);
    doc.line(20, 53, pageWidth - 20, 53);

    /* KPI summary */
    const result = computeScenarioOutput(activeScenario);
    doc.setFontSize(12);
    doc.setTextColor(47, 111, 90);
    doc.text("Key Metrics", 20, 63);

    const kpis = [
      ["ROI", formatPercent(result.roiPct)],
      ["Payback Period", formatMonths(result.paybackMonths)],
      ["Total Annual Benefit", formatCurrency(result.totalBenefitUsd)],
      ["Net Annual Benefit", formatCurrency(result.netBenefitUsd)],
      ["Time Savings", formatCurrency(result.timeSavingsValueUsd)],
      ["Tool Consolidation", formatCurrency(result.toolSavingsUsd)],
      ["Revenue Lift", formatCurrency(result.revenueLiftUsd)],
      ["Persana Annual Cost", formatCurrency(result.assumptions.persanaAnnualCostUsd)]
    ];

    doc.setFontSize(10);
    let yPos = 72;
    kpis.forEach(([label, value]) => {
      doc.setTextColor(88, 104, 100);
      doc.text(label, 24, yPos);
      doc.setTextColor(31, 42, 42);
      doc.text(value, pageWidth - 24, yPos, { align: "right" });
      yPos += 7;
    });

    /* Charts screenshot */
    yPos += 5;
    doc.setDrawColor(214, 206, 194);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.setTextColor(47, 111, 90);
    doc.text("Scenario Comparison Charts", 20, yPos);
    yPos += 6;

    const chartsGrid = document.querySelector(".charts-grid");
    if (chartsGrid) {
      const canvas = await window.html2canvas(chartsGrid, { backgroundColor: "#f7f3ec", scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      doc.addImage(imgData, "PNG", 20, yPos, imgWidth, Math.min(imgHeight, 80));
    }

    /* Footer */
    doc.setFontSize(8);
    doc.setTextColor(123, 138, 134);
    doc.text("Generated by Persana AI ROI Calculator \u2014 persana.ai", pageWidth / 2, pageHeight - 12, { align: "center" });

    doc.save(`Persana_ROI_${companyName.replace(/\s+/g, "_")}_${activeScenario}.pdf`);
  } catch (err) {
    console.error("PDF export failed:", err);
  } finally {
    pdfBtn.textContent = "Download PDF Report";
    pdfBtn.disabled = false;
  }
}

function registerEventHandlers() {
  form.addEventListener("input", onInputChanged);
  form.addEventListener("change", onInputChanged);

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", onScenarioButtonClick);
  });

  autofillButton.addEventListener("click", onAutofillClicked);

  /* Enter key in company name input triggers lookup */
  companyNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      primeResultsVisibility();
      hideAutocomplete();
      if (lookupMode === "ai" && companyNameInput.value.trim()) {
        onAutofillClicked();
      } else {
        recalculate();
      }
    }
    if (e.key === "Escape") hideAutocomplete();
  });

  /* Autocomplete dropdown on input */
  companyNameInput.addEventListener("input", onAutocompleteInput);
  companyNameInput.addEventListener("focus", onAutocompleteInput);
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".autocomplete-dropdown") && e.target !== companyNameInput) {
      hideAutocomplete();
    }
  });

  lookupModeInputs.forEach((input) => {
    input.addEventListener("change", onLookupModeChanged);
  });
  autoSyncTierCostsCheckbox.addEventListener("change", () => {
    syncScenarioCostsFromTier();
    recalculate();
  });
  initInfoTooltips();

  /* Compare & PDF buttons */
  const compareBtn = document.getElementById("compareBtn");
  if (compareBtn) compareBtn.addEventListener("click", openComparePicker);
  const pdfBtn = document.getElementById("pdfBtn");
  if (pdfBtn) pdfBtn.addEventListener("click", exportPdf);
}

function init() {
  lookupMode = document.querySelector("input[name='lookupMode']:checked")?.value || "manual";
  setResultsVisibility(false);
  renderScenarioSelector();
  syncScenarioCostsFromTier();
  registerEventHandlers();
  updateLookupModeUI();
  tickPlaceholderAnimation();
  recalculate();
}

window.addEventListener("DOMContentLoaded", init);

/* Expose for demo.js */
window.applyLookupResult = applyLookupResult;
window.recalculate = recalculate;
