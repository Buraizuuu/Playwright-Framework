import { test, expect } from '../../../fixtures';
import { ProductEndpoints } from '../../../api/endpoints/ProductEndpoints';
import { hasProductFields } from '../../../api/schemas/ProductSchema';

test.describe('Products API', () => {
  test('[Products] should remove a product and return the deleted record', async ({ apiClient }) => {
    // Use a known stable id — Fake Store returns mock data for any valid id
    const response = await apiClient.delete(ProductEndpoints.delete(6));

    expect(response.status()).toBe(200);

    const body = await response.json();

    // Fake Store returns the original product record on DELETE
    expect(
      hasProductFields(body),
      `Expected full product in DELETE response. Received: ${JSON.stringify(body)}`,
    ).toBe(true);
  });
});
