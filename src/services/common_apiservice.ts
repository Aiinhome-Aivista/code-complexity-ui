import apiservice from "@/lib/apiservice";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { UploadResponse, SessionDataTableResponse, ResultsResponse } from "@/types/common_api_types";

export const commonService = {
  uploadFiles: async (formData: FormData, signal?: AbortSignal): Promise<UploadResponse | null> => {
    return apiservice<UploadResponse>(API_ENDPOINTS.POST.UPLOAD, {
      method: "POST",
      data: formData,
      signal,
    });
  },
  getSessionDataTable: async (userId: string, search?: string, status?: string): Promise<SessionDataTableResponse | null> => {
    const params: Record<string, string> = { user_id: userId };
    if (search) params.search = search;
    if (status && status !== "all") params.status = status;

    return apiservice<SessionDataTableResponse>(API_ENDPOINTS.GET.SESSION_DATATABLE, {
      method: "GET",
      params,
    });
  },
  getResults: async (id: number | string): Promise<ResultsResponse | null> => {
    return apiservice<ResultsResponse>(`${API_ENDPOINTS.GET.RESULTS}${id}`, {
      method: "GET",
    });
  },
  getHeatmapData: async (payload: any): Promise<any | null> => {
    return apiservice<any>(API_ENDPOINTS.POST.HEATMAP, {
      method: "POST",
      data: payload,
    });
  },
  getFileNodeData: async (payload: any): Promise<any | null> => {
    return apiservice<any>(API_ENDPOINTS.POST.FILENODE, {
      method: "POST",
      data: payload,
    });
  },
  deleteProject: async (id: number | string): Promise<any | null> => {
    return apiservice<any>(`${API_ENDPOINTS.POST.DELETE}/${id}`, {
      method: "DELETE",
    });
  },
  getFlowData: async (payload: any): Promise<any | null> => {
    return apiservice<any>(API_ENDPOINTS.POST.FLOW, {
      method: "POST",
      data: payload,
    });
  },
  applyFix: async (payload: any): Promise<any | null> => {
    return apiservice<any>(API_ENDPOINTS.POST.APPLY_FIX, {
      method: "POST",
      data: payload,
    });
  },
  uploadGit: async (payload: { user_id: number | string; project_name: string; repo_url: string }): Promise<any | null> => {
    return apiservice<any>(API_ENDPOINTS.POST.UPLOAD_GIT, {
      method: "POST",
      data: payload,
    });
  },
  gitSelectBranch: async (payload: { user_id: number | string; session_id: string; project_id: number | string; branch: string }): Promise<any | null> => {
    return apiservice<any>(API_ENDPOINTS.POST.GIT_SELECT_BRANCH, {
      method: "POST",
      data: payload,
    });
  },
  gitPull: async (payload: { user_id: number | string, session_id: string, branch: string }): Promise<any | null> => {
    return apiservice<any>(API_ENDPOINTS.POST.GIT_PULL, {
      method: "POST",
      data: payload,
    });
  },
  gitPush: async (payload: { user_id: number | string; session_id: string; message: string; branch: string }): Promise<any | null> => {
    return apiservice<any>(API_ENDPOINTS.POST.GIT_PUSH, {
      method: "POST",
      data: payload,
    });
  },
  fetchGitConfig: async (userId: number | string): Promise<any | null> => {
    return apiservice<any>(`${API_ENDPOINTS.GET.FETCH_GIT_CONFIG}/${userId}`, {
      method: "GET",
    });
  },
  updateGitConfig: async (
    userId: number | string,
    payload: {
      git_username: string;
      git_email: string;
      git_token: string;
    },
  ): Promise<any | null> => {
    return apiservice<any>(`${API_ENDPOINTS.PUT.UPDATE_GIT_CONFIG}/${userId}`, {
      method: "PUT",
      data: payload,
    });
  },
  getAllPlans: async (): Promise<any | null> => {
    return apiservice<any>(API_ENDPOINTS.GET.GET_ALL_PLANS, {
      method: "GET",
    });
  },
  getPlansByUser: async (userId: number | string): Promise<any | null> => {
    return apiservice<any>(`${API_ENDPOINTS.GET.GET_PLANS_BY_USER}/${userId}`, {
      method: "GET",
    });
  },
  downloadProject: async (userId: number | string, sessionId: string): Promise<Blob | null> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.GET.DOWNLOAD_PROJECT}?user_id=${userId}&session_id=${sessionId}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Download failed');
      }
      return await response.blob();
    } catch (error) {
      console.error("Download project error:", error);
      return null;
    }
  },
  executeCommand: async (payload: { user_id: number | string; session_id: string; command: string }): Promise<any | null> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(API_ENDPOINTS.POST.TERMINAL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  },
};
