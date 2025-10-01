import { Property } from "../types/Property";

const API_URL = "https://estate.quy.name.vn/api/properties";
//https://estate.quy.name.vn/api/properties
export const propertyFilterService = {
  async filter(params: {
    types?: string[];
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    sort?: string;
  } = {}): Promise<Property[]> {
    const query = new URLSearchParams();

    if (params.types) params.types.forEach((t) => query.append("types", t));
    if (params.city) query.append("city", params.city);
    if (params.minPrice) query.append("minPrice", params.minPrice.toString());
    if (params.maxPrice) query.append("maxPrice", params.maxPrice.toString());
    if (params.minArea) query.append("minArea", params.minArea.toString());
    if (params.maxArea) query.append("maxArea", params.maxArea.toString());
    if (params.sort) query.append("sort", params.sort);

    const res = await fetch(`${API_URL}/filter?${query.toString()}`);
    if (!res.ok) {
      throw new Error("Failed to fetch properties");
    }
    return res.json();
  },
};
