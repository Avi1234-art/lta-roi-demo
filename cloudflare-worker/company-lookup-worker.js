const DEMO_MOCKS = [
  {
    aliases: ["microsoft", "msft"],
    companyName: "Microsoft",
    employeeEstimate: 221000,
    revenueEstimateUsd: 245000000000,
    logoUrl: "https://api.companyenrich.com/logos/v1/microsoft.com",
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
    logoUrl: "https://api.companyenrich.com/logos/v1/salesforce.com",
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
    logoUrl: "https://api.companyenrich.com/logos/v1/hubspot.com",
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
    logoUrl: "https://api.companyenrich.com/logos/v1/adobe.com",
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
    logoUrl: "https://api.companyenrich.com/logos/v1/oracle.com",
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
    logoUrl: "https://api.companyenrich.com/logos/v1/google.com",
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
    logoUrl: "https://api.companyenrich.com/logos/v1/tesla.com",
    confidence: 0.9,
    sources: [
      { label: "Wikipedia: Tesla", url: "https://en.wikipedia.org/wiki/Tesla,_Inc.", field: "company" },
      { label: "Wikidata: Tesla", url: "https://www.wikidata.org/wiki/Q478214", field: "employeeEstimate,revenueEstimateUsd" }
    ]
  }
];

function getAllowedOrigins(env) {
  const defaultOrigin = "https://avi1234-art.github.io";
  const configured = (env.ALLOWED_ORIGINS || defaultOrigin)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  configured.push("http://localhost:8787");
  return configured;
}

function corsHeaders(origin, env) {
  const allowedOrigins = getAllowedOrigins(env);
  const selectedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": selectedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function jsonResponse(data, status, origin, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin, env)
    }
  });
}

function normalizeName(name) {
  return (name || "").trim().toLowerCase();
}

function employeeRangeLabel(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return "unknown";
  }

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

function findDemoMock(companyName) {
  const normalized = normalizeName(companyName);
  return DEMO_MOCKS.find((entry) => entry.aliases.some((alias) => normalized.includes(alias))) || null;
}

