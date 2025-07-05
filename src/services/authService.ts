import { apiService } from './api';
import type { User, LoginCredentials, RegisterData } from '../types';
import { MICROSERVICES } from '../constants';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(`${MICROSERVICES.AUTH}/login`, credentials);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(`${MICROSERVICES.AUTH}/register`, data);
  }

  async logout(): Promise<void> {
    return apiService.post<void>(`${MICROSERVICES.AUTH}/logout`);
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return apiService.post<RefreshTokenResponse>(`${MICROSERVICES.AUTH}/refresh`, {
      refreshToken,
    });
  }

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>(`${MICROSERVICES.AUTH}/me`);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiService.put<User>(`${MICROSERVICES.AUTH}/profile`, data);
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    return apiService.post<void>(`${MICROSERVICES.AUTH}/change-password`, data);
  }

  async forgotPassword(email: string): Promise<void> {
    return apiService.post<void>(`${MICROSERVICES.AUTH}/forgot-password`, { email });
  }

  async resetPassword(data: { token: string; newPassword: string }): Promise<void> {
    return apiService.post<void>(`${MICROSERVICES.AUTH}/reset-password`, data);
  }

  async verifyEmail(token: string): Promise<void> {
    return apiService.post<void>(`${MICROSERVICES.AUTH}/verify-email`, { token });
  }

  async resendVerificationEmail(): Promise<void> {
    return apiService.post<void>(`${MICROSERVICES.AUTH}/resend-verification`);
  }
}

export const authService = new AuthService();
export default authService;