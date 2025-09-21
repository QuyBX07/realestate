// utils/address.ts

export interface ParsedAddress {
  street: string;
  ward: string;
  district: string;
  city: string;
}

export function parseAddress(address: string): ParsedAddress {
  if (!address) {
    return { street: "", ward: "", district: "", city: "" };
  }

  const parts = address.split(",").map((p) => p.trim()); 
  // ví dụ: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội"
  // -> ["123 Nguyễn Trãi", "Thanh Xuân", "Hà Nội"]

  let street = "";
  let ward = "";
  let district = "";
  let city = "";

  if (parts.length === 1) {
    street = parts[0]; // chỉ có số nhà, đường
  } else if (parts.length === 2) {
    street = parts[0];
    district = parts[1];
  } else if (parts.length === 3) {
    street = parts[0];
    district = parts[1];
    city = parts[2];
  } else if (parts.length >= 4) {
    street = parts[0];
    ward = parts[1];
    district = parts[2];
    city = parts[3];
  }

  return { street, ward, district, city };
}
