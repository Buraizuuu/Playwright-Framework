import { test, expect } from '../../../fixtures';
import { ProductEndpoints } from '../../../api/endpoints/ProductEndpoints';
import { productFactory } from '../../../utils/fakerHelper';
import type { CreateProductResponse } from '../../../api/models/Product';

test.describe('Products API', () => {
  test('[Products] should create a new product with valid data', async ({ apiClient }) => {
    const payload = productFactory.createProduct();
    const response = await apiClient.post(ProductEndpoints.create(), payload);

    // Fake Store API returns 201 Created (not 200) for new resources
    expect(response.status()).toBe(201);

    const body = await response.json() as CreateProductResponse;

    // Server echoes payload fields and assigns a mock id
    expect(typeof body.id).toBe('number');
    expect(body.title).toBe(payload.title);
    expect(body.price).toBe(payload.price);
    expect(body.category).toBe(payload.category);
  });
});
