import { API_CONFIG } from "../config/api";

export const authRoutes = {
  login: API_CONFIG.endpoints.login,
  register: API_CONFIG.endpoints.register,
};

export const productRoutes = {
  index: API_CONFIG.endpoints.products,
  show: (id) => `${API_CONFIG.endpoints.products}/${id}`,
};

export default {
  auth: authRoutes,
  products: productRoutes,
};
