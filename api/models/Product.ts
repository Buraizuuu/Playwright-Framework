export interface Product {
  id:          number;
  title:       string;
  price:       number;
  description: string;
  category:    string;
  image:       string;
  rating?:     { rate: number; count: number };
}

/** Body sent on POST /products and PUT /products/:id */
export interface CreateProductRequest {
  title:       string;
  price:       number;
  description: string;
  category:    string;
  image:       string;
}

/**
 * POST /products response — echoes the payload with a mock id.
 * The server does NOT return a rating field on create.
 */
export interface CreateProductResponse extends CreateProductRequest {
  id: number;
}
