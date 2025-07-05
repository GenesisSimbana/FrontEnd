import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { simulationService } from '../../services/simulationService';
import { vehicleService } from '../../services/vehicleService';
import { creditProductService } from '../../services/creditProductService';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import type { Vehicle, CreditProduct, CreditSimulation } from '../../types/automotive-loan';

const simulationSchema = z.object({
  vehicleId: z.string().min(1, 'Debe seleccionar un vehículo'),
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  downPayment: z.number().min(0, 'El valor debe ser mayor a 0'),
  termMonths: z.number().min(12, 'Mínimo 12 meses').max(84, 'Máximo 84 meses'),
});

type SimulationFormData = z.infer<typeof simulationSchema>;

const CreditSimulationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [products, setProducts] = useState<CreditProduct[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<CreditProduct | null>(null);
  const [simulation, setSimulation] = useState<CreditSimulation | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SimulationFormData>({
    resolver: zodResolver(simulationSchema),
  });

  const vehicleId = watch('vehicleId');
  const productId = watch('productId');
  const downPayment = watch('downPayment');

  const { loading: loadingVehicles, execute: fetchVehicles } = useApi(
    vehicleService.getVehicles,
    {
      onSuccess: (data) => setVehicles(data.data),
    }
  );

  const { loading: loadingProducts, execute: fetchProducts } = useApi(
    creditProductService.getActiveCreditProducts,
    {
      onSuccess: (data) => setProducts(data),
    }
  );

  const { loading: simulating, execute: createSimulation } = useApi(
    simulationService.createSimulation,
    {
      onSuccess: (data) => setSimulation(data),
      showSuccessToast: true,
      successMessage: 'Simulación generada exitosamente',
    }
  );

  useEffect(() => {
    fetchVehicles({ isAvailable: true, pageSize: 100 });
    fetchProducts();
    
    // Pre-select vehicle if provided in URL
    const vehicleIdParam = searchParams.get('vehicleId');
    if (vehicleIdParam) {
      setValue('vehicleId', vehicleIdParam);
    }
  }, []);

  useEffect(() => {
    if (vehicleId && vehicles.length > 0) {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      setSelectedVehicle(vehicle || null);
      
      // Set minimum down payment (usually 10% of vehicle price)
      if (vehicle && !downPayment) {
        setValue('downPayment', Math.round(vehicle.price * 0.1));
      }
    }
  }, [vehicleId, vehicles]);

  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find(p => p.id === productId);
      setSelectedProduct(product || null);
    }
  }, [productId, products]);

  const onSubmit = (data: SimulationFormData) => {
    createSimulation({
      vehicleId: data.vehicleId,
      productId: data.productId,
      downPayment: data.downPayment,
      termMonths: data.termMonths,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const loanAmount = selectedVehicle && downPayment 
    ? selectedVehicle.price - downPayment 
    : 0;

  const downPaymentPercentage = selectedVehicle && downPayment
    ? (downPayment / selectedVehicle.price) * 100
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehículo
              </label>
              <select
                {...register('vehicleId')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingVehicles}
              >
                <option value="">Seleccionar vehículo...</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} {vehicle.year} - {formatCurrency(vehicle.price)}
                  </option>
                ))}
              </select>
              {errors.vehicleId && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>
              )}
            </div>

            {/* Selected Vehicle Info */}
            {selectedVehicle && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900">Vehículo Seleccionado</h3>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Marca:</span> {selectedVehicle.make}
                  </div>
                  <div>
                    <span className="text-blue-700">Modelo:</span> {selectedVehicle.model}
                  </div>
                  <div>
                    <span className="text-blue-700">Año:</span> {selectedVehicle.year}
                  </div>
                  <div>
                    <span className="text-blue-700">Precio:</span> {formatCurrency(selectedVehicle.price)}
                  </div>
                </div>
              </div>
            )}

            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto de Crédito
              </label>
              <select
                {...register('productId')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingProducts}
              >
                <option value="">Seleccionar producto...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - Tasa desde {product.baseInterestRate}%
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
              )}
            </div>

            {/* Selected Product Info */}
            {selectedProduct && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900">Producto Seleccionado</h3>
                <p className="text-sm text-green-700 mt-1">{selectedProduct.description}</p>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Monto min:</span> {formatCurrency(selectedProduct.minAmount)}
                  </div>
                  <div>
                    <span className="text-green-700">Monto max:</span> {formatCurrency(selectedProduct.maxAmount)}
                  </div>
                  <div>
                    <span className="text-green-700">Plazo min:</span> {selectedProduct.minTermMonths} meses
                  </div>
                  <div>
                    <span className="text-green-700">Plazo max:</span> {selectedProduct.maxTermMonths} meses
                  </div>
                </div>
              </div>
            )}

            {/* Down Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrada (USD)
              </label>
              <Input
                type="number"
                {...register('downPayment', { valueAsNumber: true })}
                placeholder="Valor de la entrada"
                error={errors.downPayment?.message}
              />
              {selectedVehicle && downPayment && (
                <p className="mt-1 text-sm text-gray-600">
                  {downPaymentPercentage.toFixed(1)}% del precio del vehículo
                </p>
              )}
            </div>

            {/* Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plazo (meses)
              </label>
              <select
                {...register('termMonths', { valueAsNumber: true })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar plazo...</option>
                {[12, 18, 24, 36, 48, 60, 72, 84].map((months) => (
                  <option key={months} value={months}>
                    {months} meses ({(months / 12).toFixed(1)} años)
                  </option>
                ))}
              </select>
              {errors.termMonths && (
                <p className="mt-1 text-sm text-red-600">{errors.termMonths.message}</p>
              )}
            </div>

            {/* Loan Amount Summary */}
            {selectedVehicle && downPayment && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Resumen</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Precio del vehículo:</span>
                    <span className="font-medium">{formatCurrency(selectedVehicle.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrada:</span>
                    <span className="font-medium">{formatCurrency(downPayment)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Monto a financiar:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(loanAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              fullWidth 
              loading={simulating}
              disabled={!selectedVehicle || !selectedProduct}
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
              {/* Monthly Payment */}
              <div className="text-center bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Cuota Mensual</h3>
                <p className="text-4xl font-bold text-blue-600">
                  {formatCurrency(simulation.monthlyPayment)}
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Por {simulation.termMonths} meses
                </p>
              </div>

              {/* Simulation Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Tasa de Interés</h4>
                  <p className="text-2xl font-bold text-gray-600">{simulation.interestRate}%</p>
                  <p className="text-sm text-gray-500">Anual</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Total a Pagar</h4>
                  <p className="text-lg font-bold text-gray-600">
                    {formatCurrency(simulation.totalAmount)}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Total Intereses</h4>
                  <p className="text-lg font-bold text-gray-600">
                    {formatCurrency(simulation.totalInterest)}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Monto Financiado</h4>
                  <p className="text-lg font-bold text-gray-600">
                    {formatCurrency(simulation.loanAmount)}
                  </p>
                </div>
              </div>

              {/* Payment Schedule Preview */}
              {simulation.paymentSchedule && simulation.paymentSchedule.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Primeras Cuotas</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">Cuota</th>
                          <th className="px-3 py-2 text-left">Capital</th>
                          <th className="px-3 py-2 text-left">Interés</th>
                          <th className="px-3 py-2 text-left">Saldo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {simulation.paymentSchedule.slice(0, 5).map((payment) => (
                          <tr key={payment.paymentNumber}>
                            <td className="px-3 py-2">{payment.paymentNumber}</td>
                            <td className="px-3 py-2">{formatCurrency(payment.principalAmount)}</td>
                            <td className="px-3 py-2">{formatCurrency(payment.interestAmount)}</td>
                            <td className="px-3 py-2">{formatCurrency(payment.remainingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {simulation.paymentSchedule.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Y {simulation.paymentSchedule.length - 5} cuotas más...
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="secondary" fullWidth>
                  Ver Tabla Completa
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