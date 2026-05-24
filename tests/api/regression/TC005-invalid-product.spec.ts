import { test, expect } from '../../../fixtures';
import { ProductEndpoints } from '../../../api/endpoints/ProductEndpoints';

test.describe('Products API', () => {
  test('[Products] should return an empty response when the product does not exist', async ({ apiClient }) => {
    // Fake Store API does not return 404 for unknown ids — it returns 200
    // with an empty body (no JSON, no error message). This test documents
    // that known API behaviour so a future behaviour change is caught early.
    const response = await apiClient.get(ProductEndpoints.getSingle(0));

    expect(response.status()).toBe(200);

    const text = await response.text();

    expect(
      text.trim(),
      `Expected empty body for non-existent product. Received: ${text}`,
    ).toBe('');
  });
});
