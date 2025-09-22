import { WebsiteStat } from "../types/WebsiteStat";

const API_URL = import.meta.env.VITE_API_URL || "https://estate.quy.name.vn/api";

export const websiteStatService = {
  async getAll(): Promise<WebsiteStat[]> {
    try {
      const res = await fetch(`${API_URL}/properties/topwebsite`);
      if (!res.ok) {
        throw new Error(`Failed to fetch website stats: ${res.status}`);
      }
      const data: WebsiteStat[] = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching website stats:", error);
      throw error;
    }
  },
};
