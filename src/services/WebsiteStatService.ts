import { WebsiteStat } from "../types/WebsiteStat";

const API_URL = "http://localhost:3001/websites";

export const websiteStatService = {
  async getAll(): Promise<WebsiteStat[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch website stats");
    return res.json();
  },
};
