// Types for common API payloads and responses

// Payload for file upload (sent as FormData)
export interface UploadPayload {
  files: File | File[];
  user_id: string;
}

export interface FileInfo {
  filename: string;
  folder: string;
  id: string;
  lines_of_code: number;
  risk_score: number;
}

export interface UploadResponseData {
  files: FileInfo[];
  graph_url: string;
  insights: string[];
  project_id: number;
  relationships: unknown[];
  session_id: string;
}

export interface UploadResponse {
  data: UploadResponseData;
  isSuccess: boolean;
  message: string;
  statuscode: number;
}
export interface SessionDataTableItem {
  api_analysis_status: string;
  code_health_status: string;
  created_at: string;
  files_analyzed: string;
  heatmap_status: string;
  id: number;
  name: string;
  relationship_status: string;
  visualization_status: string;
}

export interface SessionDataTableResponse {
  data: SessionDataTableItem[];
  isSuccess: boolean;
  message: string;
  statuscode: number;
}

export interface ResultsResponse {
  data: any;
  isSuccess: boolean;
  message: string;
  statuscode: number;
}
