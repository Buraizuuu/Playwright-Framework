const BASE = '/products';

export const ProductEndpoints = {
  getAll:    ()         => BASE,
  getSingle: (id: number) => `${BASE}/${id}`,
  create:    ()         => BASE,
  update:    (id: number) => `${BASE}/${id}`,
  delete:    (id: number) => `${BASE}/${id}`,
} as const;
