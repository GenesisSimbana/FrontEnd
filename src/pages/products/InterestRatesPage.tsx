import React from 'react';
import Button from '../../components/ui/Button';

const InterestRatesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasas de Interés</h1>
        <Button>Nueva Tasa</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gestión de Tasas de Interés
          </h3>
          <p className="text-gray-600">
            Configura y administra las tasas de interés por producto, plazo y categoría de vehículo.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900">Tasa Promedio</h4>
              <p className="text-2xl font-bold text-blue-600">0.00%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900">Tasas Activas</h4>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestRatesPage;