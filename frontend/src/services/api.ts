import axios from "axios";
import {
  AuthResponse,
  RegisterData,
  Trip,
  TripFormData,
  LogEntry,
  LogFormData,
} from "@/types";

const API_URL = "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/token/login/", {
      username,
      password,
    });
    localStorage.setItem("auth_token", response.data.auth_token);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/token/logout/");
    localStorage.removeItem("auth_token");
  },
  register: async (userData: RegisterData): Promise<unknown> => {
    const response = await api.post("/auth/users/", userData);
    return response.data;
  },
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("auth_token");
  },
};

// Trip services
export const tripService = {
  getAllTrips: async (): Promise<Trip[]> => {
    const response = await api.get<Trip[]>("/trips");
    return response.data;
  },
  getTrip: async (id: number): Promise<Trip> => {
    const response = await api.get<Trip>(`/trips/${id}`);
    return response.data;
  },
  createTrip: async (tripData: TripFormData): Promise<Trip> => {
    const response = await api.post<Trip>("/trips", tripData);
    return response.data;
  },
  updateTrip: async (
    id: number,
    tripData: Partial<TripFormData>
  ): Promise<Trip> => {
    const response = await api.put<Trip>(`/trips/${id}`, tripData);
    return response.data;
  },
  deleteTrip: async (id: number): Promise<void> => {
    await api.delete(`/trips/${id}`);
  },
};

// Log services
export const logService = {
  getAllLogs: async (): Promise<LogEntry[]> => {
    const response = await api.get<LogEntry[]>("/logs");
    return response.data;
  },
  getLog: async (id: number): Promise<LogEntry> => {
    const response = await api.get<LogEntry>(`/logs/${id}`);
    return response.data;
  },
  createLog: async (logData: LogFormData): Promise<LogEntry> => {
    const response = await api.post<LogEntry>("/logs", logData);
    return response.data;
  },
  updateLog: async (
    id: number,
    logData: Partial<LogFormData>
  ): Promise<LogEntry> => {
    const response = await api.put<LogEntry>(`/logs/${id}`, logData);
    return response.data;
  },
  updateLogPartial: async (
    id: number,
    logData: Partial<LogFormData>
  ): Promise<LogEntry> => {
    const response = await api.patch<LogEntry>(`/logs/${id}`, logData);
    return response.data;
  },
  deleteLog: async (id: number): Promise<void> => {
    await api.delete(`/logs/${id}`);
  },
};
