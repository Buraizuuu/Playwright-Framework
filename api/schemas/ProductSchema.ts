import type { Product } from '../models/Product';

/**
 * Runtime type guard — confirms a value has the required Product fields.
 * Used in tests to validate GET /products and GET /products/:id responses.
 */
export function hasProductFields(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p['id']          === 'number' &&
    typeof p['title']       === 'string' &&
    typeof p['price']       === 'number' &&
    typeof p['description'] === 'string' &&
    typeof p['category']    === 'string' &&
    typeof p['image']       === 'string'
  );
}
