// ─── Shared Types ─────────────────────────────────────────────────────────────

export type Role = "admin" | "user";

export type TaskStatus = "pending" | "collected" | "verified" | "rejected";
export type ReportStatus = "pending" | "resolved";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  points: number;
  avatarUrl?: string;
  createdAt: string;
  
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  location: string;
  points: number;
  status: TaskStatus;
  assignedTo?: string; // user id
  photoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Report {
  id: number;
  userId: string;
  userName?: string;
  title: string;
  description: string;
  location: string;
  status: ReportStatus;
  photoUrl?: string;
  createdAt: string;
  resolvedAt?: string;
}




export interface AdminStats {
  totalUsers: number;
  totalTasksPending: number;
  totalTasksCollected: number;
  totalTasksVerified: number;
  totalReportsPending: number;
  totalReportsResolved: number;
 
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
