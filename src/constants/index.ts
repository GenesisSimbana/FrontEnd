// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Microservices endpoints - Sistema de Préstamos Automotrices
export const MICROSERVICES = {
  VEHICLES: import.meta.env.VITE_VEHICLE_SERVICE_URL || '/api/vehicles',
  CREDIT_PRODUCTS: import.meta.env.VITE_CREDIT_PRODUCTS_SERVICE_URL || '/api/products',
  SIMULATION: import.meta.env.VITE_SIMULATION_SERVICE_URL || '/api/simulation',
  LOANS: import.meta.env.VITE_LOAN_SERVICE_URL || '/api/loans',
  ANALYSIS: import.meta.env.VITE_ANALYSIS_SERVICE_URL || '/api/analysis',
  CONTRACTS: import.meta.env.VITE_CONTRACT_SERVICE_URL || '/api/contracts',
  INTEREST: import.meta.env.VITE_INTEREST_SERVICE_URL || '/api/interest',
  NOTIFICATIONS: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || '/api/notifications',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  LOADING_DELAY: 200,
} as const;

// Routes - Sistema de Préstamos Automotrices
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  VEHICLES: '/vehicles',
  PRODUCTS: '/products',
  PRODUCTS_INTEREST: '/products/interest',
  CREDIT_SIMULATION: '/credit-simulation',
  LOANS: '/loans',
  ANALYSIS: '/analysis',
  CONTRACTS: '/contracts',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
  CONCESIONARIOS: '/concesionarios',
} as const;

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 50,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
} as const;

// Environment
export const ENV = {
  PROD: 'production',
  DEV: 'development',
  TEST: 'test',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;