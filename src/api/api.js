export const APP_NAME = "KANTO SARI-SARI STORE";
export const APP_SUBTITLE = "Daily Stock Management";

const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const apiBaseUrl = import.meta.env.DEV ? configuredApiUrl.replace(/\/+$/, "") : "";

export const API_CONFIG = {
  baseUrl: apiBaseUrl,
  endpoints: {
    login: "/api/login",
    register: "/api/register",
    products: "/api/products",
  },
};

export const API_URL = API_CONFIG.baseUrl;
export const FALLBACK_API_URLS = [API_URL];

export const buildApiUrl = (baseUrl, endpoint) => {
  if (!endpoint) {
    return baseUrl || "";
  }

  if (endpoint.startsWith("http")) {
    return endpoint;
  }

  const cleanBase = baseUrl ? baseUrl.replace(/\/$/, "") : "";
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${cleanBase}${cleanEndpoint}`;
};

export const parseApiResult = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!rawText) {
    return {
      message: "Request failed. Please try again.",
    };
  }

  if (contentType.includes("application/json") || rawText.trim().startsWith("{")) {
    try {
      const data = JSON.parse(rawText);
      return {
        ...data,
        message: data.message || data.error,
      };
    } catch {
      return { message: rawText.trim() };
    }
  }

  const errorDocument = new DOMParser().parseFromString(rawText, "text/html");
  errorDocument.querySelectorAll("style, script").forEach((element) => element.remove());
  const cleanText = (errorDocument.body.textContent || "")
    .replace(/\s+/g, " ")
    .trim();

  return { message: cleanText || "Request failed. Please try again." };
};

export const requestWithFallback = async (endpoints, payload, method = "POST") => {
  let lastError = null;

  for (const baseUrl of FALLBACK_API_URLS) {
    for (const endpoint of endpoints) {
      const url = buildApiUrl(baseUrl, endpoint);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: method === "GET" ? undefined : JSON.stringify(payload || {}),
        });

        const data = await parseApiResult(response);

        if (response.ok) {
          return { ok: true, data };
        }

        lastError = data;
      } catch {
        lastError = { message: "Unable to connect to the API." };
      }
    }
  }

  return { ok: false, data: lastError || { message: "Request failed. Please try again." } };
};
