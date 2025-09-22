import { PriceAllocation } from './../types/PriceAllocation';


const API_URL = "https://estate.quy.name.vn/api/properties/priceallocation";

export const PriceAllocationService = {
  async getAll(): Promise<PriceAllocation[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch price trend data");
    return res.json();
  },
}
