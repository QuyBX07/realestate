import { Seller } from "../types/Seller";

const API_URL = "http://localhost:3001/sellers";

export const sellerService = {
  async getAll(): Promise<Seller[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch sellers");
    return res.json();
  },
};
