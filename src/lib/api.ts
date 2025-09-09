import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  language: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface EhrMapping {
  id?: string;
  ehrSystem: string;
  fieldType: string;
  ehrField: string;
  dataType: string;
  isActive: boolean;
  description?: string;
  language: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMappingRequest {
  ehrSystem: string;
  fieldType: string;
  ehrField: string;
  dataType: string;
  isActive: boolean;
  description?: string;
  language: string;
}

export interface UpdateMappingRequest {
  ehrSystem?: string;
  fieldType?: string;
  ehrField?: string;
  dataType?: string;
  isActive?: boolean;
  description?: string;
  language?: string;
}

export interface BulkUpdateMappingRequest {
  mappings: EhrMapping[];
  userId: string;
}

export interface PatientData {
  [key: string]: unknown;
}

export interface MapPatientDataRequest {
  patientData: PatientData;
  ehrSystem: string;
  language?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

// API Client Class
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = "/login";
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  private clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: "An unexpected error occurred",
      status: error.response?.status,
      details: error.response?.data,
    };

    if (error.response?.data && typeof error.response.data === "object") {
      const data = error.response.data as Record<string, unknown>;
      if (typeof data.message === "string") {
        apiError.message = data.message;
      } else if (typeof data.error === "string") {
        apiError.message = data.error;
      }
    } else if (error.message) {
      apiError.message = error.message;
    }

    return apiError;
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.client.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      this.setToken(response.data.access_token);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.client.post<AuthResponse>(
        "/auth/register",
        userData
      );
      this.setToken(response.data.access_token);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.client.get<User>("/auth/profile");
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // EHR Mapping methods
  async getAllMappings(
    ehrSystem?: string,
    language: string = "en"
  ): Promise<EhrMapping[]> {
    try {
      const params = new URLSearchParams();
      if (ehrSystem) params.append("ehrSystem", ehrSystem);
      params.append("language", language);

      const response = await this.client.get<EhrMapping[]>(
        `/ehr-mappings?${params.toString()}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getEhrSystems(): Promise<string[]> {
    try {
      const response = await this.client.get<string[]>("/ehr-mappings/systems");
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getMappingsBySystem(
    ehrSystem: string,
    language: string = "en"
  ): Promise<EhrMapping[]> {
    try {
      const response = await this.client.get<EhrMapping[]>(
        `/ehr-mappings/${ehrSystem}?language=${language}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createMapping(mapping: CreateMappingRequest): Promise<EhrMapping> {
    try {
      const response = await this.client.post<EhrMapping>(
        "/ehr-mappings",
        mapping
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateMapping(
    id: string,
    mapping: UpdateMappingRequest
  ): Promise<EhrMapping> {
    try {
      const response = await this.client.put<EhrMapping>(
        `/ehr-mappings/${id}`,
        mapping
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async bulkUpdateMappings(
    ehrSystem: string,
    bulkUpdate: BulkUpdateMappingRequest
  ): Promise<EhrMapping[]> {
    try {
      const response = await this.client.post<EhrMapping[]>(
        `/ehr-mappings/bulk-update/${ehrSystem}`,
        bulkUpdate
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async mapPatientData(
    request: MapPatientDataRequest
  ): Promise<Record<string, unknown>> {
    try {
      const response = await this.client.post<Record<string, unknown>>(
        "/ehr-mappings/map-patient-data",
        request
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export types and client
export default apiClient;
