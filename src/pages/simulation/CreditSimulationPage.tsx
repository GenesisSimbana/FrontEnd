import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { originacionService } from '../../services/originacionService';
import { concesionarioApiService } from '../../services/concesionarioApiService';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import type { 
  SimulacionCreditoResponseDTO,
  Concesionario,
  VehiculoEnConcesionario
} from '../../types/automotive-loan';

const simulationSchema = z.object({
  placaVehiculo: z.string().min(1, 'Debe ingresar la placa del vehículo'),
  rucConcesionario: z.string().min(1, 'Debe ingresar el RUC del concesionario'),
  montoSolicitado: z.number().min(1000, 'El monto mínimo es $1,000').max(100000, 'El monto máximo es $100,000'),
  plazoMeses: z.number().min(12, 'Mínimo 12 meses').max(84, 'Máximo 84 meses'),
  tasaInteres: z.number().min(1, 'La tasa mínima es 1%').max(50, 'La tasa máxima es 50%'),
});

type SimulationFormData = z.infer<typeof simulationSchema>;

const CreditSimulationPage: React.FC = () => {
  const [concesionarios, setConcesionarios] = useState<Concesionario[]>([]);
  const [vehiculos, setVehiculos] = useState<VehiculoEnConcesionario[]>([]);

  const [selectedVehiculo, setSelectedVehiculo] = useState<VehiculoEnConcesionario | null>(null);
  const [simulation, setSimulation] = useState<SimulacionCreditoResponseDTO | null>(null);
  const [activeTab, setActiveTab] = useState<'resumen' | 'conEntrada' | 'sinEntrada' | 'plazoMaximo'>('resumen');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SimulationFormData>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      tasaInteres: 15,
      plazoMeses: 36,
    }
  });

  const placaVehiculo = watch('placaVehiculo');
  const rucConcesionario = watch('rucConcesionario');
  const montoSolicitado = watch('montoSolicitado');

  // Cargar concesionarios activos
  const { loading: loadingConcesionarios, execute: fetchConcesionarios } = useApi(
    () => concesionarioApiService.getConcesionariosByEstado('ACTIVO'),
    {
      onSuccess: (data) => setConcesionarios(data),
    }
  );

  // Cargar vehículos de un concesionario
  const { loading: loadingVehiculos, execute: fetchVehiculos } = useApi(
    (ruc: string) => concesionarioApiService.getVehiculosByRuc(ruc),
    {
      onSuccess: (data) => {
        // Filtrar solo vehículos disponibles
        const vehiculosDisponibles = data.filter((vehiculo: VehiculoEnConcesionario) => vehiculo.estado === 'DISPONIBLE');
        setVehiculos(vehiculosDisponibles);
      },
    }
  );

  // Simular crédito
  const { loading: simulating, execute: simularCredito } = useApi(
    originacionService.simularCredito,
    {
      onSuccess: (data) => setSimulation(data),
      showSuccessToast: true,
      successMessage: 'Simulación generada exitosamente',
    }
  );

  useEffect(() => {
    fetchConcesionarios();
  }, []);

  useEffect(() => {
    if (rucConcesionario) {
      fetchVehiculos(rucConcesionario);
    } else {
      setVehiculos([]);
    }
  }, [rucConcesionario, concesionarios]);

  useEffect(() => {
    if (placaVehiculo && vehiculos.length > 0) {
      const vehiculo = vehiculos.find(v => v.placa === placaVehiculo);
      setSelectedVehiculo(vehiculo || null);
      
      // Establecer el valor del vehículo si está disponible
      if (vehiculo?.valor && !montoSolicitado) {
        setValue('montoSolicitado', vehiculo.valor);
      }
    } else {
      setSelectedVehiculo(null);
    }
  }, [placaVehiculo, vehiculos, montoSolicitado]);

  const onSubmit = (data: SimulationFormData) => {
    simularCredito(data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Simulador de Crédito Automotriz</h1>
        <p className="mt-2 text-gray-600">
          Calcula tu cuota mensual y conoce las condiciones de tu crédito
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simulation Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Datos de la Simulación</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Concesionario Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concesionario
              </label>
              <select
                {...register('rucConcesionario')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingConcesionarios}
              >
                <option value="">Seleccionar concesionario...</option>
                {concesionarios.map((concesionario) => (
                  <option key={concesionario.ruc} value={concesionario.ruc}>
                    {concesionario.razonSocial} - {concesionario.ruc}
                  </option>
                ))}
              </select>
              {errors.rucConcesionario && (
                <p className="mt-1 text-sm text-red-600">{errors.rucConcesionario.message}</p>
              )}
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehículo (Placa)
              </label>
              <select
                {...register('placaVehiculo')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingVehiculos || !rucConcesionario}
              >
                <option value="">Seleccionar vehículo...</option>
                {vehiculos.map((vehiculo) => (
                  <option key={vehiculo.placa} value={vehiculo.placa}>
                    {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
                    {vehiculo.valor && ` - ${formatCurrency(vehiculo.valor)}`}
                  </option>
                ))}
              </select>
              {errors.placaVehiculo && (
                <p className="mt-1 text-sm text-red-600">{errors.placaVehiculo.message}</p>
              )}
            </div>

            {/* Selected Vehicle Info */}
            {selectedVehiculo && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900">Vehículo Seleccionado</h3>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Placa:</span> {selectedVehiculo.placa}
                  </div>
                  <div>
                    <span className="text-blue-700">Marca:</span> {selectedVehiculo.marca}
                  </div>
                  <div>
                    <span className="text-blue-700">Modelo:</span> {selectedVehiculo.modelo}
                  </div>
                  <div>
                    <span className="text-blue-700">Año:</span> {selectedVehiculo.anio}
                  </div>
                  {selectedVehiculo.valor && (
                    <div>
                      <span className="text-blue-700">Valor:</span> {formatCurrency(selectedVehiculo.valor)}
                    </div>
                  )}
                  <div>
                    <span className="text-blue-700">Condición:</span> {selectedVehiculo.condicion}
                  </div>
                </div>
              </div>
            )}

            {/* Requested Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto Solicitado (USD)
              </label>
              <Input
                type="number"
                {...register('montoSolicitado', { valueAsNumber: true })}
                placeholder="Monto a solicitar"
                error={errors.montoSolicitado?.message}
              />
            </div>

            {/* Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plazo (meses)
              </label>
              <select
                {...register('plazoMeses', { valueAsNumber: true })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar plazo...</option>
                {[12, 18, 24, 36, 48, 60, 72, 84].map((months) => (
                  <option key={months} value={months}>
                    {months} meses ({(months / 12).toFixed(1)} años)
                  </option>
                ))}
              </select>
              {errors.plazoMeses && (
                <p className="mt-1 text-sm text-red-600">{errors.plazoMeses.message}</p>
              )}
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Interés (%)
              </label>
              <Input
                type="number"
                step="0.01"
                {...register('tasaInteres', { valueAsNumber: true })}
                placeholder="Tasa de interés anual"
                error={errors.tasaInteres?.message}
              />
            </div>

            <Button 
              type="submit" 
              fullWidth 
              loading={simulating}
              disabled={!rucConcesionario || !placaVehiculo}
            >
              Simular Crédito
            </Button>
          </form>
        </div>

        {/* Simulation Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultados de la Simulación</h2>
          
          {!simulation ? (
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">🧮</div>
              <p>Complete el formulario para ver los resultados de su simulación</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('resumen')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'resumen'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Resumen
                  </button>
                  <button
                    onClick={() => setActiveTab('conEntrada')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'conEntrada'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Con Entrada 20%
                  </button>
                  <button
                    onClick={() => setActiveTab('sinEntrada')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'sinEntrada'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Sin Entrada
                  </button>
                  <button
                    onClick={() => setActiveTab('plazoMaximo')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'plazoMaximo'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Plazo Máximo
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'resumen' && (
                <div className="space-y-6">
                  {/* Vehicle Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Información del Vehículo</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Placa:</span> {simulation.placaVehiculo}
                      </div>
                      <div>
                        <span className="text-gray-600">Valor:</span> {formatCurrency(simulation.valorVehiculo)}
                      </div>
                      <div>
                        <span className="text-gray-600">Monto Solicitado:</span> {formatCurrency(simulation.montoSolicitado)}
                      </div>
                      <div>
                        <span className="text-gray-600">Tasa de Interés:</span> {formatPercentage(simulation.tasaInteres * 100)}
                      </div>
                    </div>
                  </div>

                  {/* Scenarios Summary */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Escenarios de Financiamiento</h3>
                    <div className="space-y-4">
                      {simulation.resumenEscenarios.map((escenario, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{escenario.nombreEscenario}</h4>
                          <p className="text-sm text-gray-600 mb-3">{escenario.descripcion}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Cuota Mensual:</span>
                              <div className="font-bold text-blue-600">{formatCurrency(escenario.cuotaMensual)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Monto Financiado:</span>
                              <div className="font-medium">{formatCurrency(escenario.montoFinanciado)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Plazo:</span>
                              <div className="font-medium">{escenario.plazoMeses} meses</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Total a Pagar:</span>
                              <div className="font-medium">{formatCurrency(escenario.montoTotal)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Total Intereses:</span>
                              <div className="font-medium">{formatCurrency(escenario.totalIntereses)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Entrada:</span>
                              <div className="font-medium">{formatCurrency(escenario.entrada)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tabla de Amortización */}
              {(activeTab === 'conEntrada' || activeTab === 'sinEntrada' || activeTab === 'plazoMaximo') && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Tabla de Amortización - {
                      activeTab === 'conEntrada' ? 'Con Entrada 20%' :
                      activeTab === 'sinEntrada' ? 'Sin Entrada' : 'Plazo Máximo'
                    }
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">Cuota</th>
                          <th className="px-3 py-2 text-left">Saldo Inicial</th>
                          <th className="px-3 py-2 text-left">Cuota</th>
                          <th className="px-3 py-2 text-left">Abono Capital</th>
                          <th className="px-3 py-2 text-left">Interés</th>
                          <th className="px-3 py-2 text-left">Saldo Final</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {(activeTab === 'conEntrada' ? simulation.tablaConEntrada20 :
                          activeTab === 'sinEntrada' ? simulation.tablaSinEntrada :
                          simulation.tablaPlazoMaximo).slice(0, 12).map((cuota) => (
                          <tr key={cuota.numeroCuota}>
                            <td className="px-3 py-2">{cuota.numeroCuota}</td>
                            <td className="px-3 py-2">{formatCurrency(cuota.saldoInicial)}</td>
                            <td className="px-3 py-2 font-medium">{formatCurrency(cuota.cuota)}</td>
                            <td className="px-3 py-2">{formatCurrency(cuota.abonoCapital)}</td>
                            <td className="px-3 py-2">{formatCurrency(cuota.interes)}</td>
                            <td className="px-3 py-2">{formatCurrency(cuota.saldoFinal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Mostrando las primeras 12 cuotas de {
                      activeTab === 'conEntrada' ? simulation.tablaConEntrada20.length :
                      activeTab === 'sinEntrada' ? simulation.tablaSinEntrada.length :
                      simulation.tablaPlazoMaximo.length
                    } cuotas totales
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button variant="secondary" fullWidth>
                  Descargar PDF
                </Button>
                <Button fullWidth>
                  Aplicar al Crédito
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditSimulationPage;