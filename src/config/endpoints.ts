/* export const BASE_URL = "http://122.163.121.176:3034/"; */
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
    UPLOAD_GIT: `${BASE_URL}/api/visualization/upload_git`,
    HEATMAP: `${BASE_URL}api/code_heatmap`,
    FILENODE: `${BASE_URL}api/analyze_project_ai`,
    DELETE: `${BASE_URL}api/projects/delete`,
    FLOW: `${BASE_URL}api/relationships_flow`,
    APPLY_FIX: `${BASE_URL}/api/apply-ai-fix`,
  },
} as const;
