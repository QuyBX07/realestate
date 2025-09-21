// services/ValuationService.ts
import axios from "axios";
import { Property } from "../types/Property";
import { parseAddress } from "../utils/address";
import { PropertyPayload } from "../types/PropertyPayload";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // 👈 anh chỉ cần set 1 lần
  headers: {
    "Content-Type": "application/json",
  },
});

export const valuationService = {
  async predict(property: Property) {
    // Tách address ra
    const parsed = parseAddress(property.address);

    // Build payload cho API
    const payload = {
      city: parsed.city || property.city || "",
      district: parsed.district || "",
      ward: parsed.ward || "",
      street: parsed.street || "",
      area: property.area,
      type: property.type,
      bedroom: property.bedroom || 0, // thêm fallback
      bathroom: property.bathroom || 0,
      frontage: property.frontage || 0,
      legal: property.legal || "chưa rõ",
    };

    console.log("📤 Payload gửi định giá:", payload);
    const res = await api.post("/predict", payload);
    return res.data; // { predicted_price: number }
  },
};

export const valuationPayloadService = {
  async predict(payload: PropertyPayload) {
    const res = await api.post("/predict", payload);
    return res.data; // { predicted_price: number }
  },
};
