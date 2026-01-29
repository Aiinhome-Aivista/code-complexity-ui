export const BASE_URL = "http://122.163.121.176:3019/";

export const API_ENDPOINTS = {
  GET: {
    SESSION_DATATABLE: `${BASE_URL}api/projects`,
    RESULTS: `${BASE_URL}api/results/`,
  },
  POST: {
    LOGIN: `${BASE_URL}api/auth/login`,
    REGISTER: `${BASE_URL}api/auth/register`,
    UPLOAD: `${BASE_URL}api/visualization/upload`,
  },
} as const;
