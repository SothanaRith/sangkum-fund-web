import axios, { AxiosInstance, AxiosError } from "axios";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          window.location.href = "/auth/signin";
        }
        return Promise.reject(error);
      }
    );
  }

  // User endpoints
  async getUsers() {
    const { data } = await this.client.get("/users");
    return data;
  }

  async getUser(id: string) {
    const { data } = await this.client.get(`/users/${id}`);
    return data;
  }

  async createUser(userData: {
    name: string;
    email: string;
    password?: string;
  }) {
    const { data } = await this.client.post("/users", userData);
    return data;
  }

  async updateUser(
    id: string,
    userData: { name?: string; email?: string; password?: string }
  ) {
    const { data } = await this.client.patch(`/users/${id}`, userData);
    return data;
  }

  async deleteUser(id: string) {
    const { data } = await this.client.delete(`/users/${id}`);
    return data;
  }

  // Auth endpoints
  async getCurrentUser() {
    const { data } = await this.client.get("/auth/me");
    return data;
  }

  async updateProfile(profileData: { name?: string; email?: string }) {
    const { data } = await this.client.patch("/auth/profile", profileData);
    return data;
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    const { data } = await this.client.post("/auth/change-password", passwordData);
    return data;
  }
}

export const apiClient = new ApiClient();
