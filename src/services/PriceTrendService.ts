import { PriceTrend } from "../types/PriceTrend";

const API_URL = "http://localhost:3001/priceTrend";

export const priceTrendService = {
  async getAll(): Promise<PriceTrend[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch price trend data");
    return res.json();
  },
}
