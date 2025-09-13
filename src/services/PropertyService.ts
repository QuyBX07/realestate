import { Property } from "../types/Property";

const API_URL = "https://estate.quy.name.vn/api/properties";

export const propertyService = {
  async getAll(): Promise<Property[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch properties");
    return res.json();
  },
};
