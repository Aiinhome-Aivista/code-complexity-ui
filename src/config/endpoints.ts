export const BASE_URL = "http://122.163.121.176:3019/";
/* export const BASE_URL = "http://10.185.166.147:3019/"; */

export const API_ENDPOINTS = {
  GET: {
    GET_CAPTCHA: `${BASE_URL}api/auth/get-captcha`,
    SESSION_DATATABLE: `${BASE_URL}api/projects`,
    RESULTS: `${BASE_URL}api/results/`,
    DOWNLOAD_PROJECT: `${BASE_URL}api/download_updated_code`,
    FETCH_GIT_CONFIG: `${BASE_URL}api/fetch_git_config`,
    GET_ALL_PLANS: `${BASE_URL}api/plans`,
    GET_PLANS_BY_USER: `${BASE_URL}/api/plans/user`,
  },
  POST: {
    LOGIN: `${BASE_URL}api/auth/login`,
    REGISTER: `${BASE_URL}api/auth/register`,
    UPLOAD: `${BASE_URL}api/visualization/upload`,
    UPLOAD_GIT: `${BASE_URL}/api/visualization/upload_git`,
    GIT_SELECT_BRANCH: `${BASE_URL}/api/visualization/select_branch`,
    HEATMAP: `${BASE_URL}api/code_heatmap`,
    FILENODE: `${BASE_URL}api/analyze_project_ai`,
    DELETE: `${BASE_URL}api/projects/delete`,
    FLOW: `${BASE_URL}api/relationships_flow`,
    APPLY_FIX: `${BASE_URL}api/apply-ai-fix`,
    GIT_PULL: `${BASE_URL}api/pull`,
    GIT_PUSH: `${BASE_URL}api/push`,
    TERMINAL: `${BASE_URL}api/terminal`,
  },
  PUT: {
    UPDATE_GIT_CONFIG: `${BASE_URL}api/update_git_config`,
  },
} as const;
