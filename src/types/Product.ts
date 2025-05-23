export interface Product {
  id: number;
  title: string;
  title_en: string;
  type: string;
  price: number;
  regular_price: number;
  sale_price: number;
  slug: string;
  image: string | null;
  special: boolean;
  category: string;
  published_date: string;
  is_available: boolean;
}