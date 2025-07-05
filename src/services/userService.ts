import { apiService } from './api';
import type { User, PaginatedResponse } from '../types';
import { MICROSERVICES } from '../constants';

export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

class UserService {
  async getUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${MICROSERVICES.USERS}?${queryParams.toString()}`;
    return apiService.get<PaginatedResponse<User>>(url);
  }

  async getUserById(id: string): Promise<User> {
    return apiService.get<User>(`${MICROSERVICES.USERS}/${id}`);
  }

  async createUser(data: CreateUserData): Promise<User> {
    return apiService.post<User>(MICROSERVICES.USERS, data);
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return apiService.put<User>(`${MICROSERVICES.USERS}/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return apiService.delete<void>(`${MICROSERVICES.USERS}/${id}`);
  }

  async activateUser(id: string): Promise<User> {
    return apiService.post<User>(`${MICROSERVICES.USERS}/${id}/activate`);
  }

  async deactivateUser(id: string): Promise<User> {
    return apiService.post<User>(`${MICROSERVICES.USERS}/${id}/deactivate`);
  }

  async bulkDeleteUsers(ids: string[]): Promise<void> {
    return apiService.post<void>(`${MICROSERVICES.USERS}/bulk-delete`, { ids });
  }

  async exportUsers(params?: UserQueryParams): Promise<void> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${MICROSERVICES.USERS}/export?${queryParams.toString()}`;
    return apiService.downloadFile(url, 'users.csv');
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
  }> {
    return apiService.get<{
      total: number;
      active: number;
      inactive: number;
      byRole: Record<string, number>;
    }>(`${MICROSERVICES.USERS}/stats`);
  }
}

export const userService = new UserService();
export default userService;