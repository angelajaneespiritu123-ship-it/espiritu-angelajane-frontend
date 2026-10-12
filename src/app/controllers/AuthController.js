import { API_CONFIG, requestWithFallback } from "../../config/api";

export const AuthController = {
  login(payload) {
    return requestWithFallback([API_CONFIG.endpoints.login], payload, "POST");
  },

  register(payload) {
    return requestWithFallback([API_CONFIG.endpoints.register], payload, "POST");
  },
};

export default AuthController;
