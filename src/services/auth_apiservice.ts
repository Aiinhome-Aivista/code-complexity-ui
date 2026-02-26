import { API_ENDPOINTS } from "../config/endpoints";
import apiservice from "../lib/apiservice";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  CaptchaResponse,
} from "../types/auth_types";

export const authService = {
  getCaptcha: async () => {
    return apiservice<CaptchaResponse>(API_ENDPOINTS.GET.GET_CAPTCHA, {
      method: "GET",
    });
  },
  login: async (data: LoginPayload) => {
    return apiservice<AuthResponse>(API_ENDPOINTS.POST.LOGIN, {
      method: "POST",
      data,
    });
  },

  register: async (data: RegisterPayload) => {
    return apiservice<AuthResponse>(API_ENDPOINTS.POST.REGISTER, {
      method: "POST",
      data,
    });
  },
};
