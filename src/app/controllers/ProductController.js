import { API_URL, buildApiUrl, parseApiResult } from "../../config/api";
import { API_CONFIG } from "../../config/api";

export const ProductController = {
  async index(token) {
    const response = await fetch(buildApiUrl(API_URL, API_CONFIG.endpoints.products), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return { response, data: await parseApiResult(response) };
  },

  async store(token, payload) {
    const response = await fetch(buildApiUrl(API_URL, API_CONFIG.endpoints.products), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    return { response, data: await parseApiResult(response) };
  },

  async update(token, id, payload) {
    const response = await fetch(buildApiUrl(API_URL, `${API_CONFIG.endpoints.products}/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    return { response, data: await parseApiResult(response) };
  },

  async destroy(token, id) {
    const response = await fetch(buildApiUrl(API_URL, `${API_CONFIG.endpoints.products}/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    return { response, data: await parseApiResult(response) };
  },
};

export default ProductController;
