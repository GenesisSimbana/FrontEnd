// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Microservices endpoints - Sistema de Préstamos Automotrices
export const MICROSERVICES = {
  // Análisis Services
  ORIGINACION: import.meta.env.VITE_ORIGINACION_SERVICE_URL || 'http://18.223.158.69:8081',
  VEHICULOS: import.meta.env.VITE_VEHICULOS_SERVICE_URL || 'http://18.223.158.69:8082',
  FORMALIZACION: import.meta.env.VITE_FORMALIZACION_SERVICE_URL || 'http://18.223.158.69:8083',
  
  // Core Services
  GENERAL: import.meta.env.VITE_GENERAL_SERVICE_URL || 'http://3.129.67.241:8084',
  CLIENTES: import.meta.env.VITE_CLIENTES_SERVICE_URL || 'http://3.129.67.241:8083',
  CUENTAS_CONFIG: import.meta.env.VITE_CUENTAS_CONFIG_SERVICE_URL || 'http://3.129.67.241:8082',
  CUENTAS_TRANS: import.meta.env.VITE_CUENTAS_TRANS_SERVICE_URL || 'http://3.129.67.241:8085',
  TRANSACCIONES: import.meta.env.VITE_TRANSACCIONES_SERVICE_URL || 'http://3.129.67.241:8080',
  CATALOG: import.meta.env.VITE_CATALOG_SERVICE_URL || 'http://3.129.67.241:8081',
  
  // Legacy compatibility
  VEHICLES: import.meta.env.VITE_VEHICULOS_SERVICE_URL || 'http://18.223.158.69:8082',
  CREDIT_PRODUCTS: import.meta.env.VITE_CATALOG_SERVICE_URL || 'http://3.129.67.241:8081',
  SIMULATION: import.meta.env.VITE_ORIGINACION_SERVICE_URL || 'http://18.223.158.69:8081',
  LOANS: import.meta.env.VITE_ORIGINACION_SERVICE_URL || 'http://18.223.158.69:8081',
  ANALYSIS: import.meta.env.VITE_ORIGINACION_SERVICE_URL || 'http://18.223.158.69:8081',
  CONTRACTS: import.meta.env.VITE_FORMALIZACION_SERVICE_URL || 'http://18.223.158.69:8083',
  INTEREST: import.meta.env.VITE_CATALOG_SERVICE_URL || 'http://3.129.67.241:8081',
  NOTIFICATIONS: import.meta.env.VITE_GENERAL_SERVICE_URL || 'http://3.129.67.241:8084',
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