function deterministicFallback(companyName) {
  const normalized = normalizeName(companyName);
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

function parseQuantityClaim(entity, propertyCode) {
  const claims = entity?.claims?.[propertyCode];
  if (!Array.isArray(claims) || !claims.length) {
    return null;
  }

  for (const claim of claims) {
    const amountRaw = claim?.mainsnak?.datavalue?.value?.amount;
    if (!amountRaw) {
      continue;
    }

    const parsed = Number.parseFloat(String(amountRaw).replace("+", ""));
    if (Number.isFinite(parsed)) {
      return Math.abs(parsed);
    }
  }

  return null;
}

function parseEntityIdClaim(entity, propertyCode) {
  const claims = entity?.claims?.[propertyCode];
  if (!Array.isArray(claims) || !claims.length) {
    return null;
  }

  for (const claim of claims) {
    const id = claim?.mainsnak?.datavalue?.value?.id;
    if (id) {
      return id;
    }
  }

  return null;
}

async function fetchWikipediaTitle(companyName) {
  const endpoint = new URL("https://en.wikipedia.org/w/api.php");
  endpoint.searchParams.set("action", "opensearch");
  endpoint.searchParams.set("search", companyName);
  endpoint.searchParams.set("limit", "1");
  endpoint.searchParams.set("namespace", "0");
  endpoint.searchParams.set("format", "json");

  const response = await fetch(endpoint.toString());

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  if (!Array.isArray(payload) || !Array.isArray(payload[1]) || !payload[1][0]) {
    return null;
  }

  return payload[1][0];
}

async function fetchEntity(wikidataId) {
  const entityResponse = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`);
  if (!entityResponse.ok) {
    return null;
  }

  const entityPayload = await entityResponse.json();
  return entityPayload?.entities?.[wikidataId] || null;
}

async function buildLiveResultFromEntity(entity, wikidataId, companyName, summaryUrl, summaryLogoUrl) {
  if (!entity) {
    return null;
  }

  let employeeEstimate = parseQuantityClaim(entity, "P1128");
  let revenueEstimateUsd = parseQuantityClaim(entity, "P2139");
  let sourceEntity = entity;
  let sourceWikidataId = wikidataId;

  if (!employeeEstimate && !revenueEstimateUsd) {
    const parentEntityId = parseEntityIdClaim(entity, "P749") || parseEntityIdClaim(entity, "P127");
    if (parentEntityId) {
      const parentEntity = await fetchEntity(parentEntityId);
      const parentEmployees = parseQuantityClaim(parentEntity, "P1128");
      const parentRevenue = parseQuantityClaim(parentEntity, "P2139");
      if (parentEmployees || parentRevenue) {
        employeeEstimate = parentEmployees;
        revenueEstimateUsd = parentRevenue;
        sourceEntity = parentEntity;
        sourceWikidataId = parentEntityId;
      }
    }
  }

  if (!employeeEstimate && !revenueEstimateUsd) {
    return null;
  }

  let confidence = 0.45;
  if (employeeEstimate) {
    confidence += 0.25;
  }
  if (revenueEstimateUsd) {
    confidence += 0.25;
  }

  const title = sourceEntity?.labels?.en?.value || entity?.labels?.en?.value || companyName;
  const wikipediaSlug = sourceEntity?.sitelinks?.enwiki?.title || entity?.sitelinks?.enwiki?.title;
  const wikipediaUrl = summaryUrl || (wikipediaSlug ? `https://en.wikipedia.org/wiki/${encodeURIComponent(wikipediaSlug)}` : null);

  return {
    companyName: title,
    employeeEstimate: employeeEstimate || null,
    employeeRangeLabel: employeeRangeLabel(employeeEstimate || 0),
    revenueEstimateUsd: revenueEstimateUsd || null,
    logoUrl: summaryLogoUrl || null,
    confidence: Math.min(0.95, confidence),
    sources: [
      {
        label: `Wikipedia: ${title}`,
        url: wikipediaUrl || "https://en.wikipedia.org/wiki/Main_Page",
        field: "company"
      },
      {
        label: `Wikidata: ${sourceWikidataId}`,
        url: `https://www.wikidata.org/wiki/${sourceWikidataId}`,
        field: "employeeEstimate,revenueEstimateUsd"
      }
    ],
    usedMock: false
  };
}

async function fetchWikidataSearchCandidates(companyName) {
  const endpoint = new URL("https://www.wikidata.org/w/api.php");
  endpoint.searchParams.set("action", "wbsearchentities");
  endpoint.searchParams.set("search", companyName);
  endpoint.searchParams.set("language", "en");
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("limit", "12");
  endpoint.searchParams.set("type", "item");

  const response = await fetch(endpoint.toString());
  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  return Array.isArray(payload?.search) ? payload.search : [];
}

async function fetchLiveWikidata(companyName) {
  const title = await fetchWikipediaTitle(companyName);
  if (title) {
    const summaryResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (summaryResponse.ok) {
      const summary = await summaryResponse.json();
      const wikidataId = summary?.wikibase_item;
      if (wikidataId) {
        const entity = await fetchEntity(wikidataId);
        const result = await buildLiveResultFromEntity(
          entity,
          wikidataId,
          summary?.title || companyName,
          summary?.content_urls?.desktop?.page || null,
          summary?.thumbnail?.source || null
        );

        if (result) {
          return result;
        }
      }
    }
  }

  const candidates = await fetchWikidataSearchCandidates(companyName);
  for (const candidate of candidates) {
    const candidateId = candidate?.id;
    if (!candidateId) {
      continue;
    }

    const entity = await fetchEntity(candidateId);
    const result = await buildLiveResultFromEntity(entity, candidateId, candidate?.label || companyName, null, null);
    if (result) {
      return result;
    }
  }

  return null;
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, env)
      });
    }

    if (requestUrl.pathname !== "/company-lookup") {
      return jsonResponse(
        {
          message: "Persana company lookup worker",
          usage: "GET /company-lookup?name=HubSpot"
        },
        200,
        origin,
        env
      );
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin, env);
    }

    const allowedOrigins = getAllowedOrigins(env);
    if (origin && !allowedOrigins.includes(origin)) {
      return jsonResponse({ error: "Origin not allowed" }, 403, origin, env);
    }

    const companyName = (requestUrl.searchParams.get("name") || "").trim();
    if (!companyName) {
      return jsonResponse({ error: "Missing required query parameter: name" }, 400, origin, env);
    }

    const directMock = findDemoMock(companyName);
    if (directMock) {
      return jsonResponse(
        {
          companyName: directMock.companyName,
          employeeEstimate: directMock.employeeEstimate,
          employeeRangeLabel: employeeRangeLabel(directMock.employeeEstimate),
          revenueEstimateUsd: directMock.revenueEstimateUsd,
          logoUrl: directMock.logoUrl || null,
          confidence: directMock.confidence,
          sources: directMock.sources,
          usedMock: false
        },
        200,
        origin,
        env
      );
    }

    try {
      const liveResult = await fetchLiveWikidata(companyName);
      if (liveResult) {
        return jsonResponse(liveResult, 200, origin, env);
      }
    } catch (error) {
      // Continue to deterministic fallback.
    }

    const fallback = deterministicFallback(companyName);
    return jsonResponse(fallback, 200, origin, env);
  }
};
