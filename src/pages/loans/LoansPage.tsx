import React from 'react';
import Button from '../../components/ui/Button';

const LoansPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Préstamo</h1>
        <Button>Nueva Solicitud</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Administración de Solicitudes
          </h3>
          <p className="text-gray-600">
            Gestiona las solicitudes de préstamo desde el registro hasta la aprobación final.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900">Pendientes</h4>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900">En Revisión</h4>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900">Aprobadas</h4>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900">Rechazadas</h4>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;