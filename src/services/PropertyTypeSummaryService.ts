import { PropertyTypeSummary } from "../types/PropertyTypeSummary";
import { PropertyTypeTrend } from "../types/PropertyTypeTrend";

const API_BASE = "https://estate.quy.name.vn/api/properties";

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }
  return res.json();
}

export const propertyTypeSummaryService = {
  getSummaryByType(): Promise<PropertyTypeSummary[]> {
    return fetchApi<PropertyTypeSummary[]>(`${API_BASE}/summary`);
  },
};

export const propertyTypeTrendService = {
  getTrendLast7Days(): Promise<PropertyTypeTrend[]> {
    return fetchApi<PropertyTypeTrend[]>(`http://localhost:8081/api/properties/type-trend`);
  },
};
