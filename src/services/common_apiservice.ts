import apiservice from "@/lib/apiservice";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { UploadResponse, SessionDataTableResponse, ResultsResponse } from "@/types/common_api_types";

export const commonService = {
  uploadFiles: async (formData: FormData): Promise<UploadResponse | null> => {
    return apiservice<UploadResponse>(API_ENDPOINTS.POST.UPLOAD, {
      method: "POST",
      data: formData,
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
};
