const SCENARIOS = ["low", "base", "high"];
const WORKER_LOOKUP_URL = "https://persana-company-lookup.avi-lta-demo.workers.dev/company-lookup";
const SCENARIO_LABELS = {
  low: "Low",
  base: "Base",
  high: "High"
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
    confidence: 0.84,
    sources: [
      { label: "Wikipedia: Oracle", url: "https://en.wikipedia.org/wiki/Oracle_Corporation", field: "company" }
    ]
  }
];

const form = document.getElementById("roi-form");
const scenarioButtons = document.querySelectorAll(".scenario-btn");
const companySearchRow = document.getElementById("companySearchRow");
const companyNameInput = document.getElementById("companyName");
const autofillButton = document.getElementById("autofillBtn");
const lookupModeInputs = document.querySelectorAll("input[name='lookupMode']");
const lookupStatus = document.getElementById("lookupStatus");
const aiModeNote = document.getElementById("aiModeNote");
const sourceList = document.getElementById("sourceList");
const confidenceBadge = document.getElementById("confidenceBadge");
const autoSyncTierCostsCheckbox = document.getElementById("autoSyncTierCosts");
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
let placeholderTicker = null;
let placeholderCompanyIndex = 0;
let placeholderLetterCount = 0;
let placeholderPhase = "typing";
let placeholderHoldTicks = 0;
let chartInstances = {
  roi: null,
  breakdown: null,
  payback: null
};

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

  const estimatedReps = Math.max(1, companySizeEmployees * assumptions.repCountRatio);
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

function renderKpis(result) {
  outputNodes.activeScenarioName.textContent = SCENARIO_LABELS[activeScenario];
  outputNodes.kpiRoiPct.textContent = formatPercent(result.roiPct);
  outputNodes.kpiPaybackMonths.textContent = formatMonths(result.paybackMonths);
  outputNodes.kpiTotalBenefit.textContent = formatCurrency(result.totalBenefitUsd);
  outputNodes.kpiNetBenefit.textContent = formatCurrency(result.netBenefitUsd);

  outputNodes.activeTimeSavings.textContent = formatCurrency(result.timeSavingsValueUsd);
  outputNodes.activeToolSavings.textContent = formatCurrency(result.toolSavingsUsd);
  outputNodes.activeRevenueLift.textContent = formatCurrency(result.revenueLiftUsd);
  outputNodes.activePersanaCost.textContent = formatCurrency(result.assumptions.persanaAnnualCostUsd);
}

