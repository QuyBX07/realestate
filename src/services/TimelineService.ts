import { Timeline } from "../types/Timeline";

const API_URL = "http://localhost:8081/api/timeline";

export const timelineService = {
  async getByYear(year: number): Promise<Timeline[]> {
    const res = await fetch(`${API_URL}/year?year=${year}`);
    if (!res.ok) throw new Error("Failed to fetch year stats");
    return res.json();
  },

  async getByWeeks(year: number, month: number): Promise<Timeline[]> {
    const res = await fetch(`${API_URL}/weeks?year=${year}&month=${month}`);
    if (!res.ok) throw new Error("Failed to fetch week stats");
    return res.json();
  },

  async getLast7Days(): Promise<Timeline[]> {
    const res = await fetch(`http://localhost:8081/api/timeline/last7days`);
    if (!res.ok) throw new Error("Failed to fetch last 7 days stats");
    return res.json();
  },
};
