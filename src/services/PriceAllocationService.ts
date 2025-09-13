import { PriceAllocation } from './../types/PriceAllocation';


const API_URL = "http://localhost:8081/api/properties/priceallocation";

export const PriceAllocationService = {
  async getAll(): Promise<PriceAllocation[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch price trend data");
    return res.json();
  },
}
