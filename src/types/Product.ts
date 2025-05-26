export interface Product {
  id: number;
  title: string;
  title_en: string;
  type: string;
  price: number;
  regular_price: number | null;
  sale_price: number;
  slug: string;
  image: string | null;
  special: boolean;
  category: string | null;
  published_date: string;
  is_available: boolean;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface SearchResponse {
  success: boolean;
  message: string;
  result: {
    data: Product[];
    links: PaginationLinks;
    meta: PaginationMeta;
  };
}