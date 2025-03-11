// Auth types
export interface AuthResponse {
  auth_token: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
}

// Trip types
export interface Trip {
  id: number;
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: string;
  created_at: string;
  user: number;
}

export interface TripFormData {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: string;
}

// Log types
export interface Remark {
  id: string;
  hour_start: string;
  hour_finish: string;
  status: "OFF_DUTY" | "SLEEPER_BERTH" | "DRIVING" | "ON_DUTY";
  location: string;
  title: string;
}

export interface LogEntry {
  id: number;
  date: string;
  total_miles: string | null;
  truck_number: string;
  carrier_name: string;
  main_office_address: string;
  driver_signature: string;
  co_driver_name: string | null;
  remarks: Remark[];
  total_hours: string;
  shipping_document: string | null;
  trip: number;
}

export interface LogFormData {
  date: string;
  truck_number: string;
  carrier_name: string;
  main_office_address: string;
  driver_signature: string;
  co_driver_name?: string;
  remarks: Remark[];
  total_hours: string;
  shipping_document?: string;
  trip: number;
}
