import { PropertyType } from "../types/PropertyType";

const API_URL = "http://localhost:8081/api/properties/TypeDistribution"; // json-server port

export const propertyTypeService = {
  async getAll(): Promise<PropertyType[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch property types");
    return res.json();
  },
};
