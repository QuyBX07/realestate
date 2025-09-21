export interface Property {
  id: string;          // thay _id -> id
  title: string;
  address: string;
  city: string;
  seller: string;
  numberPhone: string;
  price: number;
  area: number;
  unit_Price: number;
  postedDate: string;
  link: string;
  legal: string;
  frontage: number;
  type: string;
  bedroom: number;
  bathroom: number;
  amenityLocations: string;
  source: string;
   district?: string; // <- optional nếu không chắc chắn lúc nào cũng có
  
}
