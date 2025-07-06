import type { Concesionario, Vendedor, VehiculoEnConcesionario, IdentificadorVehiculo } from '../types/automotive-loan';
import api from './api';

// Concesionarios
export const getConcesionarioByRuc = (ruc: string) => api.get<Concesionario>(`/concesionarios/ruc/${ruc}`);
export const getConcesionariosByEstado = (estado: string) => api.get<Concesionario[]>(`/concesionarios/estado/${estado}`);
export const getConcesionariosByRazonSocial = (razonSocial: string) => api.get<Concesionario[]>(`/concesionarios/razon-social/${razonSocial}`);
export const getConcesionarioByEmail = (email: string) => api.get<Concesionario>(`/concesionarios/email/${email}`);
export const createConcesionario = (data: Partial<Concesionario>) => api.post<Concesionario>('/concesionarios', data);
export const updateConcesionario = (ruc: string, data: Partial<Concesionario>) => api.put<Concesionario>(`/concesionarios/ruc/${ruc}`, data);
export const desactivarConcesionario = (ruc: string) => api.put<Concesionario>(`/concesionarios/ruc/${ruc}/desactivar`);

// Vendedores
export const getVendedoresByRuc = (ruc: string) => api.get<Vendedor[]>(`/concesionarios/ruc/${ruc}/vendedores`);
export const createVendedor = (ruc: string, data: Partial<Vendedor>) => api.post<Vendedor>(`/concesionarios/ruc/${ruc}/vendedores`, data);
export const updateVendedor = (ruc: string, cedula: string, data: Partial<Vendedor>) => api.put<Vendedor>(`/concesionarios/ruc/${ruc}/vendedores/${cedula}`, data);
export const desactivarVendedor = (ruc: string, cedula: string) => api.put<Vendedor>(`/concesionarios/ruc/${ruc}/vendedores/${cedula}/desactivar`);
export const getVendedorByCedula = (ruc: string, cedula: string) => api.get<Vendedor>(`/concesionarios/ruc/${ruc}/vendedores/cedula/${cedula}`);
export const getVendedoresByEstado = (ruc: string, estado: string) => api.get<Vendedor[]>(`/concesionarios/ruc/${ruc}/vendedores/estado/${estado}`);
export const getVendedorByEmail = (ruc: string, email: string) => api.get<Vendedor>(`/concesionarios/ruc/${ruc}/vendedores/email/${email}`);
export const getVendedoresByNombre = (ruc: string, nombre: string) => api.get<Vendedor[]>(`/concesionarios/ruc/${ruc}/vendedores/nombre/${nombre}`);

// Vehículos en concesionario
export const getVehiculosByRuc = (ruc: string) => api.get<VehiculoEnConcesionario[]>(`/concesionarios/ruc/${ruc}/vehiculos`);
export const createVehiculo = (ruc: string, data: Partial<VehiculoEnConcesionario>) => api.post<VehiculoEnConcesionario>(`/concesionarios/ruc/${ruc}/vehiculos`, data);
export const updateVehiculo = (ruc: string, placa: string, data: Partial<VehiculoEnConcesionario>) => api.put<VehiculoEnConcesionario>(`/concesionarios/ruc/${ruc}/vehiculos/${placa}`, data);
export const desactivarVehiculo = (ruc: string, placa: string) => api.put<VehiculoEnConcesionario>(`/concesionarios/ruc/${ruc}/vehiculos/${placa}/desactivar`);
export const getVehiculosByEstado = (ruc: string, estado: string) => api.get<VehiculoEnConcesionario[]>(`/concesionarios/ruc/${ruc}/vehiculos/estado/${estado}`);
export const getVehiculosByCondicion = (ruc: string, condicion: string) => api.get<VehiculoEnConcesionario[]>(`/concesionarios/ruc/${ruc}/vehiculos/condicion/${condicion}`);
export const getVehiculoByPlaca = (ruc: string, placa: string) => api.get<VehiculoEnConcesionario>(`/concesionarios/ruc/${ruc}/vehiculos/placa/${placa}`);

// Identificadores de vehículo
export const createIdentificadorVehiculo = (data: Partial<IdentificadorVehiculo>) => api.post<IdentificadorVehiculo>('/concesionarios/identificadores-vehiculo', data);
export const getIdentificadorVehiculoById = (id: string) => api.get<IdentificadorVehiculo>(`/concesionarios/identificadores-vehiculo/${id}`); 