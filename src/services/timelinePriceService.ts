import { TimelinePrice } from "../types/TimelinePrice";

const API_URL = "https://estate.quy.name.vn/api/timeline/price";

const timelinePriceService = {
  async getLast7Days(): Promise<TimelinePrice[]> {
    const res = await fetch(`${API_URL}/last7days`);
    if (!res.ok) throw new Error("Failed to fetch avg price last 7 days");
    return res.json();
  },

  async getByWeeks(year: number, month: number): Promise<TimelinePrice[]> {
    const res = await fetch(`${API_URL}/weeks?year=${year}&month=${month}`);
    if (!res.ok) throw new Error("Failed to fetch avg price by weeks");
    return res.json();
  },

  async getByYear(year: number): Promise<TimelinePrice[]> {
    const res = await fetch(`${API_URL}/year?year=${year}`);
    if (!res.ok) throw new Error("Failed to fetch avg price by year");
    return res.json();
  },
};

export default timelinePriceService;
