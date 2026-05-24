import { test, expect } from '../../../fixtures';
import { ProductEndpoints } from '../../../api/endpoints/ProductEndpoints';
import { productFactory } from '../../../utils/fakerHelper';

test.describe('Products API', () => {
  test('[Products] should update a product when valid data is provided', async ({ apiClient }) => {
    const updatePayload = productFactory.createProduct('electronics');

    // Use a known stable id — Fake Store returns mock data for any valid id
    const response = await apiClient.put(ProductEndpoints.update(7), updatePayload);

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.title).toBe(updatePayload.title);
    expect(body.price).toBe(updatePayload.price);
    expect(body.category).toBe(updatePayload.category);
  });
});
