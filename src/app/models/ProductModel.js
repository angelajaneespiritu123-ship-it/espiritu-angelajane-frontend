export const productFields = {
  product_name: "",
  description: "",
  price: 0,
  quantity: 0,
};

export const normalizeProduct = (product = {}) => ({
  id: product.id ?? null,
  product_name: product.product_name || "",
  description: product.description || "",
  price: Number(product.price || 0),
  quantity: Number(product.quantity || 0),
  created_at: product.created_at || null,
});

export default {
  productFields,
  normalizeProduct,
};
