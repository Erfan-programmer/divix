export interface Product {
  id: number;
  title: string;
  title_en: string | null;
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

export interface ProductImage {
  id: number;
  image: string;
  ordering: number;
}

export interface ProductAttribute {
  id: number;
  name: string;
  value: string | null;
  group: {
    id: number;
    name: string;
    type: string;
    ordering: number | null;
  };
}

export interface ProductPrice {
  id: number;
  price: number;
  regular_price: number;
  sale_price: number;
  discount: number | null;
  discount_price: number;
  cart_max: number;
  cart_min: number;
  attributes: ProductAttribute[];
}

export interface ProductSpecification {
  id: number;
  name: string;
  value: string;
}

export interface SpecificationGroup {
  id: number;
  name: string;
  specifications: ProductSpecification[];
}

export interface ProductDetail {
  id: number;
  title: string;
  title_en: string | null;
  category_id: number;
  slug: string;
  image: string;
  unit: string;
  type: string;
  price: number;
  regular_price: number | null;
  sale_price: number;
  special: boolean;
  description: string;
  short_description: string;
  brand_id: number;
  images: ProductImage[];
  category: string;
  specificationGroups: SpecificationGroup[];
  link: string;
  is_available: boolean;
  prices: ProductPrice[];
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  result: ProductDetail;
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