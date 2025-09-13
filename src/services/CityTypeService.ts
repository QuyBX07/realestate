    import { CityType } from "../types/CityType";

    const API_URL = "http://localhost:8081/api/properties/statistics/cities";

    export const CityTypeService = {
    async getAll(): Promise<CityType[]> {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch price trend data");
        return res.json();
    },
    }
