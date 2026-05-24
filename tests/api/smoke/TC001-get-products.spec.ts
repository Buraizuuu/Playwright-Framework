import { test, expect } from '../../../fixtures';
import { ProductEndpoints } from '../../../api/endpoints/ProductEndpoints';
import { hasProductFields } from '../../../api/schemas/ProductSchema';

test.describe('Products API', () => {
  test('[Products] should return a list of all available products', async ({ apiClient }) => {
    const response = await apiClient.get(ProductEndpoints.getAll());

    expect(response.status()).toBe(200);

    const body = await response.json() as unknown[];

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    // Every item must have all required product fields
    body.forEach((item, index) => {
      expect(
        hasProductFields(item),
        `Item at index ${index} is missing required product fields: ${JSON.stringify(item)}`,
      ).toBe(true);
    });
  });
});
