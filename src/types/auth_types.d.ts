export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

export interface UserData {
  email: string;
  id: number;
  name: string;
  tier: string;
}

export interface AuthResponse {
  data: UserData;
  isSuccess: boolean;
  message: string;
  statuscode: number;
}