function buildChartTheme() {
  return {
    axis: "#6b6b6b",
    accent: "#b8860b",
    accentSecondary: "#d4a84b",
    border: "#e8e4df",
    foreground: "#1a1a1a"
  };
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

  const commonScales = {
    x: {
      ticks: { color: theme.axis },
      grid: { color: theme.border }
    },
    y: {
      ticks: { color: theme.axis },
      grid: { color: theme.border }
    }
  };

  if (!chartInstances.roi) {
    chartInstances.roi = new Chart(document.getElementById("roiChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "ROI %",
          data: roiData,
          borderWidth: 1,
          borderColor: theme.accent,
          backgroundColor: "rgba(184, 134, 11, 0.7)",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: commonScales
      }
    });
  } else {
    chartInstances.roi.data.datasets[0].data = roiData;
    chartInstances.roi.update();
  }

  if (!chartInstances.breakdown) {
    chartInstances.breakdown = new Chart(document.getElementById("breakdownChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Time savings",
            data: breakdownData.time,
            backgroundColor: "rgba(184, 134, 11, 0.75)",
            borderRadius: 4
          },
          {
            label: "Tool savings",
            data: breakdownData.tools,
            backgroundColor: "rgba(212, 168, 75, 0.75)",
            borderRadius: 4
          },
          {
            label: "Revenue lift",
            data: breakdownData.revenue,
            backgroundColor: "rgba(56, 56, 56, 0.72)",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, ticks: { color: theme.axis }, grid: { color: theme.border } },
          y: { stacked: true, ticks: { color: theme.axis }, grid: { color: theme.border } }
        },
        plugins: {
          legend: {
            labels: {
              color: theme.foreground,
              boxWidth: 12
            }
          }
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
    chartInstances.payback = new Chart(document.getElementById("paybackChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Payback (months)",
          data: paybackData,
          borderWidth: 1,
          borderColor: theme.foreground,
          backgroundColor: "rgba(26, 26, 26, 0.72)",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: commonScales
      }
    });
  } else {
    chartInstances.payback.data.datasets[0].data = paybackData;
    chartInstances.payback.update();
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
  renderKpis(resultsByScenario[activeScenario]);
  createOrUpdateCharts(resultsByScenario);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function round(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function normalizeName(input) {
  return input.trim().toLowerCase();
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
  const salesVolumeInput = document.getElementById("salesVolumeAnnualUsd");

  if (Number.isFinite(data.employeeEstimate) && data.employeeEstimate > 0) {
    companySizeInput.value = String(Math.round(data.employeeEstimate));
  }

  if (Number.isFinite(data.revenueEstimateUsd) && data.revenueEstimateUsd > 0) {
    salesVolumeInput.value = String(Math.round(data.revenueEstimateUsd));
  }

  if (autoSyncTierCostsCheckbox.checked) {
    syncScenarioCostsFromTier();
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

  const company = AI_PLACEHOLDER_COMPANIES[placeholderCompanyIndex];

  if (placeholderPhase === "typing") {
    placeholderLetterCount += 1;
    if (placeholderLetterCount >= company.length) {
      placeholderLetterCount = company.length;
      placeholderPhase = "hold";
      placeholderHoldTicks = 0;
    }
  } else if (placeholderPhase === "hold") {
    placeholderHoldTicks += 1;
    if (placeholderHoldTicks >= 10) {
      placeholderPhase = "deleting";
    }
  } else {
    placeholderLetterCount -= 1;
    if (placeholderLetterCount <= 0) {
      placeholderLetterCount = 0;
      placeholderPhase = "typing";
      placeholderCompanyIndex = (placeholderCompanyIndex + 1) % AI_PLACEHOLDER_COMPANIES.length;
    }
  }

  const typedCompany = company.slice(0, placeholderLetterCount);
  companyNameInput.placeholder = `${AI_PLACEHOLDER_PREFIX}${typedCompany}${typedCompany ? "..." : ""}`;
}

function startPlaceholderAnimation() {
  if (placeholderTicker) {
    return;
  }

  placeholderCompanyIndex = 0;
  placeholderLetterCount = 0;
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
    confidenceBadge.textContent = "Confidence: not run";
    sourceList.innerHTML = "<li>Run AI-powered lookup to attach source references.</li>";
    startPlaceholderAnimation();
    return;
  }

  lookupStatus.textContent = "Manual mode is on. Enter values directly.";
  confidenceBadge.textContent = "Confidence: manual mode";
  sourceList.innerHTML = "<li>Manual mode selected. Data sourcing is disabled.</li>";
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

function registerEventHandlers() {
  form.addEventListener("input", onInputChanged);
  form.addEventListener("change", onInputChanged);

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", onScenarioButtonClick);
  });

  autofillButton.addEventListener("click", onAutofillClicked);
  lookupModeInputs.forEach((input) => {
    input.addEventListener("change", onLookupModeChanged);
  });
  autoSyncTierCostsCheckbox.addEventListener("change", () => {
    syncScenarioCostsFromTier();
    recalculate();
  });
}

function init() {
  lookupMode = document.querySelector("input[name='lookupMode']:checked")?.value || "manual";
  renderScenarioSelector();
  syncScenarioCostsFromTier();
  registerEventHandlers();
  updateLookupModeUI();
  tickPlaceholderAnimation();
  recalculate();
}

window.addEventListener("DOMContentLoaded", init);
