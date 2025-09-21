import { Property } from "../types/Property";
import { PropertyOptions } from "../types/PropertyOptions";

const API_URL = "http://localhost:8081/api/properties";

export const propertyService = {
  async getAll(): Promise<Property[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch properties");
    return res.json();
  },

  async getOptions(): Promise<PropertyOptions> {
    const res = await fetch(`${API_URL}/options`);
    if (!res.ok) throw new Error("Failed to fetch property options");
    return res.json();
  },
};
