/**
 * Product test data factory.
 *
 * Generates random payloads that match the Fake Store API product shape.
 * Import `productFactory` in any test that needs a product payload.
 *
 * Usage:
 *   const product = productFactory.createProduct();
 *   const electronics = productFactory.createProduct('electronics');
 */

import { faker } from '@faker-js/faker';
import type { CreateProductRequest } from '../api/models/Product';

const CATEGORIES = ['electronics', 'jewelery', "men's clothing", "women's clothing"] as const;

export const productFactory = {
  /**
   * Generates a valid product payload for POST and PUT requests.
   * @param category — defaults to a random category from the Fake Store list.
   */
  createProduct: (
    category: (typeof CATEGORIES)[number] = faker.helpers.arrayElement(CATEGORIES),
  ): CreateProductRequest => ({
    title:       faker.commerce.productName(),
    price:       parseFloat(faker.commerce.price({ min: 5, max: 500 })),
    description: faker.commerce.productDescription(),
    category,
    image:       faker.image.url(),
  }),
};
