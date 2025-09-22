import { PriceTrend } from "../types/PriceTrend";

const API_URL = "https://estate.quy.name.vn/api/properties/Month";

export const priceTrendService = {
  async getAll(): Promise<PriceTrend[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch price trend data");
    return res.json();
  },
}
